import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api"; 

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendMail = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!email.trim()) {
            setError("Podaj poprawny adres e-mail");
            return;
        }

        setLoading(true);

        try {
            // Używamy fetchAPI zamiast hardcoded URL
            const { data } = await fetchAPI('/auth/users/sendForgotPasswordEmail', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            setMessage(data.message || "Na Twój adres e-mail wysłano link do resetu hasła.");
            setError(null);

        } catch (err) {
            console.error("❌ Błąd wysyłki maila resetującego:", err);
            setError(err.message || "Nie udało się wysłać maila. Sprawdź poprawność adresu e-mail.");
            setMessage(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h1>Nie pamiętasz hasła?</h1>
            <p>Wprowadź adres e-mail, aby otrzymać link do zmiany hasła:</p>
            
            <form onSubmit={handleSendMail}>
                <label htmlFor="email">Adres e-mail</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Wprowadź adres e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                />
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Wysyłanie...' : 'Wyślij link'}
                </button>
            </form>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="login-footer">
                <p>Pamiętasz hasło? <span onClick={() => navigate('/login')} style={{cursor: 'pointer', color: '#1a73e8'}}>Zaloguj się</span></p>
            </div>
        </div>
    );
}