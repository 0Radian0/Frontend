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

            {/* LEWA KOLUMNA */}
            <div className="col-lg-6">
                <div className="card shadow-sm h-100">
                    <div className="card-body premium-left">

                        <h3 className="mb-3">
                            Jesteśmy gotowi pomóc <i className="fas fa-paw text-primary"></i>
                        </h3>
                        <p className="text-muted mb-4">
                            Masz pytanie? Chcesz zapisać się na zajęcia? Skontaktuj się z nami!
                        </p>

                        <div className="row row-cols-2 g-3 premium-grid">

                            <div className="col">
                                <a
                                    href="mailto:szermierka.historyczna@gmail.com"
                                    className="info-box p-3 d-block text-decoration-none text-dark"
                                >
                                    <h5><i className="fas fa-envelope text-primary me-2"></i>Email</h5>
                                    <p className="text-muted small m-0">
                                        szermierka.historyczna@gmail.com
                                    </p>
                                </a>
                            </div>

                            <div className="col">
                                <a
                                    href="https://szermierka.pollub.pl/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="info-box p-3 d-block text-decoration-none text-dark"
                                >
                                    <h5><i className="fas fa-globe text-primary me-2"></i>Strona</h5>
                                    <p className="text-muted small m-0">
                                        szermierka.pollub.pl
                                    </p>
                                </a>
                            </div>

                            <div className="col">
                                <div className="info-box p-3">
                                    <h5><i className="fas fa-map-marker-alt text-primary me-2"></i>Lokalizacja</h5>
                                    <p className="text-muted small m-0">
                                        Nadbystrzycka 36 C
                                    </p>
                                </div>
                            </div>

                            <div className="col">
                                <div className="info-box p-3">
                                    <h5><i className="fas fa-share-alt text-primary me-2"></i>Social media</h5>
                                    <p className="text-muted small m-0">
                                        <a
                                            href="https://www.facebook.com/GFHLublin"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-decoration-none me-2"
                                        >
                                            Facebook
                                        </a>
                                        ·
                                        <a
                                            href="https://www.instagram.com/grupa_fechtunku_historycznegoigsh=MWhrY2M1cjM4MGx5Zw=="
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-decoration-none ms-2"
                                        >
                                            Instagram
                                        </a>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* PRAWA KOLUMNA */}
            <div className="col-lg-6">
                <div className="card shadow-sm h-100">
                    <div className="card-body premium-right">

                        <h2 className="h4 mb-3">Formularz kontaktowy</h2>

                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}

                        {successMessage && (
                            <div className="alert alert-success">{successMessage}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Imię i nazwisko</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Treść wiadomości</label>
                                <textarea
                                    className="form-control"
                                    name="content"
                                    rows="5"
                                    value={formData.content}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
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

        </div>
    </div>
);

}