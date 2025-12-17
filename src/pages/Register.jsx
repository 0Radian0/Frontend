import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        email: '',
        name: '',
        surname: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Logika rejestracji
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        const password = formData.password;
        const confirmPassword = e.target["confirmPassword"].value;

        // Sprawdź czy hasła się zgadzają
        if (password.trim() !== confirmPassword.trim()) {
            setError("Podane hasło nie zgadza się z wprowadzonym powyżej");
            return;
        }

        setLoading(true);

        try {
            // ✅ Używamy fetchAPI zamiast hardcoded URL
            const { data } = await fetchAPI('/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (data.success) {
                setSuccessMessage(data.message);
                // Przekieruj po 4 sekundach
                setTimeout(() => navigate("/login"), 4000);
            }

        } catch (err) {
            console.error('❌ Błąd rejestracji:', err);
            setError(err.message || "Wystąpił niespodziewany błąd");
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Załóż konto</h2>

            <form className="register-form" onSubmit={handleRegister}>
                <label htmlFor="login">Nazwa użytkownika</label>
                <input 
                    type="text" 
                    id="login" 
                    name="login" 
                    required 
                    placeholder='Wprowadź login użytkownika'
                    pattern='^.{3,45}$' 
                    title="Proszę wprowadzić login o długości od 3 do 45 znaków."
                    value={formData.login} 
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                    disabled={loading}
                />

                <label htmlFor="email">Adres email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder='Wprowadź e-mail użytkownika' 
                    pattern='^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
                    title="Wprowadź poprawny adres e-mail" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                />

                <label htmlFor="name">Imię użytkownika</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder='Wprowadź imiona użytkownika' 
                    pattern='^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+){0,2}$'
                    title="Wprowadź poprawne imiona" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                />

                <label htmlFor="surname">Nazwisko użytkownika</label>
                <input 
                    type="text" 
                    id="surname" 
                    name="surname" 
                    required 
                    placeholder='Wprowadź nazwisko' 
                    pattern='^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:[-\s][A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$'
                    title="Wprowadź poprawne nazwisko" 
                    value={formData.surname} 
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    disabled={loading}
                />

                <label htmlFor="password">Hasło</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    pattern='^.{8,255}$' 
                    title="Hasło musi zawierać co najmniej 8 znaków"
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                />

                <label htmlFor="confirmPassword">Potwierdź hasło</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    required 
                    pattern='^.{8,255}$' 
                    title="Hasło musi zawierać co najmniej 8 znaków"
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Rejestracja...' : 'Zarejestruj się'}
                </button>
            </form>

            {error && <div className="error-message"><p>{error}</p></div>}
            {successMessage && (
                <div className="success-message">
                    <p>{successMessage} Sprawdź skrzynkę e-mail.</p>
                </div>
            )}

            <div className="register-footer">
                <p>Masz już konto? <span onClick={() => navigate('/login')} style={{cursor: 'pointer', color: '#1a73e8'}}>Zaloguj się</span></p>
            </div>
        </div>
    );
}