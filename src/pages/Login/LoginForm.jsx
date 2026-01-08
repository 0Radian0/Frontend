import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../../config/api";

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data } = await fetchAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

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

            window.dispatchEvent(new Event("storage"));

            console.log('Zalogowano pomyślnie!');
            navigate("/frontPage");

        } catch (err) {
            console.error('Błąd logowania:', err);
            setError(err.message || "Wystąpił błąd logowania");
            setLoading(false);
        }
    };

    return (
        <div className="login-form" onSubmit={handleLogin}>
            {/* Email field */}
            <div>
                <label>E-mail</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    required
                    placeholder="Podaj adres email"
                />
            </div>

            {/* Password field */}
            <div>
                <label>Hasło</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                    required
                    placeholder="Podaj swoje hasło"
                />
            </div>

            {/*  Forgot password */}
            <div className="login-options">
                <label className="remember-me-wrapper">
                    
                    
                </label>
                <span
                    className="forgot-password-link"
                    onClick={() => navigate("/forgotPass")}
                >
                    Zapomniałem hasła
                </span>
            </div>

            {/* Error message */}
            {error && <p className="login-error">{error}</p>}

            {/* Submit button */}
            <button 
                type="button" 
                className="login-btn" 
                disabled={loading}
                onClick={handleLogin}
            >
                {loading ? 'Logging in...' : 'Zaloguj'}
            </button>

            {/* Register link */}
            <p className="login-signup-text">
                Nie masz jeszcze konta?{" "}
                <span
                    className="login-signup-link"
                    onClick={() => navigate("/register")}
                >
                    Zarejestruj się
                </span>
            </p>
        </div>
    );
}