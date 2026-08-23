import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://healthconnect-tfpt.onrender.com/api",
  withCredentials: true // sends the httpOnly accessToken/refreshToken cookies with every request
})

export default api
