import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import prisma from "../lib/prisma.js"
import { hashedPassword, verifyPassword } from "../utils/bcrypt.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"

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

  const createdUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      role: true
    }
  })

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  )
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    throw new ApiError(400, "Email is required")
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    throw new ApiError(401, "Password is not valid")
  }

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
    secure: true,
    sameSite: "none"
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

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user.id

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }
  })

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
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
    secure: true,
    sameSite: "none"
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
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  changePassword,
}