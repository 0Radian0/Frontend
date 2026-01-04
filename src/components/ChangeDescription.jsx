import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api";

export default function ChangeDescription() {
    const [newDescription, setNewDescription] = useState("");
    const [currentDescription, setCurrentDescription] = useState(() => {
        const rawDescription = localStorage.getItem("description");
        return rawDescription && rawDescription !== "undefined" && rawDescription.trim() !== ""
            ? rawDescription
            : "Brak poprzedniego opisu.";
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    
    const userID = Number(localStorage.getItem("userID"));
    const navigate = useNavigate();

    const MAX_LENGTH = 1000;
    const charCount = newDescription.length;
    const charRemaining = MAX_LENGTH - charCount;

    useEffect(() => {
        if (!userID) {
            setError("Nie znaleziono użytkownika");
            setTimeout(() => navigate("/frontPage"), 2000);
        }
    }, [userID, navigate]);

    useEffect(() => {
        setHasChanges(newDescription.trim() !== "" && newDescription !== currentDescription);
    }, [newDescription, currentDescription]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!newDescription.trim()) {
            setError("Opis nie może być pusty!");
            return;
        }

        if (newDescription.length > MAX_LENGTH) {
            setError(`Opis jest za długi! Maksymalnie ${MAX_LENGTH} znaków.`);
            return;
        }

        setLoading(true);

        try {
            const { data } = await fetchAPI('/auth/users/changeDescription', {
                method: 'POST',
                body: JSON.stringify({ userID, newDescription }),
            });

            setSuccess(true);
            localStorage.setItem("description", newDescription);
            setCurrentDescription(newDescription);
            
            window.dispatchEvent(new Event("storage"));
            
            setTimeout(() => navigate("/frontPage"), 1500);

        } catch (err) {
            console.error("❌ Błąd przy zmianie opisu:", err);
            setError(err.message || "Wystąpił błąd połączenia z serwerem.");
            setLoading(false);
        }
    };

    const handleReset = () => {
        setNewDescription("");
        setError("");
    };

    return (
        <>
            <style>{`
                /* 
                   KONTENER GŁÓWNY
                    */
                .change-description-container {
                    max-width: 900px;
                    margin: 40px auto;
                    background: white;
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                }

                /* 
                   NAGŁÓWEK
                    */
                .change-description-header {
                    margin-bottom: 30px;
                }

                .change-description-header h2 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .change-description-header p {
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
                   CURRENT DESCRIPTION
                    */
                .current-description-box {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                    border-left: 4px solid #667eea;
                }

                .current-description-box h3 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .current-description-text {
                    color: #555;
                    line-height: 1.8;
                    font-size: 14px;
                    white-space: pre-wrap;
                }

                /* 
                   INFO BOX
                    */
                .info-box {
                    background: #e3f2fd;
                    border-left: 4px solid #2196f3;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 30px;
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

                /* 
                   FORMULARZ
                   */
                .change-description-form {
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
                    justify-content: space-between;
                }

                .char-counter {
                    font-size: 12px;
                    font-weight: 400;
                    color: #999;
                }

                .char-counter.warning {
                    color: #ff9800;
                }

                .char-counter.danger {
                    color: #f44336;
                }

                .textarea-wrapper {
                    position: relative;
                }

                .form-group textarea {
                    width: 100%;
                    min-height: 200px;
                    padding: 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 15px;
                    font-family: inherit;
                    line-height: 1.6;
                    transition: all 0.3s ease;
                    resize: vertical;
                    box-sizing: border-box;
                }

                .form-group textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-group textarea:disabled {
                    background: #f5f5f5;
                    cursor: not-allowed;
                }

                .form-group textarea.has-content {
                    border-color: #4caf50;
                }

                /* 
                   LIVE PREVIEW
                    */
                .live-preview {
                    background: #fff;
                    border: 2px dashed #e0e0e0;
                    border-radius: 12px;
                    padding: 20px;
                    min-height: 100px;
                }

                .live-preview h4 {
                    font-size: 14px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .preview-content {
                    color: #555;
                    line-height: 1.8;
                    font-size: 14px;
                    white-space: pre-wrap;
                }

                .preview-empty {
                    color: #999;
                    font-style: italic;
                    text-align: center;
                    padding: 20px;
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
                    .change-description-container {
                        margin: 20px;
                        padding: 30px 20px;
                    }

                    .change-description-header h2 {
                        font-size: 24px;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .form-group textarea {
                        min-height: 150px;
                    }
                }
            `}</style>

            <div className="change-description-container">
                <div className="breadcrumb">
                    <a href="/frontPage">Dashboard</a>
                    <span>›</span>
                    <span>Zmiana opisu</span>
                </div>

                <div className="change-description-header">
                    <h2>
                        <span>📝</span>
                        Zmiana opisu użytkownika
                    </h2>
                    <p>Opowiedz społeczności o sobie i swojej przygodzie z HEMA</p>
                </div>

                {success ? (
                    <div className="success-message">
                        <div>
                            <strong>Opis został pomyślnie zaktualizowany!</strong>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                                Przekierowanie do panelu...
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="current-description-box">
                            <h3>
                                <span>📄</span>
                                Twój obecny opis:
                            </h3>
                            <div className="current-description-text">
                                {currentDescription}
                            </div>
                        </div>

                        <div className="info-box">
                            <strong>💡 Co warto zawrzeć w opisie:</strong>
                            <ul>
                                <li>Jak zaczęła się Twoja przygoda z HEMA</li>
                                <li>Jaką bronią się interesujesz</li>
                                <li>Twoje ulubione techniki i style walki</li>
                                <li>Co Cię inspiruje w szermierce historycznej</li>
                            </ul>
                        </div>

                        <form className="change-description-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="newDescription">
                                    <span>✏️ Nowy opis</span>
                                    <span className={`char-counter ${charRemaining < 100 ? 'warning' : ''} ${charRemaining < 0 ? 'danger' : ''}`}>
                                        {charCount} / {MAX_LENGTH} znaków
                                        {charRemaining < 0 && ` (${Math.abs(charRemaining)} za dużo)`}
                                    </span>
                                </label>
                                <div className="textarea-wrapper">
                                    <textarea
                                        id="newDescription"
                                        name="newDescription"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        placeholder="Napisz kilka słów o sobie... Jak zaczęła się Twoja przygoda z HEMA? Co Cię najbardziej inspiruje?"
                                        disabled={loading}
                                        maxLength={MAX_LENGTH}
                                        className={newDescription.trim() ? 'has-content' : ''}
                                    />
                                </div>
                            </div>

                            {newDescription.trim() && (
                                <div className="live-preview">
                                    <h4>
                                        <span>👁️</span>
                                        Podgląd na żywo:
                                    </h4>
                                    <div className="preview-content">
                                        {newDescription}
                                    </div>
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
                                    disabled={loading || !hasChanges || charRemaining < 0}
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            Zapisywanie...
                                        </>
                                    ) : (
                                        <>
                                            💾 Zapisz nowy opis
                                        </>
                                    )}
                                </button>
                                <button 
                                    type="button" 
                                    className="reset-button"
                                    onClick={handleReset}
                                    disabled={loading || !newDescription.trim()}
                                >
                                    ↺ Wyczyść
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