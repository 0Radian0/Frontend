import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

            if (data.user.deactivated === 1) {
                setError("Twoje konto zostało dezaktywowane.");
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

            navigate("/frontPage");
        } catch (err) {
            setError("Wystąpił niespodziewany błąd");
        }
    };

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <label>E-mail</label>
            <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
            />

            <label>Hasło</label>
            <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-btn">
                Zaloguj się
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
