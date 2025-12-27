import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { fetchAPI } from "../config/api";
import 'react-calendar/dist/Calendar.css';
import "../assets/styles/calendar.css";

export default function TrainingsCalendar({ onDateSelect }) {
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

    // ✅ WAŻNE: Wywołaj callback dla FrontPage
    if (onDateSelect && filtered.length > 0) {
      const firstTraining = filtered[0];
      onDateSelect({
        title: `Trening - ${firstTraining.trainingPlace}`,
        date: date.toLocaleDateString('pl-PL'),
        time: new Date(firstTraining.trainingDate).toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        description: firstTraining.trainingDetails || "Brak szczegółowego opisu treningu",
        instructor: "Instruktor klubu",
        place: firstTraining.trainingPlace,
        allTrainings: filtered
      });
    } else if (onDateSelect) {
      // Jeśli brak treningów, wyczyść szczegóły
      onDateSelect(null);
    }
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
    <>
     

      <div className="calendar-container">
        {loading ? (
          <div className="calendar-loading">
            <div>⏳ Ładowanie kalendarza...</div>
          </div>
        ) : error ? (
          <div className="calendar-error">{error}</div>
        ) : (
          <>
            <Calendar 
              onClickDay={handleDateClick} 
              tileClassName={tileClassName}
              locale="pl-PL"
            />

            {selectedDate && (
              <div className="calendar-training-details">
                <h4>
                  📅 {selectedDate.toLocaleDateString("pl-PL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>

                {selectedTrainings.length === 0 ? (
                  <div className="no-training-message">
                    🏖️ Brak treningów tego dnia
                  </div>
                ) : (
                  selectedTrainings.map((t) => (
                    <div key={t.trainingID} className="training-list-item">
                      <p>
                        <strong>🏛️ Miejsce:</strong> {t.trainingPlace}
                      </p>
                      <p>
                        <strong>⏰ Godzina:</strong>{" "}
                        {new Date(t.trainingDate).toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p>
                        <strong>📝 Opis:</strong> {t.trainingDetails || "Standardowy trening"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}