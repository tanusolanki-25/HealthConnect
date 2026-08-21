import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../api/axios"

function ResetPassword() {
  const { token } = useParams()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      await api.post(`/auth/reset-password/${token}`, { newPassword })
      toast.success("Password reset successfully — please log in")
      navigate("/login")
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset link invalid or expired")
    }
  }

  return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Card */}
      <div className="relative z-10 bg-white rounded-xl shadow-md w-full max-w-md p-5">
        <div className="flex justify-center items-center gap-2 text-blue-600 font-bold text-xl">
          <img src="/favicon.png" alt="logo" className="w-12 h-12" />
          <span>HealthConnect</span>
        </div>

        <h2 className="text-gray-400 text-center">Reset Password</h2>
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-4 space-y-4">
       <div className="flex items-center mb-4 rounded-lg border border-gray-300 px-3 py-3 focus-within:border-blue-600">
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full outline-none"
      />
      </div>
             <div className="flex items-center mb-4 rounded-lg border border-gray-300 px-3 py-3 focus-within:border-blue-600">
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full outline-none"
      />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white rounded p-2">
        Reset Password
      </button>
    </form>
    </div>
    </div>
  )
}

export default ResetPassword