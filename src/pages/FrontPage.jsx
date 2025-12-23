import React, { useState, useEffect } from "react";
import TrainingsCalendar from "../components/Calendar";
import { Link } from 'react-router-dom';
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function FrontPage() {
    const [sumToPay, setSumToPay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const rawDescription = localStorage.getItem("description");
    const description =
        rawDescription && rawDescription !== "undefined" && rawDescription.trim() !== ""
            ? rawDescription
            : "Brak opisu użytkownika :(";
    
    const userID = Number(localStorage.getItem("userID"));

    useEffect(() => {
        // Wyświetlanie statusu płatności użytkownika
        const showPaymentStatus = async () => {
            if (!userID) {
                setError("Nie znaleziono ID użytkownika");
                setLoading(false);
                return;
            }

            try {
                // ✅ Używamy fetchAPI
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

    return (
        <div>
            {/* Status płatności użytkownika */}
            <div className="trainings-container">
                <h3>Status płatności za zajęcia</h3>
                {loading ? (
                    <p>Ładowanie...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <p>
                        {sumToPay > 0
                            ? `Na dzień dzisiejszy do zapłaty: ${sumToPay.toFixed(2)} zł`
                            : "Wszystko opłacone! 🎉"}
                    </p>
                )}
            </div>

            {/* Przyciski zarządzania kontem */}
            <div className="account-actions" style={{ margin: '20px 0' }}>
                <Link to="/changePassword">
                    <button>Zmiana hasła</button>
                </Link>

                <Link to="/changeDescription">
                    <button>Zmiana opisu użytkownika</button>
                </Link>

                <Link to="/changeData">
                    <button>Zmiana danych użytkownika</button>
                </Link>
            </div>

            {/* Opis użytkownika */}
            <div className="user-description" style={{ margin: '20px 0' }}>
                <h2>Obecny opis</h2>
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '5px',
                    minHeight: '50px'
                }}>
                    {description}
                </div>
            </div>

            {/* Kalendarz treningów */}
            <div className="trainings-calendar">
                <TrainingsCalendar />
            </div>
        </div>
    );
}