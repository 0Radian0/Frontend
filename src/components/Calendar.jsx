import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api";
import 'react-calendar/dist/Calendar.css';
import "../assets/styles/calendar.css";

export default function TrainingsCalendar({ onDateSelect }) {
  const [trainings, setTrainings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const parseLocalDate = (dateStr) => {
    return new Date(dateStr.replace('Z', '').replace(/[+-]\d{2}:\d{2}$/, ''));
  };

  const filterTrainingsForDate = (date, allTrainings) => {
    return allTrainings.filter((t) => {
      const trainingDate = parseLocalDate(t.trainingDate);
      return (
        trainingDate.getFullYear() === date.getFullYear() &&
        trainingDate.getMonth() === date.getMonth() &&
        trainingDate.getDate() === date.getDate()
      );
    });
  };

  const notifyParent = (date, filtered) => {
    if (!onDateSelect) return;

    if (filtered.length > 0) {
      const firstTraining = filtered[0];
      onDateSelect({
        title: `Trening - ${firstTraining.trainingPlace}`,
        date: date.toLocaleDateString('pl-PL'),
        time: parseLocalDate(firstTraining.trainingDate).toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        description: firstTraining.trainingDetails || "Brak szczegółowego opisu treningu",
        instructor: "Instruktor klubu",
        place: firstTraining.trainingPlace,
        allTrainings: filtered
      });
    } else {
      onDateSelect(null);
    }
  };

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await fetchAPI('/trainings/AllTrainings?newTrainings=false', {
          method: 'GET'
        });

        setTrainings(data);

        const today = new Date();
        const todayTrainings = filterTrainingsForDate(today, data);
        setSelectedTrainings(todayTrainings);
        notifyParent(today, todayTrainings);

        setLoading(false);
      } catch (err) {
        console.error("Błąd przy pobieraniu treningów:", err);
        setError("Nie udało się pobrać treningów");
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);

    const filtered = filterTrainingsForDate(date, trainings);
    setSelectedTrainings(filtered);
    notifyParent(date, filtered);
  };

  const tileClassName = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasTraining = trainings.some((t) => {
      const trainingDate = parseLocalDate(t.trainingDate);
      return (
        trainingDate.getFullYear() === date.getFullYear() &&
        trainingDate.getMonth() === date.getMonth() &&
        trainingDate.getDate() === date.getDate()
      );
    });

    if (!hasTraining) return null;

    return date < today ? "has-training has-training--past" : "has-training";
  };

  return (
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
            value={selectedDate}
          />

          {selectedDate && (
            <div className="calendar-training-details">
              <h4>
                {selectedDate.toLocaleDateString("pl-PL", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>

              {selectedTrainings.length === 0 ? (
                <div className="no-training-message">
                  Brak treningów tego dnia
                </div>
              ) : (
                <>
                  {selectedTrainings.map((t) => (
                    <div key={t.trainingID} className="training-list-item">
                      <p>
                        <strong>Miejsce:</strong> {t.trainingPlace}
                      </p>
                      <p>
                        <strong>Godzina:</strong>{" "}
                        {parseLocalDate(t.trainingDate).toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p>
                        <strong>Opis:</strong> {t.trainingDetails || "Standardowy trening"}
                      </p>
                    </div>
                  ))}

                  <button
                    className="btn-sign-up-training"
                    onClick={() => navigate("/trainings")}
                  >
                    Zapisz się na trening
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}