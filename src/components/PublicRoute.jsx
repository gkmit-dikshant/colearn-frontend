import { Navigate } from "react-router";

export default function PublicRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
