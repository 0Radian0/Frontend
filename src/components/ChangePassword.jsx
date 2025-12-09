import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
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
        if (!window.confirm("Czy na pewno chcesz zmienić hasło użytkownika?")) return;
        // Logika zmiany hasła
        try {
            const userID = localStorage.getItem("userID");
            if (!userID) { setError("Brak zalogowanego użytkownika do zmiany hasła :/"); return; }
            const res = await fetch("http://localhost:5000/api/users/changePassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID, oldPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Błąd podczas zmiany hasła");
                return;
            }
            setMessage(data.message || "Zmiana hasła zakończona sukcesem");
            setOldPassword("");
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Wprowadź stare hasło</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                </div>
                <div>
                    {/* Pola do wprowadzania  nowego hasła */}
                    <label>Wprowadź nowe hasło</label>
                    <input
                        type="password"
                        name="newPassword"
                        required pattern='^.{8,255}$'
                        value={newPassword}
                        title="Hasło musi zawierać conajmniej 8 znaków"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Potwierdź nowe hasło</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required pattern='^.{8,255}$'
                        value={confirmPassword}
                        title="Hasła muszę się zgadzać"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Zmień hasło</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>

    );
}
