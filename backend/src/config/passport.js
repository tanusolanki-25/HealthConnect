import passport from "passport";
import dotenv from "dotenv"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import prisma from "../lib/prisma.js";

dotenv.config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_URL
}, async(accessToken, refreshToken, profile, done)=>{
    try {
      let user = await prisma.user.findUnique({
        where:{
          googleId: profile.id,
        }
      })
      if(!user){
        user = await prisma.user.create({
          data:{
          googleId: profile.id,
          email: profile.emails[0].value,
          passwordHash: null,   // OAuth user ka password nahi hota
          verified: true,
          isEmailValid: true
          }
        })
      }
      return done(null, user)
    } catch (error) {
      return done(error, null)
    }
})
)

passport.serializeUser((user, done) =>{
  return done(null, user.id)
})


passport.deserializeUser(async(id, done) =>{
  try {
    const user = await prisma.user.findUnique({
      where:{id}
    })
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

export default passport