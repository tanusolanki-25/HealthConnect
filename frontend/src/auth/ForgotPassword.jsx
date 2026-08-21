import { useState } from "react"
import toast from "react-hot-toast"
import api from "../api/axios"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault()
    try {
      await api.post("/auth/forgot-password", { email })
      setSent(true)
      toast.success("Link send Successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong")
    }
    finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
       <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Card */}
      <div className="relative z-10 bg-white rounded-xl shadow-md w-full max-w-md p-5">
      <div className="max-w-sm mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-gray-500 mt-2">
          If that email is registered, we've sent a password reset link.
        </p>
      </div>
      </div>
      </div>
    )
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
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4 mt-4">
       <div className="flex items-center mb-4 rounded-lg border border-gray-300 px-3 py-3 focus-within:border-blue-600">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full outline-none"
      />
      </div>
          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg p-3 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:shadow-xl"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
    </form>
    </div>
  </div>
  )
}

export default ForgotPassword