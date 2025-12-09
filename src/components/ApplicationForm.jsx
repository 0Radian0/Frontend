import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function ApplicationForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        content: ''
    })
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();


    // Logika wysyłki 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Walidacja pól
        if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/users/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toWho: "katarzyna.szkaluba@pollub.edu.pl",
                    subject: `Nowa wiadomość z formularza kontaktowego`,
                    html: `<p>Otrzymałeś nową wiadomość przesłaną przez formularz kontaktowy na stronie klubu</p>
                            <p><strong>Od:</strong> ${formData.name} </p>
                             <p><strong>Adres e-mail nadawcy: </strong>${formData.email}</p>
                           <p><strong>Treść:</strong></p>
                           <p>${formData.content}</p>`
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Wystąpił błąd podczas wysyłki maila.");
                return;
            }

            setSuccessMessage(data.message || "Wiadomość została wysłana! Postaramy się nak najszybciej odpowiedzieć :)");
            setFormData({ name: '', email: '', content: '' });

        } catch (err) {
            console.error("Błąd wysyłki maila:", err);
            setError("Nie udało się wysłać maila. Spróbuj ponownie później.");
        }
        setTimeout(() => navigate("/"), 3000);
    }

    return (
        <div className="register-container">
            <h1>Formularz kontaktowy</h1>

            <form className="register-form" onSubmit={handleSubmit} >
                <label htmlFor="name">Imię</label>
                <input type="text" id="name" name="name" required placeholder='Wprowadź imię'
                    pattern='^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+){0,2}$' title="Proszę wprowadzić imię"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <label htmlFor="email">Adres email</label>
                <input type="email" id="email" name="email" required placeholder='Wprowadź e-mail użytkownika' pattern='^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
                    title="Wprowadź poprawny adres e-mail" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <label htmlFor="content">Treść wiadomości</label>
                <textarea name="content" id="content" required placeholder='Chcesz zapisać się do klubu? A może uzyskać odpowiedź na nurtujące pytanie? Skontaktuj się z nami i do zobaczenia na treningu :)'
                    value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows="12"
                ></textarea>
                <button type="submit">Wyślij</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p>{successMessage}</p>}

        </div>
    )
}