import jwt from "jsonwebtoken"
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import prisma from "../lib/prisma.js"
import { hashedPassword, verifyPassword } from "../utils/bcrypt.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"
import { client, sendEmail } from "../service/email.service.js"
import { getOtpHtml, generateOTP } from "../service/generateOtp.js"
import { generateState, generateCodeVerifier, decodeIdToken } from "arctic";
import { google } from "../lib/oauth/google.js"
import { OAUTH_EXCHANGE_EXPIRY } from "../config/constant.js"
import { createUserWithOauth, getUserWithOauthId, linkUserWithOauth } from "../utils/hasAccess.js"


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    const accessToken = await generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user)

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(400, "Something went wrong while generating access and refresh token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body
  if ([email, password, role].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existedUser) {
    throw new ApiError(409, "User with this email already exists")
  }

  const passwordHash = await hashedPassword(password)

  const user = await prisma.user.create({
    data: { email, passwordHash, role }
  })

  const otp = await generateOTP()
  const html = await getOtpHtml(otp)

  const otpHash = await hashedPassword(otp)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.otp.create({
  data: {
    email,
    userId: user.id,
    otpHash,
    expiresAt,
  }
});

  try {
    await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html)
  } catch (error) {
     console.error(error);
  }

  const createdUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      role: true,
      verified: true
    }
  })

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  )
})

const verifyEmail = asyncHandler(async(req, res)=>{
   const {otp, email} = req.body
   const otpHash = await hashedPassword(otp)

   const otpDoc = await prisma.otp.findUnique({
    where:{
      email,
    }
   })

   if (!otpDoc) {
  throw new ApiError(400, "OTP not found");
}

   if (otpDoc.expiresAt < new Date()) {
    await prisma.otp.delete({
      where: {
        email,
      },
    });

    throw new ApiError(400, "OTP has expired");
  }

   const isValid = await verifyPassword(otp, otpDoc.otpHash)

   if (!isValid) {
    throw new ApiError(400, "Invalid OTP");
   }

   if(otpDoc.expiresAt > new Date()){
     await prisma.user.update({
     where:{
      id: otpDoc.userId
     },
     data:{
      verified: true
     }
   })
  }

   await prisma.otp.delete({
     where:{
      userId: otpDoc.userId
     }
   })

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(otpDoc.userId)

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }

   const loggedInUser = await prisma.user.findUnique({
    where: { id: otpDoc.userId },
    select: {
      email: true,
      role: true
    }
  })

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, refreshToken, accessToken },
        "User logged in successfully"
      )
    )
})

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.verified) {
    throw new ApiError(400, "Email already verified");
  }

  const otp = generateOTP();
  const otpHash = await hashedPassword(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otp.upsert({
    where: { email },
    update: {
      otpHash,
      expiresAt,
    },
    create: {
      email,
      otpHash,
      userId: user.id,
      expiresAt,
    }
  });

  const html = await getOtpHtml(otp);

  await sendEmail(
    email,
    "New OTP Verification",
    `Your OTP is ${otp}`,
    html
  );

  return res.status(200).json(
    new ApiResponse(200, null, "OTP sent successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    throw new ApiError(400, "Email is required")
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })


  if (!user) {
    throw new ApiError(404, "Don't have an account with this email")
  }

  if(!user.verified){
    throw new ApiError(403, "User does not verified")
  } 

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    throw new ApiError(401, "Password is not valid")
  }

  await prisma.user.update({
    where: { email },
    data: {
      isEmailValid: true
    }
  })

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id)

  const loggedInUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      email: true,
      role: true
    }
  })

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, refreshToken, accessToken },
        "User logged in successfully"
      )
    )
})

const getGoogleLoginPage = asyncHandler(async(req, res)=>{
   if(req.user){
     throw new ApiError(401, "User already logged")
   }

   const state = generateState()
   const codeVerifier = generateCodeVerifier();

   const url = google.createAuthorizationURL(state, codeVerifier, [
     "openid",
     "profile",
     "email"
   ]);
    
   console.log("Google Login Route Hit");
console.log("Generated state:", state);
   
   const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: OAUTH_EXCHANGE_EXPIRY,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
   }

  res.cookie("google_oauth_state", state, cookieConfig)
  res.cookie("google_code_verifier", codeVerifier, cookieConfig)
  console.log(res.getHeaders()["set-cookie"]);
  res.redirect(url.toString())
})

