import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
