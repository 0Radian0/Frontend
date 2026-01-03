import React, { useState, useEffect } from "react";
import TrainingsCalendar from "../components/Calendar";
import { Link } from 'react-router-dom';
import { fetchAPI } from "../config/api";
import "../components/FrontPage.css";

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
        <div className="dashboard-container">
            <div className="dashboard-grid">
                {/* LEWA KOLUMNA - KALENDARZ */}
                <div className="calendar-section">
                    <h2> Kalendarz Treningów</h2>
                    <TrainingsCalendar onDateSelect={handleDateSelect} />
                </div>

                {/* PRAWA KOLUMNA - INFORMACJE */}
                <div className="info-section">
                    {/* Status płatności */}
                    <div className="info-card">
                        <h3> Status Płatności</h3>
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
                        <h3> Szczegóły Treningu</h3>
                        {selectedTraining ? (
                            <div className="training-details">
                                <h3>{selectedTraining.title || "Trening"}</h3>
                                <p><strong> Data:</strong> {selectedTraining.date}</p>
                                <p><strong> Godzina:</strong> {selectedTraining.time}</p>
                                <p><strong> Miejsce:</strong> {selectedTraining.place}</p>
                                <p><strong> Opis:</strong> {selectedTraining.description}</p>
                                
                                {selectedTraining.allTrainings && selectedTraining.allTrainings.length > 1 && (
                                    <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.9 }}>
                                        ℹ Tego dnia odbywają się {selectedTraining.allTrainings.length} treningi
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="no-training-selected">
                                 Kliknij datę w kalendarzu, aby zobaczyć szczegóły treningu
                            </div>
                        )}
                    </div>

                    {/* Zarządzanie kontem */}
                    <div className="info-card">
                        <h3> Zarządzanie Kontem</h3>
                        <div className="action-buttons">
                            <Link to="/changePassword" className="action-button">
                                 Zmiana hasła
                            </Link>
                            <Link to="/changeDescription" className="action-button">
                                 Zmiana opisu
                            </Link>
                            <Link to="/changeData" className="action-button">
                                 Zmiana danych
                            </Link>
                        </div>
                    </div>

                    {/* Opis użytkownika */}
                    <div className="info-card">
                        <h3> O Mnie</h3>
                        <div className="user-description-content">
                            {description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}