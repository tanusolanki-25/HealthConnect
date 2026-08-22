import {Router} from "express"
import { changePassword, forgotPassword, getCurrentUser, getGoogleLoginCallback, getGoogleLoginPage, loginUser, logoutUser, refreshAccessToken, registerUser, resendOtp, resetPassword, setRole, verifyEmail } from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/verify-email").post(verifyEmail)
router.route("/resend-otp").post(resendOtp)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/google").get(getGoogleLoginPage)
router.route("/google/callback").get(getGoogleLoginCallback)
router.route("/role").post(verifyJWT, setRole)

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post( verifyJWT,changePassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)


export default router