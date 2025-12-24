import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../../config/api"; // ✅ Import API config

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // ✅ Używamy fetchAPI zamiast hardcoded URL
            const { data } = await fetchAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            // Sprawdź czy konto jest dezaktywowane
            if (data.user.deactivated === 1) {
                setError("Twoje konto zostało dezaktywowane. Skontaktuj się z administratorem.");
                setLoading(false);
                return;
            }

            // Zapisz dane użytkownika
            localStorage.setItem("token", data.token);
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
            navigate("/frontPage");

        } catch (err) {
            console.error('❌ Błąd logowania:', err);
            setError(err.message || "Wystąpił niespodziewany błąd");
            setLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <label>E-mail</label>
            <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                required
            />

            <label>Hasło</label>
            <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                required
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>

            <p className="login-register-text">
                Nie masz konta?{" "}
                <span
                    className="login-register-link"
                    onClick={() => navigate("/register")}
                >
                    Zarejestruj się
                </span>
            </p>
        </form>
    );
}