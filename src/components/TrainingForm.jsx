import React, { useState, useEffect } from "react";

export default function TrainingForm({ training }) {
    const [trainingDate, setTrainingDate] = useState("");
    const [trainingPlace, setTrainingPlace] = useState("");
    const [trainingDetails, setTrainingDetails] = useState("");
    const [maxNoEquipment, setMaxNoEquipment] = useState("12"); //14.11.26 update 1.1

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
        setMaxNoEquipment(training.maxNoEquipment ?? ""); //14.11.26 update 1.1
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
            <div>
                <label>Limit osób bez sprzętu (puste = bez limitu): </label>
                <input
                    type="number"
                    name="maxNoEquipment"
                    min="0"
                    step="1"
                    value={maxNoEquipment}
                    onChange={e => setMaxNoEquipment(e.target.value)}
                />
            </div>
        </>
    );
}
