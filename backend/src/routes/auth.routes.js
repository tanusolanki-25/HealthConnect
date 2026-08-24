import {Router} from "express"
import { changePassword, forgotPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendOtp, resetPassword, setRole, verifyEmail } from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import passport from "passport"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/verify-email").post(verifyEmail)
router.route("/resend-otp").post(resendOtp)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/google").get(passport.authenticate("google", {scope: ["profile", "email"]}))
router.route("/google/callback").get(passport.authenticate("google", {failureRedirect: "/login"}),(req, res)=>{
  res.redirect("http://localhost:5173/")
})
router.route("/set-role").patch(verifyJWT, setRole)

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post( verifyJWT,changePassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)


export default router