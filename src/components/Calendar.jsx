import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { fetchAPI } from "../config/api";
import 'react-calendar/dist/Calendar.css';
//import "../assets/styles/calendar.css";

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
      <style>{`
        /* 
           REACT-CALENDAR OVERRIDE - Minimalistyczny styl
            */
        .react-calendar {
          width: 100%;
          border: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: white;
        }

        .react-calendar__navigation {
          display: flex;
          height: 50px;
          margin-bottom: 20px;
          background: transparent;
        }

        .react-calendar__navigation button {
          min-width: 44px;
          background: transparent;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          border: none;
          transition: all 0.2s ease;
        }

        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f5f5f5;
          border-radius: 8px;
        }

        .react-calendar__navigation button:disabled {
          background-color: transparent;
          color: #ccc;
        }

        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 12px;
          color: #999;
          margin-bottom: 10px;
        }

        .react-calendar__month-view__weekdays__weekday {
          padding: 10px;
        }

        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }

        .react-calendar__tile {
          max-width: 100%;
          padding: 15px 6px;
          background: transparent;
          text-align: center;
          line-height: 1.5;
          font-size: 14px;
          color: #333;
          border: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          position: relative;
        }

        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f5f5f5;
        }

        .react-calendar__tile--now {
          background: #e3f2fd;
          font-weight: 600;
          color: #1976d2;
        }

        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: #bbdefb;
        }

        .react-calendar__tile--active {
          background: #333;
          color: white;
          font-weight: 600;
        }

        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #555;
        }

        /* Dni z treningiem */
        .react-calendar__tile.has-training::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background: #4caf50;
          border-radius: 50%;
        }

        .react-calendar__tile.has-training {
          font-weight: 600;
        }

        .react-calendar__tile--active.has-training::after {
          background: white;
        }

        /* Dni poza bieżącym miesiącem */
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #ccc;
        }

        /* 
           SZCZEGÓŁY TRENINGU POD KALENDARZEM
            */
        .calendar-training-details {
          margin-top: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border-left: 4px solid #333;
        }

        .calendar-training-details h4 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 15px;
          color: #333;
        }

        .training-list-item {
          padding: 15px;
          background: white;
          border-radius: 8px;
          margin-bottom: 10px;
          border: 1px solid #e0e0e0;
        }

        .training-list-item:last-child {
          margin-bottom: 0;
        }

        .training-list-item p {
          margin: 6px 0;
          font-size: 14px;
          color: #555;
        }

        .training-list-item strong {
          color: #333;
          font-weight: 600;
        }

        .no-training-message {
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 14px;
          background: white;
          border-radius: 8px;
          border: 1px dashed #ddd;
        }

        /* Loading & Error */
        .calendar-loading {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .calendar-error {
          padding: 20px;
          background: #fee;
          color: #c33;
          border-radius: 8px;
          border: 1px solid #fcc;
        }
      `}</style>

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
                  selectedTrainings.map((t) => (
                    <div key={t.trainingID} className="training-list-item">
                      <p>
                        <strong> Miejsce:</strong> {t.trainingPlace}
                      </p>
                      <p>
                        <strong> Godzina:</strong>{" "}
                        {new Date(t.trainingDate).toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p>
                        <strong> Opis:</strong> {t.trainingDetails || "Standardowy trening"}
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