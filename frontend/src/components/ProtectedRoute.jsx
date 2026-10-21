import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading)
    return (
      <div className="h-[calc(100vh-4rem)] hide-scrollbar overflow-hidden flex items-center justify-center">
        <p className="text-2xl font-semibold text-blue-600 animate-pulse">
          Loading...
        </p>
      </div>
    );
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

