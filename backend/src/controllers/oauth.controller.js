import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"
import { googleClient } from "../lib/googleClient.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"
  })

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
  })

// ---------- STEP 1: user "Continue with Google" dabata hai, yahan aata hai ----------
const googleRedirect = (req, res) => {
  const authUrl = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    prompt: "consent"
  })

  res.redirect(authUrl) // Google ki apni login screen pe bhej diya
}

// ---------- STEP 2: Google wapas isी route pe bhejta hai, "code" ke saath ----------
const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`)
  }

  // "code" ko Google ke access token se exchange karo
  const { tokens } = await googleClient.getToken(code)
  googleClient.setCredentials(tokens)

  // us access token se Google se user ki profile info maango
  const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })
  const googleProfile = await userInfoRes.json()
  // googleProfile = { id, email, name, picture, ... }

  // kya is email ka user pehle se hai?
  let user = await prisma.user.findUnique({
    where: { email: googleProfile.email },
    include: { oauthAccount: true }
  })

  if (user) {
    // user exist karta hai — agar OAuth account link nahi hai, ab link kar do
    if (!user.oauthAccount) {
      await prisma.oauthAccount.create({
        data: {
          userId: user.id,
          provider: "google",
          providerAccountId: googleProfile.id
        }
      })
    }
  } else {
    // bilkul naya user — role abhi NULL rahega, baad mein select karega
    user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: googleProfile.email,
          passwordHash: null,
          role: null
        }
      })

      await tx.oauthAccount.create({
        data: {
          userId: newUser.id,
          provider: "google",
          providerAccountId: googleProfile.id
        }
      })

      return newUser
    })
  }

  // ab chahe naya ho ya purana, login karao — same tarika jo normal login mein hai
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } })

  const options = { httpOnly: true, secure: true, sameSite: "none" }

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect(`${process.env.FRONTEND_URL}/oauth-redirect`) // frontend yahan decide karega age kahan bhejna hai
})

export { googleRedirect, googleCallback }