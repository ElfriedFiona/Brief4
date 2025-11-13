// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  // Si l'utilisateur n'est pas connecté, on le redirige vers /login
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
