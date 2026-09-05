import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p className="text-center mt-20">Loading...</p>
  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />
  
  if (!user.role && location.pathname !== "/set-role") {
    return <Navigate to="/set-role" replace />
  }

  if (!user.profileCompleted && !location.pathname.endsWith("/profile")) {
  return <Navigate to={`/${user.role}/profile`} replace />
}

  return children
}

