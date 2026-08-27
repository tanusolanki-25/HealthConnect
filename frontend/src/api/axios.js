import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://healthconnect-tfpt.onrender.com/api",
  withCredentials: true // sends the httpOnly accessToken/refreshToken cookies with every request
})

// agar access token expire ho jaaye, chupke se naya le aao aur request dobara try karo
api.interceptors.response.use(
  (response) => response,   // sab sahi ho to kuch mat karo
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true   // isse dobara-dobara try na ho (infinite loop se bachne ke liye)

      try {
        await api.post("/auth/refresh")   // naya access token maango, refresh token se
        return api(originalRequest)        // purani request ko naye token ke saath dobara chalao
      } catch (refreshError) {
        return Promise.reject(refreshError)   // refresh bhi fail ho gaya — ab sach mein login chahiye
      }
    }

    return Promise.reject(error)
  }
)

export default api
