import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        
        // Walidacja hasła
        if (!oldPassword || !newPassword || !confirmPassword) {
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

        if (!window.confirm("Czy na pewno chcesz zmienić hasło?")) return;

        const userID = localStorage.getItem("userID");
        if (!userID) {
            setError("Brak zalogowanego użytkownika");
            return;
        }

        setLoading(true);

        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI('/auth/users/changePassword', {
                method: 'POST',
                body: JSON.stringify({ userID, oldPassword, newPassword }),
            });

            setMessage(data.message || "Hasło zostało zmienione pomyślnie!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Przekierowanie po 1 sekundzie
            setTimeout(() => navigate("/frontPage"), 1000);

        } catch (err) {
            console.error("❌ Błąd zmiany hasła:", err);
            setError(err.message || "Nie udało się zmienić hasła");
            setLoading(false);
        }
    };

    return (
        <div className="trainings-container">
            <h3>Zmiana hasła użytkownika</h3>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Wprowadź stare hasło</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                
                <div>
                    <label>Wprowadź nowe hasło</label>
                    <input
                        type="password"
                        name="newPassword"
                        required
                        pattern="^.{8,255}$"
                        value={newPassword}
                        title="Hasło musi zawierać co najmniej 8 znaków"
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                
                <div>
                    <label>Potwierdź nowe hasło</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        pattern="^.{8,255}$"
                        value={confirmPassword}
                        title="Hasła muszą się zgadzać"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Zmiana hasła...' : 'Zmień hasło'}
                </button>
            </form>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}