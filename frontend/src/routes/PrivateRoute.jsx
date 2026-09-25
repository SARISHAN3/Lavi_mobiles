import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;
