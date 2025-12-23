import React, { useState, useEffect } from "react";
import TrainingForm from "../components/TrainingForm";
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function TrainingsPanel() {
    const [trainings, setTrainings] = useState([]);
    const [showForm, setForm] = useState(false);
    const [editTraining, setEditTraining] = useState(null);
    const [filter, setFilter] = useState('new');
    const [sortBy, setSortBy] = useState('trainingDate');
    const [order, setOrder] = useState('ASC');
    const [participants, setParticipants] = useState([]);
    const [userTrainingFilter, setUserTrainingFilter] = useState("all");
    const [activeTrainingID, setActiveTrainingID] = useState(null);
    const [loading, setLoading] = useState(false);

    const rank = localStorage.getItem("rankID");
    const userID = localStorage.getItem("userID");

    // Wybór kolumn do sortowania
    const sortColumnsMap = {
        trainingPlace: "trainingPlace",
        trainingDate: "trainingDate",
        trainingDetails: "trainingDetails"
    };

    // Wyświetlanie tabeli z treningami
    const showTrainings = async () => {
        const sortColumn = sortColumnsMap[sortBy] || "trainingDate";
        const orderValue = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

        let newTrainings = "false";
        let trainingDescription = "false";
        let withoutDescription = "false";
        const userFilter = userTrainingFilter === "userTrainings" ? userID : "all";

        switch (filter) {
            case "new":
                newTrainings = "true";
                break;
            case "withDescription":
                trainingDescription = "true";
                break;
            case "newWithDescription":
                newTrainings = "true";
                trainingDescription = "true";
                break;
            case "newWithoutDescription":
                newTrainings = "true";
                withoutDescription = "true";
                break;
            default:
                break;
        }

        const params = new URLSearchParams({
            newTrainings,
            trainingDescription,
            withoutDescription,
            tempSort: sortColumn,
            order: orderValue,
            user: userFilter
        });

        try {
            setLoading(true);
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI(`/trainings/AllTrainings?${params.toString()}`, {
                method: 'GET'
            });
            setTrainings(data);
            setLoading(false);
        } catch (err) {
            console.error("❌ Błąd podczas pobierania treningów:", err);
            alert("Nie udało się pobrać listy treningów.");
            setLoading(false);
        }
    };

    // Wyświetlanie uczestników danego treningu
    const showParticipants = async (trainingID) => {
        if (activeTrainingID === trainingID) {
            setActiveTrainingID(null);
            setParticipants([]);
            return;
        }

        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI(`/trainings/showAllTrainingParticipants/${trainingID}`, {
                method: 'GET'
            });
            setParticipants(data.data || data);
            setActiveTrainingID(trainingID);
        } catch (err) {
            console.error("❌ Błąd podczas pobierania uczestników treningu:", err);
            alert("Błąd podczas pobierania uczestników treningu.");
        }
    };

    // Wyświetlanie treningów
    useEffect(() => {
        showTrainings();
    }, [filter, sortBy, order, userTrainingFilter]);

    // Warunki jakie musi spełniać tworzony/edytowany trening
    const checkParams = (d, t) => {
        if (new Date(d) < new Date()) {
            alert("Data treningu nie może być z przeszłości!");
            return false;
        }
        if (!t || t.trim() === "") {
            alert("Trening musi się gdzieś odbyć");
            return false;
        }
        return true;
    };

    // Usuwanie treningu
    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć trening? Operacja jest nieodwracalna")) return;
        
        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI(`/trainings/deleteTraining/${id}`, {
                method: 'DELETE'
            });
            
            if (data.success) {
                alert("Trening został usunięty");
                setTrainings(p => p.filter(t => t.trainingID !== id));
            }
        } catch (err) {
            console.error("❌ Błąd przy usuwaniu treningu:", err);
            alert(err.message || "Błąd podczas usuwania treningu");
        }
    };

    // Dodawanie treningu
    const handleAdd = async (e) => {
        e.preventDefault();
        const { trainingDate, trainingPlace, trainingDetails } = e.target;
        if (!checkParams(trainingDate.value, trainingPlace.value)) return;

        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI('/trainings/addTraining', {
                method: 'POST',
                body: JSON.stringify({
                    date: trainingDate.value,
                    place: trainingPlace.value,
                    details: trainingDetails.value
                })
            });

            if (data.success) {
                alert("Dodano trening");
                showTrainings();
                e.target.reset();
                setForm(false);
            }
        } catch (err) {
            console.error("❌ Błąd przy dodawaniu treningu:", err);
            alert(err.message || "Błąd podczas dodawania treningu");
        }
    };

    // Edytowanie treningu
    const handleUpdate = async (e) => {
        e.preventDefault();
        const { trainingDate, trainingPlace, trainingDetails } = e.target;
        if (!checkParams(trainingDate.value, trainingPlace.value)) return;

        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI('/trainings/modifyTraining', {
                method: 'PUT',
                body: JSON.stringify({
                    id: editTraining.trainingID,
                    date: trainingDate.value,
                    place: trainingPlace.value,
                    details: trainingDetails.value
                })
            });

            if (data.success) {
                alert("Zaktualizowano szczegóły treningu");
                showTrainings();
                setEditTraining(null);
            }
        } catch (err) {
            console.error("❌ Błąd przy modyfikacji treningu:", err);
            alert(err.message || "Nie udało się zmodyfikować treningu");
        }
    };

    // Zapisywanie się na trening
    const handleSign = async (trainingID) => {
        if (!userID) {
            alert("Brak ID użytkownika — zaloguj się ponownie.");
            return;
        }

        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI('/trainings/addUserToTraining', {
                method: 'POST',
                body: JSON.stringify({ userID, trainingID })
            });

            if (data.success) {
                alert("Zapisano na trening! ✅");
                showParticipants(trainingID);
            }
        } catch (err) {
            console.error("❌ Błąd podczas zapisywania na trening:", err);
            alert(err.message || "Nie udało się zapisać na trening");
        }
    };

    // Usuwanie z treningu
    const removeFromTraining = async (trainingID) => {
        if (!userID) {
            alert("Brak ID użytkownika — zaloguj się ponownie.");
            return;
        }
        if (!window.confirm("Czy na pewno chcesz zrezygnować z treningu?")) return;

        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI(`/trainings/removeUserFromTraining/${userID}/${trainingID}`, {
                method: 'DELETE'
            });

            if (data.success) {
                alert("Zrezygnowano z treningu");
                showParticipants(trainingID);
            }
        } catch (err) {
            console.error("❌ Błąd przy usuwaniu użytkownika z treningu:", err);
            alert(err.message || "Błąd podczas usuwania użytkownika z treningu");
        }
    };

    return (
        <div className="trainings-container">
            <h1>Treningi</h1>
            
            {/* Przyciski sortowania i filtrowania */}
            <div className="filters">
                <label>Filtruj: </label>
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">Wszystkie treningi</option>
                    <option value="new">Przyszłe treningi</option>
                    <option value="withDescription">Wszystkie treningi z opisem</option>
                    <option value="newWithDescription">Przyszłe treningi z opisem</option>
                    <option value="newWithoutDescription">Treningi bez opisu</option>
                </select>

                <label>Filtr treningów użytkownika: </label>
                <select value={userTrainingFilter} onChange={e => setUserTrainingFilter(e.target.value)}>
                    <option value="all">Wszystkie treningi</option>
                    <option value="userTrainings">Treningi na które zapisany jest użytkownik</option>
                </select>

                <label>Sortuj po: </label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="trainingDate">Data</option>
                    <option value="trainingPlace">Miejsce</option>
                    <option value="trainingDetails">Szczegóły</option>
                </select>

                <label>Kolejność: </label>
                <select value={order} onChange={e => setOrder(e.target.value)}>
                    <option value="ASC">Rosnąco</option>
                    <option value="DESC">Malejąco</option>
                </select>
            </div>

            {loading ? (
                <p>Ładowanie treningów...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Data i godzina</th>
                            <th>Miejsce</th>
                            <th>Szczegóły</th>
                            <th>Opcje</th>
                            <th>Uczestnicy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainings.map((el) => el && (
                            <tr key={el.trainingID}>
                                <td>{new Date(el.trainingDate).toLocaleString()}</td>
                                <td>{el.trainingPlace}</td>
                                <td>{el.trainingDetails}</td>
                                <td>
                                    {Number(rank) < 3 && (
                                        <>
                                            <button onClick={() => handleDelete(el.trainingID)}>Usuń trening</button>
                                            <a href="#editTraining">
                                                <button onClick={() => setEditTraining(el)}>Modyfikuj szczegóły</button>
                                            </a>
                                        </>
                                    )}
                                    <button onClick={() => handleSign(el.trainingID)}>Zapisz się</button>
                                    <button onClick={() => removeFromTraining(el.trainingID)}>Zrezygnuj</button>
                                </td>
                                <td>
                                    <button onClick={() => showParticipants(el.trainingID)}>
                                        {activeTrainingID === el.trainingID ? "Ukryj uczestników" : "Pokaż uczestników"}
                                    </button>
                                    {activeTrainingID === el.trainingID && (
                                        <ul>
                                            {participants.length === 0
                                                ? "Nikt nie zapisał się na ten trening :("
                                                : participants.map(p => (
                                                    <li key={p.userID}>{p.name} {p.surname}</li>
                                                ))}
                                        </ul>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Opcja dodawania i edytowania treningów */}
            {Number(rank) < 3 && (
                <div>
                    <h2>Dodaj nowy trening</h2>
                    <button onClick={() => setForm(prev => !prev)}>
                        {showForm ? "Anuluj dodawanie" : "Dodaj trening"}
                    </button>

                    {showForm && (
                        <form onSubmit={handleAdd}>
                            <TrainingForm />
                            <button type="submit">Dodaj trening</button>
                        </form>
                    )}

                    <div id="editTraining"></div>
                    {editTraining && (
                        <form onSubmit={handleUpdate}>
                            <h2>Edytowanie treningu</h2>
                            <button type="button" onClick={() => setEditTraining(null)}>
                                Anuluj edytowanie
                            </button>
                            <TrainingForm training={editTraining} />
                            <button type="submit">Zapisz zmiany</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}