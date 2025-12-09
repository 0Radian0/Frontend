import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function ResetPassword() {
    const [email, setEmail] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    // pobranie tokenu z url
    const { token } = useParams();
    const navigate = useNavigate();


    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        // If nie ma żadnego userId bo dla jakiegoś niezalogowanego musi być

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
        try {
            const res = await fetch("http://localhost:5000/api/users/resetPasswordToken", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Błąd podczas zmiany hasła");
                return;
            }
            setMessage(data.message || "Zmiana hasła zakończona sukcesem");
            setNewPassword("");
            setConfirmPassword("");
            
        } catch (e) {
            setError(e.message);
        }
        setTimeout(() => navigate("/frontPage"), 1000);

    }

    return (
        <div className="trainings-container">
            <h3>Zmiana hasła użytkownika</h3>
            {message ? (
                <p style={{ color: "green" }}>{message}</p>
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
                        />
                    </div>
                    <button type="submit">Zmień hasło</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            )}
        </div>
    );
}