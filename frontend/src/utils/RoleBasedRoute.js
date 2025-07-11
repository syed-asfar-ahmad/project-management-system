import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">Loading user info...</p>;
  }

  if (!token || !user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RoleBasedRoute;
