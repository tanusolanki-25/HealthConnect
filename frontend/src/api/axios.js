import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true // sends the httpOnly accessToken/refreshToken cookies with every request
})

// if the access token expires mid-session, try refreshing it once, then retry the original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await api.post("/auth/refresh")
        return api(originalRequest) // retry with the new cookie
      } catch (refreshError) {
        // refresh also failed — user needs to log in again
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
