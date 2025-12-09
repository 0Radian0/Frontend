import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangeDescription() {
    const [newDescription, setNewDescription] = useState("");
    const [currentDescription, setCurrentDescription] = useState(() => {
        const rawDescription = localStorage.getItem("description");
        return rawDescription && rawDescription !== "undefined" && rawDescription.trim() !== ""
            ? rawDescription
            : "Brak poprzedniego opisu.";
    });

    const userID = Number(localStorage.getItem("userID"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!userID) {
            alert("Nie znaleziono użytkownika");
            navigate("/FrontPage");
        }
    }, [userID, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newDescription.trim()) {
            alert("Opis nie może być pusty!");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/users/changeDescription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID, newDescription }),
            });
            const data = await res.json();

            if (res.ok) {
                alert("Opis został pomyślnie zmieniony!");
                localStorage.setItem("description", newDescription);
                setCurrentDescription(newDescription);
                navigate("/FrontPage");
            } else {
                alert(data.error || "Nie udało się zmienić opisu.");
            }
        } catch (err) {
            console.error("Błąd przy wysyłaniu nowego opisu:", err);
            alert("Wystąpił błąd połączenia z serwerem.");
        }
    };


    return (
        <div className="trainings-container">
            <h2>Zmiana opisu użytkownika</h2>

            <h3>Twój obecny opis:</h3>
            <p>{currentDescription}</p>
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
                    required
                ></textarea>

                <br />
                <button type="submit">Zapisz nowy opis</button>
            </form>
        </div>
    );
}
