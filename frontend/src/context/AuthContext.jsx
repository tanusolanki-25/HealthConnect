import { Children, createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios"

export const AuthContext = createContext()

async function checkProfileCompleted(role) {
  if (!role) return false
  try {
    const res = await api.get(`/${role}/dashboard`)
    return !!res.data.data 
  } catch {
    return false
  }
}

export const AuthProvider = ({children}) =>{
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("accessToken");
    if (urlToken) {
      localStorage.setItem("accessToken", urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    api.get("/auth/current-user")
      .then(async (res) => {
        const loggedInUser = res.data.data
        if (loggedInUser) {
          const profileCompleted = await checkProfileCompleted(loggedInUser.role)
          setUser({ ...loggedInUser, profileCompleted })
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])
  
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password })
    const { user: loggedInUser, accessToken } = res.data.data
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    const profileCompleted = await checkProfileCompleted(loggedInUser.role)
    const fullUser = { ...loggedInUser, profileCompleted }
    setUser(fullUser)
    return fullUser 
  }

  const logout = async()=>{
    try {
      await api.post("/auth/logout")
    } finally {
      localStorage.removeItem("accessToken")
      setUser(null)
    }
  }

  const markProfileCompleted = () => {
    setUser((prev) => (prev ? { ...prev, profileCompleted: true } : prev))
  }

  const setRoleLocally = (role) => {
    setUser((prev) => (prev ? { ...prev, role, profileCompleted: false } : prev))
  }
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, markProfileCompleted, checkProfileCompleted, setRoleLocally }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)