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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        setLoading(true);

        try {
            // ✅ Poprawione: dodano fallback i lepsze logowanie
            const API_URL = process.env.REACT_APP_API_URL || 'https://backend-production-3aa9.up.railway.app/api';
            
            console.log('🔍 API_URL:', API_URL); // Debug
            console.log('🔍 Wysyłam request do:', `${API_URL}/auth/users/send-email`);

            const res = await fetch(`${API_URL}/auth/users/send-email`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                // ✅ DODANE: credentials dla CORS
                credentials: 'include',
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

            console.log('📡 Status odpowiedzi:', res.status); // Debug

            let data;
            try {
                data = await res.json();
                console.log('📦 Odpowiedź z backendu:', data); // Debug
            } catch (parseError) {
                console.error('❌ Błąd parsowania JSON:', parseError);
                setError(`Błąd backendu: odpowiedź nie jest JSON. Status: ${res.status}`);
                setLoading(false);
                return;
            }

            if (!res.ok) {
                setError(data.error || "Wystąpił błąd podczas wysyłki maila.");
                setLoading(false);
                return;
            }

            setSuccessMessage(data.message || "Wiadomość została wysłana! 🎉");
            setFormData({ name: '', email: '', content: '' });
            
            // Przekierowanie po 3 sekundach
            setTimeout(() => navigate("/"), 3000);

        } catch (err) {
            console.error("❌ Mail error:", err);
            setError(`Błąd połączenia: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-12">
                    <h2 className="text-center mb-4">Formularz Kontaktowy</h2>
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Imię i nazwisko</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="content" className="form-label">Wiadomość</label>
                            <textarea
                                className="form-control"
                                id="content"
                                name="content"
                                rows="5"
                                value={formData.content}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Wysyłanie...
                                </>
                            ) : (
                                'Wyślij wiadomość'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}