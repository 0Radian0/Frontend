import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";

export default function TrainingsCalendar() {
  const [trainings, setTrainings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTrainings, setSelectedTrainings] = useState([]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/AllTrainings");
        if (!res.ok) throw new Error("Błąd połączenia z serwerem");
        const data = await res.json();
        setTrainings(data);
      } catch (err) {
        console.error("Błąd przy pobieraniu treningów:", err);
      }
    };

    fetchTrainings();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);

    const filtered = trainings.filter((t) => {
      const trainingDate = new Date(t.trainingDate);
      return (
        trainingDate.getFullYear() === date.getFullYear() &&
        trainingDate.getMonth() === date.getMonth() &&
        trainingDate.getDate() === date.getDate()
      );
    });

    setSelectedTrainings(filtered);
  };

  const tileClassName = ({ date }) =>
    trainings.some((t) => {
      const trainingDate = new Date(t.trainingDate);
      return (
        trainingDate.getFullYear() === date.getFullYear() &&
        trainingDate.getMonth() === date.getMonth() &&
        trainingDate.getDate() === date.getDate()
      );
    })
      ? "has-training"
      : null;

  return (
    <div className="calendar-container">
      <h2>Kalendarz treningów</h2>

      <Calendar onClickDay={handleDateClick} tileClassName={tileClassName} />

      {selectedDate && (
        <div className="training-details">
          <h3>
            Treningi w dniu:{" "}
            {selectedDate.toLocaleDateString("pl-PL", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {selectedTrainings.length === 0 ? (
            <p>Wolne. Nie ma treningu :(</p>
          ) : (
            selectedTrainings.map((t) => (
              <div key={t.trainingID} className="training-item">
                <p>
                  <strong>Miejsce:</strong> {t.trainingPlace}
                </p>
                <p>
                  <strong>Opis:</strong> {t.trainingDetails || "Brak opisu"}
                </p>
                <p>
                  <strong>Godzina:</strong>{" "}
                  {new Date(t.trainingDate).toLocaleTimeString("pl-PL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
