import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Form.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function ApplicationForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        content: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        try {
            const API_URL = process.env.REACT_APP_API_URL; // np. https://backend-production-3aa9.up.railway.app/api

            const res = await fetch(`${API_URL}/auth/users/send-email`, { // poprawny endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toWho: "adrianpietka0481@gmail.com",
                    subject: `Nowa wiadomość z formularza kontaktowego`,
                    html: `
                        <p>Otrzymałeś nową wiadomość przesłaną przez formularz kontaktowy na stronie klubu</p>
                        <p><strong>Od:</strong> ${formData.name} </p>
                        <p><strong>Email: </strong>${formData.email}</p>
                        <p><strong>Treść:</strong></p>
                        <p>${formData.content}</p>`
                }),
            });

            let data;
            try {
                data = await res.json(); // obsługa odpowiedzi JSON
            } catch {
                setError(`Błąd backendu: odpowiedź nie jest JSON. Status: ${res.status}`);
                return;
            }

            if (!res.ok) {
                setError(data.error || "Wystąpił błąd podczas wysyłki maila.");
                return;
            }

            setSuccessMessage(data.message || "Wiadomość została wysłana! :)");
            setFormData({ name: '', email: '', content: '' });

        } catch (err) {
            console.error("Mail error:", err);
            setError("Nie udało się wysłać maila.");
        }

        setTimeout(() => navigate("/"), 3000);
    }

    return (
        <div className="container py-4">
            <div className="row g-4">
                {/* ...reszta JSX pozostaje bez zmian... */}
            </div>
        </div>
    );
}
