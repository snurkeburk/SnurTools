import React from "react";
import { Navigate } from "react-router-dom";
import { AuthUser } from "./AuthUser";

export function PrivateRoute({ children }) {
  console.log("PRIVATE ROUTING");
  const auth = AuthUser();
  return auth ? children : <Navigate to="/" />;
}
