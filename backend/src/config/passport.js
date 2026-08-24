import passport from "passport";
import dotenv from "dotenv"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import prisma from "../lib/prisma.js";
import { createUserWithOauth, getUserWithOauthId, linkUserWithOauth } from "../utils/hasAccess.js";

dotenv.config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_URL
}, async(accessToken, refreshToken, profile, done)=>{
    try {
      let user = await getUserWithOauthId({email: profile.emails[0].value, provider: "google"})

      if(user && !user.providerAccountId){
       await linkUserWithOauth(user.id, "google", profile.id)   
      }
       
      if(!user){
        user = await createUserWithOauth({
        email: profile.emails[0].value,
        provider: "google",
        providerAccountId: profile.id,
        refreshToken
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