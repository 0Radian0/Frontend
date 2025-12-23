import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function ChangeDescription() {
    const [newDescription, setNewDescription] = useState("");
    const [currentDescription, setCurrentDescription] = useState(() => {
        const rawDescription = localStorage.getItem("description");
        return rawDescription && rawDescription !== "undefined" && rawDescription.trim() !== ""
            ? rawDescription
            : "Brak poprzedniego opisu.";
    });
    const [loading, setLoading] = useState(false);
    
    const userID = Number(localStorage.getItem("userID"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!userID) {
            alert("Nie znaleziono użytkownika");
            navigate("/frontPage");
        }
    }, [userID, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newDescription.trim()) {
            alert("Opis nie może być pusty!");
            return;
        }

        setLoading(true);

        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI('/auth/users/changeDescription', {
                method: 'POST',
                body: JSON.stringify({ userID, newDescription }),
            });

            alert("Opis został pomyślnie zmieniony! ✅");
            localStorage.setItem("description", newDescription);
            setCurrentDescription(newDescription);
            
            // Powiadom inne komponenty o zmianie
            window.dispatchEvent(new Event("storage"));
            
            navigate("/frontPage");

        } catch (err) {
            console.error("❌ Błąd przy zmianie opisu:", err);
            alert(err.message || "Wystąpił błąd połączenia z serwerem.");
            setLoading(false);
        }
    };

    return (
        <div className="trainings-container">
            <h2>Zmiana opisu użytkownika</h2>
            
            <h3>Twój obecny opis:</h3>
            <div style={{
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                {currentDescription}
            </div>
            
            <p>
                Twój opis będzie widoczny dla innych użytkowników forum.
                Napisz kilka słów o sobie — jak zaczęła się Twoja przygoda z HEMA,
                co Cię najbardziej inspiruje i jak lubisz trenować.
                Pomóż społeczności lepiej Cię poznać!
            </p>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="newDescription">Nowy opis:</label>
                <textarea
                    id="newDescription"
                    name="newDescription"
                    rows="10"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Wpisz tutaj swój nowy opis..."
                    disabled={loading}
                    required
                    style={{ width: '100%', padding: '10px' }}
                ></textarea>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Zapisywanie...' : 'Zapisz nowy opis'}
                </button>
            </form>
        </div>
    );
}