import React, { useState, useEffect } from "react";

export default function TrainingForm({ training }) {
    const [trainingDate, setTrainingDate] = useState("");
    const [trainingPlace, setTrainingPlace] = useState("");
    const [trainingDetails, setTrainingDetails] = useState("");

    useEffect(() => {
    if (training) {
        if (training.trainingDate) {
            const date = new Date(training.trainingDate);
            const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            setTrainingDate(local);
        } else {
            setTrainingDate("");
        }
        setTrainingPlace(training.trainingPlace || "");
        setTrainingDetails(training.trainingDetails || "");
    }
}, [training]);

    return (
        <>
            {/* Formularz dodawania i edycji treningu */}
            <div>
                <label>Data i godzina: </label>
                <input
                    type="datetime-local"
                    name="trainingDate"
                    required
                    value={trainingDate}
                    onChange={e => setTrainingDate(e.target.value)}
                />
            </div>
            <div>
                <label>Miejsce: </label>
                <input
                    type="text"
                    name="trainingPlace"
                    placeholder="Podaj miejsce treningu"
                    required
                    value={trainingPlace}
                    onChange={e => setTrainingPlace(e.target.value)}
                />
            </div>
            <div>
                <label>Szczegóły: </label>
                <textarea
                    name="trainingDetails"
                    rows="3"
                    // required
                    value={trainingDetails}
                    onChange={e => setTrainingDetails(e.target.value)}
                ></textarea>
            </div>
        </>
    );
}
