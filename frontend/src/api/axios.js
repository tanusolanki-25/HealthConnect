import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://healthconnect-tfpt.onrender.com/api",
  withCredentials: true // sends the httpOnly accessToken/refreshToken cookies with every request
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api
