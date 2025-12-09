import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSendMail = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError("Podaj poprawny adres e-mail"); return; }

        try {
            const res = await fetch("http://localhost:5000/api/users/sendForgotPasswordEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "Na Twój adres e-mail wysłano link do resetu hasła.");
                setError(null);
            } else {
                setError(data.error || "Wystąpił nieznany błąd");
                setMessage(null);
            }
        } catch (e) {
            console.error("Wystąpił błąd wysyłki maila potwierdzającego zgłoszenie chęci zmiany hasła");
            setError("Nie udało się wysłać maila na podany e-mail. Sprawdź poprawność wpisanego maila");
            setMessage(null);
        }
    }

    return (
        <div className="register-container">
            <h1>Nie pamiętasz hasła?</h1>
            <p>Wprowadź adres e-mail, aby otrzymać link do zmiany hasła:</p>
            <label htmlFor="email"></label>
            <form onSubmit={handleSendMail}>
                <input type="email" placeholder="Wprowadź adres e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Wyślij link</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    )
}