const getGoogleLoginCallback = asyncHandler(async(req, res)=>{
   const {code, state} = req.query

   const {
    google_oauth_state: storedState,
    google_code_verifier: codeVerifier
   } = req.cookies

   console.log({
  code,
  state,
  storedState,
  codeVerifier,
  cookies: req.cookies
});

   if(
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state != storedState
   ){
     return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_oauth`)
   }

   console.log("Callback state:", state);
console.log("Cookie state:", storedState);

   let tokens;
   try {
     tokens = await google.validateAuthorizationCode(code, codeVerifier)
   } catch (err) {
       console.error(err);
     return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_oauth`)
   }

   const claims = decodeIdToken(tokens.idToken())
   const {sub: googleUserId, name, email} = claims

  let user = await getUserWithOauthId({ email, provider: "google" })
  if(user && !user.providerAccountId){
    await linkUserWithOauth(user.id, "google", googleUserId)
  }

  if(!user){
    user = await createUserWithOauth({
      name,
      email,
      provider: "google",
      providerAccountId: googleUserId
    })
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id)

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }

  res.cookie("refreshToken", refreshToken, options)
  res.cookie("accessToken", accessToken, options)

  if (!user.role) {
    return res.redirect(`${process.env.FRONTEND_URL}/set-role`)
  }

  return res.redirect(`${process.env.FRONTEND_URL}/${user.role}/dashboard`)
})

// used by OAuth users who signed up via Google and don't have a role yet
const setRole = asyncHandler(async (req, res) => {
  const { role } = req.body
 
  if (!["patient", "doctor", "hospital"].includes(role)) {
    throw new ApiError(400, "Role must be patient, doctor, or hospital")
  }
 
  const existingUser = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (existingUser.role) {
    throw new ApiError(409, "Role is already set for this account")
  }
 
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { role },
    select: { id: true, email: true, role: true }
  })
 
  const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(updatedUser.id)
 
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
 
   return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { data: updatedUser, accessToken, refreshToken: newRefreshToken },
          "Role set successfully"
        )
      )
})

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user.id

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }
  })

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(
      new ApiResponse(200, {}, "User logged out successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId }
    })

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or already used")
    }

    const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user.id)

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  })

  const isPasswordCorrect = await verifyPassword(oldPassword, user.passwordHash)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password")
  }

  const newPasswordHash = await hashedPassword(newPassword)

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash }
  })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) throw new ApiError(400, "Email is required")
 
  const user = await prisma.user.findUnique({ where: { email } })
 
  if (!user) {
    throw new ApiError(400, "Email is not registered")
  }

  const rawToken = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")
 
  const expiry = new Date()
  expiry.setMinutes(expiry.getMinutes() + 15) // valid for 15 minutes
 
  await prisma.user.update({
    where: { email },
    data: { resetPasswordToken: hashedToken, resetPasswordExpiry: expiry }
  })
 
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`
   await client.transactionalEmails.sendTransacEmail({
    sender: {
      name: "HealthConnect",
      email: process.env.BREVO_SENDER_EMAIL,
    },
      to: [{ email: email }],
      subject: "Reset your HealthConnect password",
      htmlContent: `<p>Click the link below to reset your password. This link expires in 15 minutes.</p>
           <a href="${resetLink}">${resetLink}</a>`,
    });
 
  return res.status(200).json(
    new ApiResponse(200, {}, "If that email is registered, a reset link has been sent")
  )
})
 
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params
  const { newPassword } = req.body
 
  if (!newPassword) throw new ApiError(400, "New password is required")
 
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
 
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { gte: new Date() } 
    }
  })
 
  if (!user) {
    throw new ApiError(400, "Reset link is invalid or has expired")
  }
 
  const newPasswordHash = await hashedPassword(newPassword)
 
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newPasswordHash,
      resetPasswordToken: null,
      resetPasswordExpiry: null
    }
  })
 
  return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"))
})
  

const getCurrentUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, role: true }
  })
  return res.status(201).json(
    new ApiResponse(201, user, ''))
}

export {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  changePassword,
  resendOtp,
  forgotPassword,
  resetPassword,
  getGoogleLoginPage,
  getGoogleLoginCallback,
  setRole
}