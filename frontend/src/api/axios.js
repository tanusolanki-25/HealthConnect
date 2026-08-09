import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://healthconnect-tfpt.onrender.com",
  withCredentials: true // sends the httpOnly accessToken/refreshToken cookies with every request
})

// if the access token expires mid-session, try refreshing it once, then retry the original request


export default api
