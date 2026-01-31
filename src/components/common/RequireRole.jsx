import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RequireRole({ allowed, children }) {
  const { user } = useAuth();

  if (!allowed.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
