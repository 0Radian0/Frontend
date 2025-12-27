import React, { useState, useEffect } from "react";
import TrainingsCalendar from "../components/Calendar";
import { Link } from 'react-router-dom';
import { fetchAPI } from "../config/api";

export default function FrontPage() {
    const [sumToPay, setSumToPay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTraining, setSelectedTraining] = useState(null);
    
    const rawDescription = localStorage.getItem("description");
    const description =
        rawDescription && rawDescription !== "undefined" && rawDescription.trim() !== ""
            ? rawDescription
            : "Brak opisu użytkownika :(";
    
    const userID = Number(localStorage.getItem("userID"));

    useEffect(() => {
        const showPaymentStatus = async () => {
            if (!userID) {
                setError("Nie znaleziono ID użytkownika");
                setLoading(false);
                return;
            }

            try {
                const { data } = await fetchAPI(`/payments/paymentStatus/${userID}`, {
                    method: 'GET'
                });

                setSumToPay(Number(data.sumToPay) || 0);
                setLoading(false);

            } catch (err) {
                console.error("❌ Błąd wyświetlania statusu płatności:", err);
                setError(err.message || "Nie udało się pobrać statusu płatności");
                setLoading(false);
            }
        };

        showPaymentStatus();
    }, [userID]);

    const handleDateSelect = (trainingData) => {
        setSelectedTraining(trainingData);
    };

    return (
        <>
            <style>{`
                /* ============================================
                   GŁÓWNY KONTENER DASHBOARDU
                   ============================================ */
                .dashboard-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    background: #fafafa;
                    min-height: 100vh;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    align-items: start;
                }

                /* ============================================
                   LEWA KOLUMNA - KALENDARZ
                   ============================================ */
                .calendar-section {
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    position: sticky;
                    top: 20px;
                }

                .calendar-section h2 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #333;
                }

                /* ============================================
                   PRAWA KOLUMNA - INFORMACJE
                   ============================================ */
                .info-section {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .info-card {
                    background: white;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    transition: box-shadow 0.3s ease;
                }

                .info-card:hover {
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                }

                .info-card h3 {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #333;
                }

                /* ============================================
                   STATUS PŁATNOŚCI
                   ============================================ */
                .payment-status {
                    font-size: 16px;
                    padding: 20px;
                    border-radius: 8px;
                    background: #f8f9fa;
                    margin-top: 10px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .payment-status.paid {
                    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                    color: #155724;
                    border: 2px solid #b1dfbb;
                }

                .payment-status.unpaid {
                    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                    color: #856404;
                    border: 2px solid #ffd93d;
                }

                .payment-amount {
                    font-size: 32px;
                    font-weight: 700;
                    margin-top: 10px;
                    letter-spacing: -1px;
                }

                /* ============================================
                   PRZYCISKI ZARZĄDZANIA
                   ============================================ */
                .action-buttons {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 12px;
                }

                .action-button {
                    display: block;
                    padding: 14px 20px;
                    background: #333;
                    color: white;
                    text-decoration: none;
                    text-align: center;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                }

                .action-button:hover {
                    background: #000;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                /* ============================================
                   OPIS UŻYTKOWNIKA
                   ============================================ */
                .user-description-content {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    min-height: 100px;
                    line-height: 1.8;
                    color: #555;
                    border-left: 4px solid #333;
                    font-size: 15px;
                }

                /* ============================================
                   SZCZEGÓŁY TRENINGU
                   ============================================ */
                .training-details {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 12px;
                    animation: slideIn 0.3s ease;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
                }

                .training-details h3 {
                    color: white;
                    margin-bottom: 15px;
                    font-size: 22px;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                    padding-bottom: 10px;
                }

                .training-details p {
                    margin: 12px 0;
                    font-size: 15px;
                    line-height: 1.6;
                }

                .training-details strong {
                    font-weight: 600;
                    margin-right: 8px;
                }

                .no-training-selected {
                    text-align: center;
                    padding: 40px 20px;
                    color: #999;
                    font-size: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border: 2px dashed #ddd;
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

                /* ============================================
                   LOADING & ERROR STATES
                   ============================================ */
                .loading-spinner {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-size: 15px;
                }

                .loading-spinner::before {
                    content: "⏳";
                    display: block;
                    font-size: 32px;
                    margin-bottom: 10px;
                    animation: spin 2s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-message {
                    color: #dc3545;
                    padding: 15px;
                    background: #f8d7da;
                    border-radius: 8px;
                    border: 1px solid #f5c6cb;
                    font-size: 14px;
                }

                /* ============================================
                   RESPONSIVE
                   ============================================ */
                @media (max-width: 992px) {
                    .dashboard-container {
                        padding: 20px 15px;
                    }

                    .dashboard-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }

                    .calendar-section {
                        position: static;
                        padding: 20px;
                    }

                    .calendar-section h2 {
                        font-size: 20px;
                    }

                    .info-card {
                        padding: 20px;
                    }

                    .info-card h3 {
                        font-size: 18px;
                    }

                    .action-buttons {
                        grid-template-columns: 1fr;
                    }

                    .payment-amount {
                        font-size: 28px;
                    }
                }

                @media (max-width: 576px) {
                    .dashboard-container {
                        padding: 15px 10px;
                    }

                    .calendar-section,
                    .info-card {
                        padding: 15px;
                    }
                }
            `}</style>

            <div className="dashboard-container">
                <div className="dashboard-grid">
                    {/* LEWA KOLUMNA - KALENDARZ */}
                    <div className="calendar-section">
                        <h2>📅 Kalendarz Treningów</h2>
                        <TrainingsCalendar onDateSelect={handleDateSelect} />
                    </div>

                    {/* PRAWA KOLUMNA - INFORMACJE */}
                    <div className="info-section">
                        {/* Status płatności */}
                        <div className="info-card">
                            <h3>💳 Status Płatności</h3>
                            {loading ? (
                                <div className="loading-spinner">Ładowanie...</div>
                            ) : error ? (
                                <div className="error-message">{error}</div>
                            ) : (
                                <div className={`payment-status ${sumToPay > 0 ? 'unpaid' : 'paid'}`}>
                                    {sumToPay > 0 ? (
                                        <>
                                            <div>Do zapłaty:</div>
                                            <div className="payment-amount">{sumToPay.toFixed(2)} zł</div>
                                        </>
                                    ) : (
                                        <div>✅ Wszystko opłacone!</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Szczegóły treningu */}
                        <div className="info-card">
                            <h3>🥋 Szczegóły Treningu</h3>
                            {selectedTraining ? (
                                <div className="training-details">
                                    <h3>{selectedTraining.title || "Trening"}</h3>
                                    <p><strong>📅 Data:</strong> {selectedTraining.date}</p>
                                    <p><strong>⏰ Godzina:</strong> {selectedTraining.time}</p>
                                    <p><strong>🏛️ Miejsce:</strong> {selectedTraining.place}</p>
                                    <p><strong>📝 Opis:</strong> {selectedTraining.description}</p>
                                    
                                    {selectedTraining.allTrainings && selectedTraining.allTrainings.length > 1 && (
                                        <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.9 }}>
                                            ℹ️ Tego dnia odbywają się {selectedTraining.allTrainings.length} treningi
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="no-training-selected">
                                    👈 Kliknij datę w kalendarzu, aby zobaczyć szczegóły treningu
                                </div>
                            )}
                        </div>

                        {/* Zarządzanie kontem */}
                        <div className="info-card">
                            <h3>⚙️ Zarządzanie Kontem</h3>
                            <div className="action-buttons">
                                <Link to="/changePassword" className="action-button">
                                    🔒 Zmiana hasła
                                </Link>
                                <Link to="/changeDescription" className="action-button">
                                    ✏️ Zmiana opisu
                                </Link>
                                <Link to="/changeData" className="action-button">
                                    👤 Zmiana danych
                                </Link>
                            </div>
                        </div>

                        {/* Opis użytkownika */}
                        <div className="info-card">
                            <h3>📝 O Mnie</h3>
                            <div className="user-description-content">
                                {description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}