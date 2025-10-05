import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Middleware = () => {
  const token = localStorage.getItem("user");

  return token ? 
    <Outlet />: <Navigate to="/" />;
};

export default Middleware;
