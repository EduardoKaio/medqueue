import React from "react";
import { Navigate } from "react-router-dom";

// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return token ? true : false;
};

// Componente PrivateRoute para proteger as rotas
const PrivateRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;