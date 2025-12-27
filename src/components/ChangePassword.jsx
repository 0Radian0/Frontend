import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        
        // Walidacja hasła
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Wszystkie pola są wymagane");
            return;
        }
        if (newPassword.length < 8) {
            setError("Hasło musi mieć co najmniej 8 znaków");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Hasła muszą być identyczne");
            return;
        }

        if (!window.confirm("Czy na pewno chcesz zmienić hasło?")) return;

        const userID = localStorage.getItem("userID");
        if (!userID) {
            setError("Brak zalogowanego użytkownika");
            return;
        }

        setLoading(true);

        try {
            const { data } = await fetchAPI('/auth/users/changePassword', {
                method: 'POST',
                body: JSON.stringify({ userID, oldPassword, newPassword }),
            });

            setMessage(data.message || "Hasło zostało zmienione pomyślnie!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => navigate("/frontPage"), 1000);

        } catch (err) {
            console.error("❌ Błąd zmiany hasła:", err);
            setError(err.message || "Nie udało się zmienić hasła");
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '#ddd' };
        if (password.length < 8) return { strength: 25, label: 'Słabe', color: '#f44336' };
        
        let strength = 25;
        if (password.length >= 10) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 12.5;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
        
        if (strength <= 25) return { strength, label: 'Słabe', color: '#f44336' };
        if (strength <= 50) return { strength, label: 'Średnie', color: '#ff9800' };
        if (strength <= 75) return { strength, label: 'Dobre', color: '#4caf50' };
        return { strength, label: 'Bardzo dobre', color: '#2e7d32' };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <>
            <style>{`
                /* ============================================
                   KONTENER GŁÓWNY
                   ============================================ */
                .change-password-container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: white;
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                }

                /* ============================================
                   NAGŁÓWEK
                   ============================================ */
                .change-password-header {
                    margin-bottom: 30px;
                }

                .change-password-header h2 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .change-password-header p {
                    color: #666;
                    font-size: 14px;
                }

                /* ============================================
                   BREADCRUMB
                   ============================================ */
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

                /* ============================================
                   FORMULARZ
                   ============================================ */
                .change-password-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
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
                }

                .password-input-wrapper {
                    position: relative;
                }

                .form-group input {
                    width: 100%;
                    padding: 14px 45px 14px 16px;
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

                .toggle-password {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    padding: 8px;
                    font-size: 18px;
                    transition: color 0.2s ease;
                }

                .toggle-password:hover {
                    color: #667eea;
                }

                /* ============================================
                   SIŁA HASŁA
                   ============================================ */
                .password-strength {
                    margin-top: 8px;
                }

                .strength-bar-bg {
                    width: 100%;
                    height: 6px;
                    background: #e0e0e0;
                    border-radius: 3px;
                    overflow: hidden;
                }

                .strength-bar-fill {
                    height: 100%;
                    transition: all 0.3s ease;
                    border-radius: 3px;
                }

                .strength-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 6px;
                    font-size: 12px;
                }

                .strength-label span:first-child {
                    font-weight: 600;
                }

                .strength-label span:last-child {
                    color: #666;
                }

                /* ============================================
                   INFO BOX
                   ============================================ */
                .info-box {
                    background: #e3f2fd;
                    border-left: 4px solid #2196f3;
                    padding: 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #1565c0;
                }

                .info-box strong {
                    display: block;
                    margin-bottom: 8px;
                    color: #0d47a1;
                }

                .info-box ul {
                    margin: 8px 0 0 0;
                    padding-left: 20px;
                }

                .info-box li {
                    margin: 4px 0;
                }

                /* ============================================
                   PRZYCISKI
                   ============================================ */
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

                .cancel-button:hover {
                    background: #f5f5f5;
                    border-color: #ccc;
                }

                /* ============================================
                   KOMUNIKATY
                   ============================================ */
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

                /* ============================================
                   LOADING SPINNER
                   ============================================ */
                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-right: 8px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* ============================================
                   RESPONSIVE
                   ============================================ */
                @media (max-width: 768px) {
                    .change-password-container {
                        margin: 20px;
                        padding: 30px 20px;
                    }

                    .change-password-header h2 {
                        font-size: 24px;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .cancel-button {
                        order: 2;
                    }
                }
            `}</style>

            <div className="change-password-container">
                <div className="breadcrumb">
                    <a href="/frontPage">Dashboard</a>
                    <span>›</span>
                    <span>Zmiana hasła</span>
                </div>

                <div className="change-password-header">
                    <h2>
                        <span>🔒</span>
                        Zmiana hasła
                    </h2>
                    <p>Zaktualizuj hasło do swojego konta</p>
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
                    <form className="change-password-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="oldPassword">Aktualne hasło</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPasswords.old ? "text" : "password"}
                                    id="oldPassword"
                                    name="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Wprowadź aktualne hasło"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                                    tabIndex="-1"
                                >
                                    {showPasswords.old ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">Nowe hasło</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    required
                                    minLength="8"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Wprowadź nowe hasło"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                    tabIndex="-1"
                                >
                                    {showPasswords.new ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            
                            {newPassword && (
                                <div className="password-strength">
                                    <div className="strength-bar-bg">
                                        <div 
                                            className="strength-bar-fill"
                                            style={{
                                                width: `${passwordStrength.strength}%`,
                                                backgroundColor: passwordStrength.color
                                            }}
                                        />
                                    </div>
                                    <div className="strength-label">
                                        <span style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label}
                                        </span>
                                        <span>{newPassword.length} znaków</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Potwierdź nowe hasło</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    minLength="8"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Powtórz nowe hasło"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                    tabIndex="-1"
                                >
                                    {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <div className="info-box">
                            <strong>💡 Wskazówki dotyczące bezpiecznego hasła:</strong>
                            <ul>
                                <li>Używaj co najmniej 8 znaków</li>
                                <li>Połącz małe i wielkie litery</li>
                                <li>Dodaj cyfry i znaki specjalne</li>
                                <li>Unikaj popularnych haseł i danych osobowych</li>
                            </ul>
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading && <span className="loading-spinner"></span>}
                                {loading ? 'Zmiana hasła...' : 'Zmień hasło'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => navigate("/frontPage")}
                                disabled={loading}
                            >
                                Anuluj
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}