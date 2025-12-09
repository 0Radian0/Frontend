import React from "react";
import { Navigate } from "react-router-dom";

// Funkcja nadająca dostęp do modułu jedynie użytkownikowi o uprawnieniach administratora
export default function AdminRoute({children}) {
    const token = !!localStorage.getItem("token");
    const rankID = Number(localStorage.getItem("rankID") || 3);
    
    return token && rankID === 1 ? children : <Navigate to="/" replace />;
}