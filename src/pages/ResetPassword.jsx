import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Pobranie tokenu z URL
    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        // Walidacja hasła
        if (!newPassword || !confirmPassword) {
            setError("Wszystkie pola są wymagane");
            return;
        }
        if (newPassword.length < 8) {
            setError("Hasło musi mieć co najmniej 8 znaków");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Hasła muszą być identyczne");
            return;
        }

        setLoading(true);

        try {
            // ✅ Używamy fetchAPI zamiast hardcoded URL
            const { data } = await fetchAPI('/auth/users/resetPasswordToken', {
                method: 'POST',
                body: JSON.stringify({ token, newPassword }),
            });

            setMessage(data.message || "Zmiana hasła zakończona sukcesem");
            setNewPassword("");
            setConfirmPassword("");
            
            // Przekierowanie po 2 sekundach
            setTimeout(() => navigate("/login"), 2000);

        } catch (err) {
            console.error("❌ Błąd resetowania hasła:", err);
            setError(err.message || "Błąd podczas zmiany hasła");
            setLoading(false);
        }
    };

    return (
        <div className="trainings-container">
            <h3>Zmiana hasła użytkownika</h3>
            
            {message ? (
                <div>
                    <p style={{ color: "green" }}>{message}</p>
                    <p>Przekierowanie na stronę logowania...</p>
                </div>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <div>
                        <label>Wprowadź nowe hasło</label>
                        <input
                            type="password"
                            name="newPassword"
                            required
                            minLength="8"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nowe hasło"
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label>Potwierdź nowe hasło</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            minLength="8"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Powtórz hasło"
                            disabled={loading}
                        />
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Zmiana hasła...' : 'Zmień hasło'}
                    </button>
                    
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            )}
        </div>
    );
}