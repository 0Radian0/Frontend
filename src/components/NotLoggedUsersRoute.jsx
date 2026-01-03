import React from "react";
import { Navigate } from "react-router-dom";

// Funkcja nadająca dostęp do modułu jedynie użytkownikom niezalogoawanym 
// ✅ DOBRZE
export default function NotLoggedUsersRoute({ children }) {
    const token = !!localStorage.getItem("token");
    
    // Jeśli user JEST zalogowany, przekieruj do frontPage
    return token ? <Navigate to="/frontPage" replace /> : children;
}