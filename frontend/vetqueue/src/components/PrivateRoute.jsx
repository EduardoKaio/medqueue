import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return Boolean(token);
};

// PrivateRoute como wrapper de rotas aninhadas
const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
