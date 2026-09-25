import { Navigate, Outlet } from "react-router-dom";

function CustomerRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default CustomerRoute;
