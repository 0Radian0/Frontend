import React, { useEffect, useState } from 'react';
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

        // Walidacja pól
        if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        try {
            const API_URL = process.env.REACT_APP_API_URL; // zmienna środowiskowa

            const res = await fetch(`${API_URL}/auth/users/send-email`, {
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

            const data = await res.json(); // tylko jedno wywołanie res.json()
            console.log("Wiadomość wysłana:", data);

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

                            {/* GRID 2x2 */}
                            <div className="row row-cols-2 g-3 premium-grid">

                                {/* Email */}
                                <div className="col">
                                    <div className="info-box p-3">
                                        <h5><i className="fas fa-envelope text-primary me-2"></i>Email</h5>
                                        <p className="text-muted small m-0">
                                            <a href="mailto:szermierka.historyczna@gmail.com" className="text-decoration-none text-muted">
                                                szermierka.historyczna@gmail.com
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                {/* Strona */}
                                <div className="col">
                                    <div className="info-box p-3">
                                        <h5><i className="fas fa-globe text-primary me-2"></i>Strona</h5>
                                        <p className="text-muted small m-0">
                                            <a href="https://szermierka.pollub.pl/" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted">
                                                https://szermierka.pollub.pl/
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                {/* Lokalizacja */}
                                <div className="col">
                                    <div className="info-box p-3">
                                        <h5><i className="fas fa-map-marker-alt text-primary me-2"></i>Lokalizacja</h5>
                                        <p className="text-muted small m-0">
                                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted">
                                                Nadbystrzycka 36 C
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                {/* Social media */}
                                <div className="col">
                                    <div className="info-box p-3">
                                        <h5><i className="fas fa-share-alt text-primary me-2"></i>Social media</h5>
                                        <p className="text-muted small m-0">
                                            <a href="https://www.facebook.com/GFHLublin" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted">
                                                Facebook
                                            </a> · 
                                            <a href="https://www.instagram.com/grupa_fechtunku_historycznego" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted">
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

                            <h1 className="h4 mb-4">Formularz kontaktowy</h1>

                            <form onSubmit={handleSubmit} className="row gy-3">

                                <div className="col-12">
                                    <label className="form-label">Imię</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Wprowadź imię"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Wprowadź adres email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Treść wiadomości</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        placeholder="Napisz wiadomość..."
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary px-4">
                                        Wyślij <i className="fas fa-paper-plane ms-2"></i>
                                    </button>
                                </div>

                            </form>

                            {error && <p className="text-danger mt-3">{error}</p>}
                            {successMessage && <p className="text-success mt-3">{successMessage}</p>}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
