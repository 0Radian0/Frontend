import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAPI } from "../config/api";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        // Walidacja hasła
        if (!newPassword || !confirmPassword) {
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

        setLoading(true);

        try {
            const { data } = await fetchAPI('/auth/users/resetPasswordToken', {
                method: 'POST',
                body: JSON.stringify({ token, newPassword }),
            });

            setMessage(data.message || "Zmiana hasła zakończona sukcesem");
            setNewPassword("");
            setConfirmPassword("");
            
            setTimeout(() => navigate("/login"), 2000);

        } catch (err) {
            console.error("Błąd resetowania hasła:", err);
            setError(err.message || "Błąd podczas zmiany hasła");
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
                /* 
                   KONTENER GŁÓWNY
                    */
                .reset-password-wrapper {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px 20px;
                }

                .reset-password-container {
                    max-width: 480px;
                    width: 100%;
                    background: white;
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                }

                /* 
                   NAGŁÓWEK
                    */
                .reset-password-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .reset-password-icon {
                    font-size: 48px;
                    margin-bottom: 15px;
                }

                .reset-password-header h2 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                }

                .reset-password-header p {
                    color: #666;
                    font-size: 14px;
                }

                /* 
                   FORMULARZ
                    */
                .reset-password-form {
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

                /* Toggle visibility button */
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

                /* 
                   SIŁA HASŁA
                    */
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

                /* 
                   WYMAGANIA HASŁA
                    */
                .password-requirements {
                    background: #f8f9fa;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #666;
                }

                .password-requirements ul {
                    margin: 8px 0 0 0;
                    padding-left: 20px;
                    list-style: none;
                }

                .password-requirements li {
                    margin: 4px 0;
                    position: relative;
                }

                .password-requirements li::before {
                    content: "•";
                    position: absolute;
                    left: -15px;
                    color: #667eea;
                }

                /* 
                   PRZYCISK
                    */
                .submit-button {
                    width: 100%;
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 10px;
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

                /* 
                   KOMUNIKATY
                    */
                .success-message {
                    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                    color: #155724;
                    padding: 20px;
                    border-radius: 12px;
                    text-align: center;
                    border: 2px solid #b1dfbb;
                }

                .success-message .icon {
                    font-size: 48px;
                    margin-bottom: 15px;
                }

                .success-message h3 {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #155724;
                }

                .success-message p {
                    font-size: 14px;
                    color: #155724;
                    margin: 5px 0;
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
                }

                .error-message::before {
                    content: "⚠️";
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
                    margin-right: 8px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* 
                   RESPONSIVE
                    */
                @media (max-width: 576px) {
                    .reset-password-container {
                        padding: 30px 20px;
                    }

                    .reset-password-header h2 {
                        font-size: 24px;
                    }
                }
            `}</style>

            <div className="reset-password-wrapper">
                <div className="reset-password-container">
                    {message ? (
                        <div className="success-message">
                            <div className="icon">✅</div>
                            <h3>Sukces!</h3>
                            <p>{message}</p>
                            <p style={{ marginTop: '10px', fontSize: '13px' }}>
                                Przekierowanie na stronę logowania...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="reset-password-header">
                                <div className="reset-password-icon">🔒</div>
                                <h2>Zmiana hasła</h2>
                                <p>Wprowadź nowe, bezpieczne hasło do swojego konta</p>
                            </div>

                            <form className="reset-password-form" onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label htmlFor="newPassword">Nowe hasło</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
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
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex="-1"
                                        >
                                            {showPassword ? "👁️" : "👁️‍🗨️"}
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
                                    <label htmlFor="confirmPassword">Potwierdź hasło</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            required
                                            minLength="8"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Powtórz nowe hasło"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="password-requirements">
                                    <strong>Wymagania dotyczące hasła:</strong>
                                    <ul>
                                        <li>Co najmniej 8 znaków</li>
                                        <li>Zalecane: małe i wielkie litery</li>
                                        <li>Zalecane: cyfry i znaki specjalne</li>
                                    </ul>
                                </div>

                                {error && (
                                    <div className="error-message">
                                        {error}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className="submit-button"
                                    disabled={loading}
                                >
                                    {loading && <span className="loading-spinner"></span>}
                                    {loading ? 'Zmiana hasła...' : 'Zmień hasło'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}