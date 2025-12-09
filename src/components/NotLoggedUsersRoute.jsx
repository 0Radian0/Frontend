import React from "react";
import { Navigate } from "react-router-dom";

// Funkcja nadająca dostęp do modułu jedynie użytkownikom niezalogoawanym 
export default function LoggedUsersRoute({ children }) {
    const token = !!localStorage.getItem("token");

    return !token ? children : <Navigate to="/" replace />;
}