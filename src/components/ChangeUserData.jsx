import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function ChangeUserData() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getInitialUser = () => ({
        email: localStorage.getItem("email") || "",
        name: localStorage.getItem("name") || "",
        surname: localStorage.getItem("surname") || "",
        userID: localStorage.getItem("userID") || ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const user = getInitialUser();
        if (!user.userID) {
            setMessage("Brakuje ID użytkownika");
            return;
        }

        if (!window.confirm("Czy na pewno chcesz zmienić dane osobowe?")) return;

        setLoading(true);

        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI('/auth/users/changeUserData', {
                method: 'POST',
                body: JSON.stringify({
                    id: user.userID,

                    email,
                    name,
                    surname
                })
            });

            setMessage("Dane użytkownika zostały zaktualizowane ✅");
            
            // Aktualizuj localStorage

            localStorage.setItem("email", email);
            localStorage.setItem("name", name);
            localStorage.setItem("surname", surname);

            // Powiadom inne komponenty o zmianie
            window.dispatchEvent(new Event("storage"));

            setTimeout(() => navigate("/frontPage"), 1000);

        } catch (err) {
            console.error("❌ Błąd zmiany danych:", err);
            setMessage(err.message || "Błąd podczas zmiany danych użytkownika");
            setLoading(false);
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        const user = getInitialUser();

        setEmail(user.email);
        setName(user.name);
        setSurname(user.surname);
        setMessage("Anulowano zmiany. Powrót do panelu...");
        setTimeout(() => navigate("/frontPage"), 1500);
    };

    useEffect(() => {
        const user = getInitialUser();

        setEmail(user.email);
        setName(user.name);
        setSurname(user.surname);
    }, []);

    return (
        <div className="trainings-container">
            <h2>Zmiana danych użytkownika</h2>
            <h3>Aktualne dane użytkownika</h3>
            <p>Zachowaj ostrożność przy zmianie danych osobowych. Upewnij się, że podany adres e-mail jest poprawny.</p>
            
            <form onSubmit={handleSubmit}>
                
                <div>
                    <label>Email użytkownika:</label>
                    <input
                        type="email"
                        name="email"
                        required
                        pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                        title="Wprowadź poprawny adres email."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                
                <div>
                    <label>Imię użytkownika:</label>
                    <input
                        type="text"
                        name="name"
                        required
                        pattern="^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+){0,2}$"
                        title="Wprowadź poprawne imię."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>
                
                <div>
                    <label>Nazwisko użytkownika:</label>
                    <input
                        type="text"
                        name="surname"
                        required
                        pattern="^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:[-\s][A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$"
                        title="Wprowadź poprawne nazwisko."
                        value={surname}
                        onChange={e => setSurname(e.target.value)}
                        disabled={loading}
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
                <button type="button" onClick={handleReset} disabled={loading}>
                    Anuluj
                </button>
            </form>

            {message && (
                <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>
                    {message}
                </p>
            )}
        </div>
    );
}