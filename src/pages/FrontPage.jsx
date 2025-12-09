import React, { useState, useEffect } from "react";
import TrainingsCalendar from "../components/Calendar";
import { Link } from 'react-router-dom';

export default function FrontPage() {
    const [sumToPay, setSumToPay] = useState(null);
    const rawDescription = localStorage.getItem("description");
    const description =
        rawDescription && rawDescription !== "undefined" && rawDescription.trim() !== ""
            ? rawDescription
            : "Brak opisu użytkownika :("; const userID = Number(localStorage.getItem("userID"));

    useEffect(() => {
        // Wyświetlanie statusu płatności użytkownika
        const showPaymentStatus = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/paymentStatus/${userID}`);
                const data = await res.json();

                if (res.ok) {
                    setSumToPay(Number(data.sumToPay) || 0);
                } else {
                    alert(data.error || "Błąd wyświetlania statusu płatności");
                }
            } catch (e) {
                console.error("Błąd wyświetlania statusu płatności:", e);
            }
        };

        if (userID) showPaymentStatus();
    }, [userID]);


    return (
        <div>
            {/* Status płatności użytkownika */}
            <div className="trainings-container">
                Status płatności za zajęcia:{" "}
                {sumToPay > 0
                    ? `Na dzień dzisiejszy do zapłaty: ${sumToPay.toFixed(2)} zł`
                    : "Opłacone :)"}
            </div>

            {/* Zmiana hasła - przejście do modułu */}
            <Link to="/changePassword">
                <button>Zmiana hasła</button>
            </Link>

            {/* Zmiana opisu użytkownika */}
            <Link to="/changeDescription">
                <button>Zmiana opisu użytkownika</button>
            </Link>

            {/* Zmiana danych użytkownika */}
            <Link to={"/changeData"}>
                <button>Zmiana danych użytkownika</button>
            </Link>

            <h2>Obecny opis</h2>
            <div>{description}</div>

            {/* Kalendarz  */}
            <div>
                <TrainingsCalendar />
            </div>
        </div>
    );
}
