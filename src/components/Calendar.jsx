import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function TrainingsCalendar() {
  const [trainings, setTrainings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Używamy fetchAPI
        const { data } = await fetchAPI('/trainings/AllTrainings', {
          method: 'GET'
        });
        
        setTrainings(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Błąd przy pobieraniu treningów:", err);
        setError("Nie udało się pobrać treningów");
        setLoading(false);
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

      {loading ? (
        <p>Ładowanie kalendarza...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <Calendar 
            onClickDay={handleDateClick} 
            tileClassName={tileClassName} 
          />

          {selectedDate && (
            <div className="training-details" style={{ marginTop: '20px' }}>
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
                <p>Wolne. Nie ma treningu 🏖️</p>
              ) : (
                selectedTrainings.map((t) => (
                  <div key={t.trainingID} className="training-item" style={{
                    padding: '15px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '5px',
                    marginBottom: '10px'
                  }}>
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
        </>
      )}
    </div>
  );
}