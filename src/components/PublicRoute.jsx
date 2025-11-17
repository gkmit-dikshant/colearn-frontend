import { Navigate } from "react-router";

export default function PublicRoute({ children }) {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}
