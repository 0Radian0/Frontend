import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const user = {
        login: localStorage.getItem("login"),
        email: localStorage.getItem("email"),
        name: localStorage.getItem("name"),
        surname: localStorage.getItem("surname"),
        userID: localStorage.getItem("userID")
    }

    // Logika logowania
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Błąd logowania");
                return;
            }

            // Jeżeli konto jest nieaktywne niemożliwe jest zalogowanie się
            if (data.user.deactivated === 1) {
                setError("Twoje konto zostało dezaktywowane. Skontaktuj się z administratorem.");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("login", data.user.login);
            localStorage.setItem("userID", data.user.userID);
            localStorage.setItem("rankID", data.user.rankID);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("description", data.user.description);
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("surname", data.user.surname);
            localStorage.setItem("deactivated", data.user.deactivated);
            localStorage.setItem("lastLog", data.user.lastLog);
            localStorage.setItem("registrationDate", data.user.registrationDate);

            window.dispatchEvent(new Event("storage"));
            navigate("/frontPage");
        } catch (e) {
            console.error("Błąd logowania:", e);
            setError("Wystąpił niespodziewany błąd");
        }
    };


    return (
        <>
            <div className="login-container">
                <h2>Zaloguj się</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    {/* Formularz logowania */}
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <label htmlFor="password">Hasło</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <button type="submit">Zaloguj się</button>
                </form>

                {error && <p className="error">{error}</p>}

                <div className="login-footer">
                    <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
                </div>
                <div className="login-footer">
                    <p><a href="/forgotPass">Nie pamiętam hasła</a></p>
                </div>
            </div></>
    )
}