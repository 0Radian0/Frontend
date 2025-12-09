import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangeUserData() {
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const getInitialUser = () => ({
        login: localStorage.getItem("login") || "",
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
            setMessage("Brakuje użytkownika, dla którego można zmienić dane :(");
            return;
        }
        if (!window.confirm("Czy na pewno chcesz zmienić dane osobowe użytkownika?")) return;
        try {
            const response = await fetch("http://localhost:5000/api/users/changeUserData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    id: user.userID,
                    login,
                    email,
                    name,
                    surname
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Dane użytkownika zostały zaktualizowane");
                localStorage.setItem("login", login);
                localStorage.setItem("email", email);
                localStorage.setItem("name", name);
                localStorage.setItem("surname", surname);

                setTimeout(() => navigate("/frontPage"), 500);
            } else {
                setMessage(`${data.error || "Błąd podczas próby zmiany danych użytkownika"}`);
            }
        } catch (err) {
            console.error(err);
            setMessage("Błąd podczas przesyłania danych do backendu");
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        const user = getInitialUser();
        setLogin(user.login);
        setEmail(user.email);
        setName(user.name);
        setSurname(user.surname);
        setMessage("Pozostawiamy poprzednio zapisane dane. Nastąpi powrót do panelu startowego");
        setTimeout(() => navigate("/frontPage"), 2000);
    };

    useEffect(() => {
        const user = getInitialUser();
        setLogin(user.login);
        setEmail(user.email);
        setName(user.name);
        setSurname(user.surname);
    }, []);

    return (
        <div>
            <h2>Zmiana danych użytkownika</h2>
            <h3>Aktualne dane użytkownika</h3>
            <p>Zachowaj ostrożność przy zmianie danych osobowych. Upewnij się, że podany adres e-mail jest poprawny, żeby wiadomości nie trafiły w niepowołane ręce</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Wprowadź nowy login użytkownika: </label>
                    <input
                        type="text"
                        name="login"
                        required
                        pattern="^.{3,45}$"
                        title="Proszę wprowadzić login o długości od 3 do 45 znaków."
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                    />
                </div>
                <div>
                    <label>Wprowadź nowy email użytkownika: </label>
                    <input
                        type="email"
                        name="email"
                        required
                        pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                        title="Proszę wprowadzić nowy email użytkownika."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Wprowadź imię użytkownika: </label>
                    <input
                        type="text"
                        name="name"
                        required
                        pattern="^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+){0,2}$"
                        title="Proszę wprowadzić imię użytkownika."
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Wprowadź nazwisko użytkownika: </label>
                    <input
                        type="text"
                        name="surname"
                        required
                        pattern="^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:[-\s][A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$"
                        title="Proszę wprowadzić nazwisko użytkownika."
                        value={surname}
                        onChange={e => setSurname(e.target.value)}
                    />
                </div>
                <button type="submit">Zapisz zmiany</button>
                <button type="button" onClick={handleReset}>Anuluj</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}
