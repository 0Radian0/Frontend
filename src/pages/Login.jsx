import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ✅ Dynamiczny URL API
    const API_URL = process.env.REACT_APP_API_URL || 'https://backend-production-3aa9.up.railway.app/api';

    // Sprawdź czy user wrócił po weryfikacji emaila
    useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            setSuccessMessage('✅ Konto zostało aktywowane! Możesz się teraz zalogować.');
        }
    }, [searchParams]);

    // Logika logowania
    const handleLogin = async (e) => {
        
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            console.log('🔍 Logowanie do:', `${API_URL}/auth/login`);

            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include', // ✅ CORS
                body: JSON.stringify(formData),
            });

            console.log('📡 Status odpowiedzi:', res.status);

            const data = await res.json();
            console.log('📦 Odpowiedź:', data);

            if (!res.ok) {
                setError(data.message || "Błąd logowania");
                setLoading(false);
                return;
            }

            // Jeżeli konto jest nieaktywne niemożliwe jest zalogowanie się
            if (data.user.deactivated === 1) {
                setError("Twoje konto zostało dezaktywowane. Skontaktuj się z administratorem.");
                setLoading(false);
                return;
            }

            // Zapisz dane użytkownika w localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("login", data.user.login);
            localStorage.setItem("userID", data.user.userID);
            localStorage.setItem("rankID", data.user.rankID);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("description", data.user.description || '');
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("surname", data.user.surname);
            localStorage.setItem("deactivated", data.user.deactivated);
            localStorage.setItem("lastLog", data.user.lastLog);
            localStorage.setItem("registrationDate", data.user.registrationDate);

            // Powiadom inne komponenty o zalogowaniu
            window.dispatchEvent(new Event("storage"));

            console.log('✅ Zalogowano pomyślnie!');
            
            // Przekieruj na stronę główną
            navigate("/frontPage");
        } catch (e) {
            console.error("❌ Błąd logowania:", e);
            setError("Wystąpił błąd połączenia z serwerem");
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Zaloguj się</h2>
            
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}

            <form className="login-form" onSubmit={handleLogin}>

                
                <label htmlFor="email">E-mail</label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    required
                />
                
                <label htmlFor="password">Hasło</label>
                <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Logowanie...' : 'Zaloguj się'}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            <div className="login-footer">
                <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
            </div>
            <div className="login-footer">
                <p><a href="/forgotPass">Nie pamiętam hasła</a></p>
            </div>
        </div>
    );
}