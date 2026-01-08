import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api";
import { FaUser, FaExclamationTriangle, FaEdit, FaEnvelope, FaSave, FaClipboardList } from 'react-icons/fa';

export default function ChangeUserData() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const navigate = useNavigate();

    const getInitialUser = () => ({
        email: localStorage.getItem("email") || "",
        name: localStorage.getItem("name") || "",
        surname: localStorage.getItem("surname") || "",
        userID: localStorage.getItem("userID") || ""
    });

    useEffect(() => {
        const user = getInitialUser();
        setEmail(user.email);
        setName(user.name);
        setSurname(user.surname);
    }, []);

    useEffect(() => {
        const user = getInitialUser();
        const changed = 
            email !== user.email ||
            name !== user.name ||
            surname !== user.surname;
        setHasChanges(changed);
    }, [email, name, surname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const user = getInitialUser();
        if (!user.userID) {
            setError("Brakuje ID użytkownika");
            return;
        }

        if (!hasChanges) {
            setError("Nie wprowadzono żadnych zmian");
            return;
        }

        if (!window.confirm("Czy na pewno chcesz zmienić dane osobowe?")) return;

        setLoading(true);

        try {
            const { data } = await fetchAPI('/auth/users/changeUserData', {
                method: 'POST',
                body: JSON.stringify({
                    id: user.userID,
                    email,
                    name,
                    surname
                })
            });

            setMessage("Dane użytkownika zostały zaktualizowane pomyślnie!");
            
            localStorage.setItem("email", email);
            localStorage.setItem("name", name);
            localStorage.setItem("surname", surname);

            window.dispatchEvent(new Event("storage"));

            setTimeout(() => navigate("/frontPage"), 1500);

        } catch (err) {
            console.error(" Błąd zmiany danych:", err);
            setError(err.message || "Błąd podczas zmiany danych użytkownika");
            setLoading(false);
        }
    };

    const handleReset = () => {
        const user = getInitialUser();
        setEmail(user.email);
        setName(user.name);
        setSurname(user.surname);
        setError("");
        setMessage("");
    };

    return (
        <>
            <style>{`
                /* 
                   KONTENER GŁÓWNY
                    */
                .change-data-container {
                    max-width: 700px;
                    margin: 40px auto;
                    background: white;
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                }

                /* 
                   NAGŁÓWEK
                    */
                .change-data-header {
                    margin-bottom: 30px;
                }

                .change-data-header h2 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .change-data-header p {
                    color: #666;
                    font-size: 14px;
                    line-height: 1.6;
                }

                /* 
                   BREADCRUMB
                    */
                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: #666;
                }

                .breadcrumb a {
                    color: #667eea;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .breadcrumb a:hover {
                    color: #764ba2;
                }

                .breadcrumb span {
                    color: #999;
                }

                /* 
                   INFO ALERT
                    */
                .info-alert {
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    font-size: 14px;
                    color: #856404;
                    display: flex;
                    gap: 12px;
                }

                .info-alert::before {
                    content: "⚠️";
                    font-size: 20px;
                    flex-shrink: 0;
                }

                /* 
                   CURRENT DATA DISPLAY
                    */
                .current-data-box {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                    border: 2px solid #e0e0e0;
                }

                .current-data-box h3 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .data-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e0e0e0;
                }

                .data-item:last-child {
                    border-bottom: none;
                }

                .data-label {
                    font-weight: 600;
                    color: #666;
                    font-size: 14px;
                }

                .data-value {
                    color: #333;
                    font-size: 14px;
                    font-weight: 500;
                }

                /* 
                   FORMULARZ
                    */
                .change-data-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .form-group input {
                    width: 100%;
                    padding: 14px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-group input:disabled {
                    background: #f5f5f5;
                    cursor: not-allowed;
                }

                .form-group input.changed {
                    border-color: #ff9800;
                    background: #fff8e1;
                }

                .input-hint {
                    font-size: 12px;
                    color: #999;
                    margin-top: 4px;
                }

                /* 
                   PRZYCISKI
                    */
                .form-actions {
                    display: flex;
                    gap: 12px;
                    margin-top: 10px;
                }

                .submit-button {
                    flex: 1;
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }

                .submit-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .reset-button,
                .cancel-button {
                    padding: 14px 24px;
                    background: white;
                    color: #666;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .reset-button:hover:not(:disabled),
                .cancel-button:hover:not(:disabled) {
                    background: #f5f5f5;
                    border-color: #ccc;
                }

                .reset-button:disabled,
                .cancel-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* 
                   KOMUNIKATY
                    */
                .success-message {
                    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                    color: #155724;
                    padding: 16px;
                    border-radius: 8px;
                    border: 2px solid #b1dfbb;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                    animation: slideIn 0.3s ease;
                }

                .success-message::before {
                    content: "✅";
                    font-size: 24px;
                }

                .error-message {
                    background: #fee;
                    color: #c33;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    border: 1px solid #fcc;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: shake 0.3s ease;
                }

                .error-message::before {
                    content: "⚠️";
                    font-size: 18px;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                /* 
                   CHANGES INDICATOR
                    */
                .changes-indicator {
                    background: #fff3cd;
                    color: #856404;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    border: 1px solid #ffc107;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .changes-indicator::before {
                    content: "📝";
                    font-size: 18px;
                }

                /* 
                   LOADING SPINNER
                    */
                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* 
                   RESPONSIVE
                    */
                @media (max-width: 768px) {
                    .change-data-container {
                        margin: 20px;
                        padding: 30px 20px;
                    }

                    .change-data-header h2 {
                        font-size: 24px;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .data-item {
                        flex-direction: column;
                        gap: 4px;
                    }
                }
            `}</style>

            <div className="change-data-container">
                <div className="breadcrumb">
                    <a href="/frontPage">Dashboard</a>
                    <span>›</span>
                    <span>Zmiana danych</span>
                </div>

                <div className="change-data-header">
                    <h2>
                        <span><FaUser style={{ marginRight: '5px' }}/></span>
                        Zmiana danych użytkownika
                    </h2>
                    <p>Zaktualizuj swoje dane osobowe. Upewnij się, że wszystkie informacje są poprawne.</p>
                </div>

                <div className="info-alert">
                    <div>
                        <strong>Ważne informacje:</strong>
                        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                            <li>Adres e-mail musi być aktywny i poprawny</li>
                            <li>Zmiana danych może wymagać ponownego zalogowania</li>
                            <li>Wszystkie pola są wymagane</li>
                        </ul>
                    </div>
                </div>

                {message ? (
                    <div className="success-message">
                        <div>
                            <strong>{message}</strong>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                                Przekierowanie do panelu...
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="current-data-box">
                            <h3><FaClipboardList style={{ marginRight: '5px' }}/> Aktualne dane</h3>
                            <div className="data-item">
                                <span className="data-label">Email:</span>
                                <span className="data-value">{getInitialUser().email}</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Imię:</span>
                                <span className="data-value">{getInitialUser().name}</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Nazwisko:</span>
                                <span className="data-value">{getInitialUser().surname}</span>
                            </div>
                        </div>

                        <form className="change-data-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">
                                    <FaEnvelope style={{ marginRight: '5px' }}/> Adres e-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                                    title="Wprowadź poprawny adres email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={loading}
                                    className={email !== getInitialUser().email ? 'changed' : ''}
                                    placeholder="przykład@email.com"
                                />
                                <span className="input-hint">Aktywny adres e-mail</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">
                                    <FaEdit style={{ marginRight: '5px' }}/> Imię
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    pattern="^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+){0,2}$"
                                    title="Wprowadź poprawne imię"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    disabled={loading}
                                    className={name !== getInitialUser().name ? 'changed' : ''}
                                    placeholder="Jan"
                                />
                                <span className="input-hint">Wielka litera na początku</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="surname">
                                    <FaEdit style={{ marginRight: '5px' }}/> Nazwisko
                                </label>
                                <input
                                    type="text"
                                    id="surname"
                                    name="surname"
                                    required
                                    pattern="^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:[-\s][A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$"
                                    title="Wprowadź poprawne nazwisko"
                                    value={surname}
                                    onChange={e => setSurname(e.target.value)}
                                    disabled={loading}
                                    className={surname !== getInitialUser().surname ? 'changed' : ''}
                                    placeholder="Kowalski"
                                />
                                <span className="input-hint">Wielka litera na początku</span>
                            </div>

                            {hasChanges && !error && !message && (
                                <div className="changes-indicator">
                                    Wykryto zmiany w danych. Pamiętaj o zapisaniu!
                                </div>
                            )}

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="submit-button"
                                    disabled={loading || !hasChanges}
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            Zapisywanie...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave style={{ marginRight: '5px' }}/> Zapisz zmiany
                                        </>
                                    )}
                                </button>
                                <button 
                                    type="button" 
                                    className="reset-button"
                                    onClick={handleReset}
                                    disabled={loading || !hasChanges}
                                >
                                    ↺ Resetuj
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => navigate("/frontPage")}
                                    disabled={loading}
                                >
                                    ← Anuluj
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </>
    );
}