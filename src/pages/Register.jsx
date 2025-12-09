
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        email: '',
        name: '',
        surname: ''
    })
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Logika rejestracji
    const handleRegister = async (e) => {
        e.preventDefault();
        const password = formData.password;
        const confirmPassword = e.target["confirmPassword"].value;

        if (password.trim() !== confirmPassword.trim()) {
            setError("Podane hasło nie zgadza się z wprowadzonym pole wyżej");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Błąd logowania");
                return;
            }
            if (data.success) {
                setSuccessMessage(data.message);
                setTimeout(() => navigate("/auth"), 4000);
            }

        } catch (error) {
            setError("Wystąpił niespodziewany błąd")
        }
    }
//Formularz rejestracji
    return (
        <div className="register-container">
            <h2>Załóż konto</h2>

            


            <form className="register-form" onSubmit={handleRegister}>

                <label htmlFor="login">Nazwa użytkownika</label>
                <input type="text" id="login" name="login" required placeholder='Wprowadź login użytkownika'
                    pattern='^.{3,45}$' title="Proszę wprowadzić login o długości od 3 do 45 znaków."
                    value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} />

                <label htmlFor="email">Adres email</label>
                <input type="email" id="email" name="email" required placeholder='Wprowadź e-mail użytkownika' pattern='^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
                    title="Wprowadź poprawny adres e-mail" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                <label htmlFor="name">Imię użytkownika</label>
                <input type="text" id="name" name="name" required placeholder='Wprowadź imiona użytkownika' pattern='^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+){0,2}$'
                    title="Wprowadź poprawne imiona" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                <label htmlFor="surname">Nazwisko użytkownika</label>
                <input type="text" id="surname" name="surname" required placeholder='Wprowadź nazwisko' pattern='^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:[-\s][A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$'
                    title="Wprowadź poprawne nazwisko" value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.target.value })} />

                <label htmlFor="password">Hasło</label>
                <input type="password" id="password" name="password" required pattern='^.{8,255}$' title="Hasło musi zawierać co najmniej 8 znaków"
                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                <label htmlFor="confirmPassword">Potwierdź hasło</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required pattern='^.{8,255}$' title="Hasło musi zawierać co najmniej 8 znaków" />

                <button type="submit">Zarejestruj się</button>
            </form>


            {error && <div className="error-message"><p>{error}</p></div>}
            {successMessage && <div className="success-message"><p>{successMessage} Sprawdź skrzynkę e-mail.</p></div>}


            <div className="register-footer">
                <p>Masz już konto? <a href="/login">Zaloguj się</a></p>
            </div>
        </div>
    );

};

