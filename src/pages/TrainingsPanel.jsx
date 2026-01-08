import React, { useState, useEffect, useRef } from "react";
import TrainingForm from "../components/TrainingForm";
import { fetchAPI } from "../config/api";
import {
    FaCheck, FaTimes, FaEdit, FaTrash, FaPlus,
    FaCog, FaUser, FaCalendarAlt,
    FaSyncAlt, FaSortAmountUp, FaClock,
    FaMapMarkerAlt, FaStickyNote, FaIdCard,
    FaTable, FaChevronDown, FaChevronRight 
} from 'react-icons/fa';

export default function TrainingsPanel() {
    const editFormRef = useRef(null)
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
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

    const rank = localStorage.getItem("rankID");
    const userID = localStorage.getItem("userID");
    const isAdmin = Number(rank) < 3;

    const sortColumnsMap = {
        trainingPlace: "trainingPlace",
        trainingDate: "trainingDate",
        trainingDetails: "trainingDetails"
    };

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
            const { data } = await fetchAPI(`/trainings/AllTrainings?${params.toString()}`, {
                method: 'GET'
            });
            setTrainings(data);
            setLoading(false);
        } catch (err) {
            console.error("Błąd podczas pobierania treningów:", err);
            alert("Nie udało się pobrać listy treningów.");
            setLoading(false);
        }
    };

    const handleEditClick = (training) => {
        setEditTraining(training);
        setTimeout(() => {
            editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    const showParticipants = async (trainingID) => {
        if (activeTrainingID === trainingID) {
            setActiveTrainingID(null);
            setParticipants([]);
            return;
        }

        try {
            const { data } = await fetchAPI(`/trainings/showAllTrainingParticipants/${trainingID}`, {
                method: 'GET'
            });
            setParticipants(data.data || data);
            setActiveTrainingID(trainingID);
        } catch (err) {
            console.error("Błąd podczas pobierania uczestników treningu:", err);
            alert("Błąd podczas pobierania uczestników treningu.");
        }
    };

    useEffect(() => {
        showTrainings();
    }, [filter, sortBy, order, userTrainingFilter]);

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

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć trening? Operacja jest nieodwracalna")) return;

        try {
            const { data } = await fetchAPI(`/trainings/deleteTraining/${id}`, {
                method: 'DELETE'
            });

            if (data.success) {
                alert("Trening został usunięty");
                setTrainings(p => p.filter(t => t.trainingID !== id));
            }
        } catch (err) {
            console.error("Błąd przy usuwaniu treningu:", err);
            alert(err.message || "Błąd podczas usuwania treningu");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const { trainingDate, trainingPlace, trainingDetails } = e.target;
        if (!checkParams(trainingDate.value, trainingPlace.value)) return;

        try {
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
            console.error("Błąd przy dodawaniu treningu:", err);
            alert(err.message || "Błąd podczas dodawania treningu");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { trainingDate, trainingPlace, trainingDetails } = e.target;
        if (!checkParams(trainingDate.value, trainingPlace.value)) return;

        try {
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
            console.error("Błąd przy modyfikacji treningu:", err);
            alert(err.message || "Nie udało się zmodyfikować treningu");
        }
    };

    const handleSign = async (trainingID) => {
        if (!userID) {
            alert("Brak ID użytkownika — zaloguj się ponownie.");
            return;
        }

        try {
            const { data } = await fetchAPI('/trainings/addUserToTraining', {
                method: 'POST',
                body: JSON.stringify({ userID, trainingID })
            });

            if (data.success) {
                alert(data.message);
                showParticipants(trainingID);
            }
        } catch (err) {
            console.error("Błąd podczas zapisywania na trening:", err);
            alert(err.message || "Nie udało się zapisać na trening");
        }
    };

    const removeFromTraining = async (trainingID) => {
        if (!userID) {
            alert("Brak ID użytkownika — zaloguj się ponownie.");
            return;
        }
        if (!window.confirm("Czy na pewno chcesz zrezygnować z treningu?")) return;

        try {
            const { data } = await fetchAPI(`/trainings/removeUserFromTraining/${userID}/${trainingID}`, {
                method: 'DELETE'
            });

            if (data.success) {
                alert("Zrezygnowano z treningu");
                showParticipants(trainingID);
            }
        } catch (err) {
            console.error("Błąd przy usuwaniu użytkownika z treningu:", err);
            alert(err.message || "Błąd podczas usuwania użytkownika z treningu");
        }
    };

    const isTrainingPast = (trainingDate) => {
        return new Date(trainingDate) < new Date();
    };

    return (
        <>
            <style>{`
                /* KONTENER GŁÓWNY */
                .trainings-panel-container {
                    max-width: 1400px;
                    margin: 40px auto;
                    padding: 0 20px;
                }

                /* NAGŁÓWEK */
                .panel-header {
                    background: white;
                    padding: 30px;
                    border-radius: 16px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    margin-bottom: 30px;
                }

                .panel-header h1 {
                    font-size: 32px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .panel-header p {
                    color: #666;
                    font-size: 15px;
                }

                /* FILTRY */
                .filters-container {
                    background: white;
                    padding: 25px;
                    border-radius: 16px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    margin-bottom: 30px;
                }

                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .filter-group label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #555;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .filter-group select {
                    padding: 12px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .filter-group select:focus {
                    outline: none;
                    border-color: #667eea;
                }

                /* VIEW TOGGLE */
                .view-toggle {
                    display: flex;
                    gap: 8px;
                    margin-top: 15px;
                }

                .view-button {
                    padding: 10px 20px;
                    border: 2px solid #e0e0e0;
                    background: white;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .view-button.active {
                    background: #667eea;
                    color: white;
                    border-color: #667eea;
                }

                .view-button:hover:not(.active) {
                    background: #f5f5f5;
                }

                /* KARTY TRENINGÓW */
                .trainings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .training-card {
                    background: white;
                    border-radius: 16px;
                    padding: 25px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    position: relative;
                    border: 2px solid transparent;
                }

                .training-card:hover {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                    transform: translateY(-4px);
                }

                .training-card.past {
                    opacity: 0.6;
                    border-color: #f0f0f0;
                }

                .training-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: 15px;
                }

                .training-date {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                }

                .training-badge {
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .training-badge.upcoming {
                    background: #e3f2fd;
                    color: #1976d2;
                }

                .training-badge.past {
                    background: #f5f5f5;
                    color: #999;
                }

                .training-info {
                    margin-bottom: 15px;
                }

                .training-info-item {
                    display: flex;
                    align-items: start;
                    gap: 10px;
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: #555;
                }

                .training-info-item strong {
                    color: #333;
                }

                .training-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #f0f0f0;
                }

                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-primary {
                    background: #667eea;
                    color: white;
                }

                .btn-primary:hover {
                    background: #764ba2;
                }

                .btn-danger {
                    background: #f44336;
                    color: white;
                }

                .btn-danger:hover {
                    background: #d32f2f;
                }

                .btn-secondary {
                    background: white;
                    color: #666;
                    border: 2px solid #e0e0e0;
                }

                .btn-secondary:hover {
                    background: #f5f5f5;
                }

                .btn-success {
                    background: #4caf50;
                    color: white;
                }

                .btn-success:hover {
                    background: #45a049;
                }

                /* PARTICIPANTS */
                .participants-section {
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #f0f0f0;
                }

                .participants-list {
                    list-style: none;
                    padding: 0;
                    margin: 10px 0 0 0;
                }

                .participants-list li {
                    padding: 8px 12px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    margin-bottom: 6px;
                    font-size: 14px;
                }

                .participants-empty {
                    color: #999;
                    font-style: italic;
                    font-size: 14px;
                    text-align: center;
                    padding: 15px;
                }

                /* ADMIN SECTION */
                .admin-section {
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    margin-top: 30px;
                }

                .admin-section h2 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .form-container {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 12px;
                    margin-top: 20px;
                }

                /* LOADING */
                .loading-container {
                    text-align: center;
                    padding: 60px 20px;
                }

                .loading-spinner {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #999;
                }

                .empty-state-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                }

                /* RESPONSIVE */
                @media (max-width: 768px) {
                    .trainings-grid {
                        grid-template-columns: 1fr;
                    }

                    .filters-grid {
                        grid-template-columns: 1fr;
                    }

                    .panel-header h1 {
                        font-size: 24px;
                    }
                }
            `}</style>

            <div className="trainings-panel-container">
                <div className="panel-header">
                    <h1>
                        <span>🥋</span>
                        Panel Treningów
                    </h1>
                    <p>Zarządzaj treningami, zapisuj się i sprawdzaj uczestników</p>
                </div>

                <div className="filters-container">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label><FaCalendarAlt style={{ marginRight: '5px' }} /> Filtruj treningi</label>
                            <select value={filter} onChange={e => setFilter(e.target.value)}>
                                <option value="all">Wszystkie treningi</option>
                                <option value="new">Przyszłe treningi</option>
                                <option value="withDescription">Z opisem</option>
                                <option value="newWithDescription">Przyszłe z opisem</option>
                                <option value="newWithoutDescription">Bez opisu</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label><FaUser style={{ marginRight: '5px' }} />  Moje treningi</label>
                            <select value={userTrainingFilter} onChange={e => setUserTrainingFilter(e.target.value)}>
                                <option value="all">Wszystkie treningi</option>
                                <option value="userTrainings">Tylko moje zapisy</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label><FaSyncAlt style={{ marginRight: '5px' }} /> Sortuj po</label>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="trainingDate">Data</option>
                                <option value="trainingPlace">Miejsce</option>
                                <option value="trainingDetails">Szczegóły</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label><FaSortAmountUp style={{ marginRight: '5px' }} /> Kolejność</label>
                            <select value={order} onChange={e => setOrder(e.target.value)}>
                                <option value="ASC">Rosnąco</option>
                                <option value="DESC">Malejąco</option>
                            </select>
                        </div>
                    </div>

                    <div className="view-toggle">
                        <button
                            className={`view-button ${viewMode === 'cards' ? 'active' : ''}`}
                            onClick={() => setViewMode('cards')}
                        >
                            <FaIdCard style={{ marginRight: '5px' }} />  Karty
                        </button>
                        <button
                            className={`view-button ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <FaTable style={{ marginRight: '5px' }} /> Tabela
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p style={{ marginTop: '20px', color: '#666' }}>Ładowanie treningów...</p>
                    </div>
                ) : trainings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <h3>Brak treningów</h3>
                        <p>Nie znaleziono treningów spełniających kryteria</p>
                    </div>
                ) : viewMode === 'cards' ? (
                    <div className="trainings-grid">
                        {trainings.map((el) => el && (
                            <div key={el.trainingID} className={`training-card ${isTrainingPast(el.trainingDate) ? 'past' : ''}`}>
                                <div className="training-header">
                                    <div className="training-date">
                                        <FaCalendarAlt style={{ marginRight: '5px' }} />  {new Date(el.trainingDate).toLocaleDateString('pl-PL')}
                                        <div style={{ fontSize: '14px', fontWeight: '400', color: '#666', marginTop: '4px' }}>
                                            <FaClock style={{ marginRight: '5px' }} />  {new Date(el.trainingDate).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <span className={`training-badge ${isTrainingPast(el.trainingDate) ? 'past' : 'upcoming'}`}>
                                        {isTrainingPast(el.trainingDate) ? 'Zakończony' : 'Nadchodzący'}
                                    </span>
                                </div>

                                <div className="training-info">
                                    <div className="training-info-item">
                                        <span><FaMapMarkerAlt style={{ marginRight: '5px' }} /></span>
                                        <div>
                                            <strong>Miejsce:</strong> {el.trainingPlace}
                                        </div>
                                    </div>
                                    {el.trainingDetails && (
                                        <div className="training-info-item">
                                            <span><FaStickyNote style={{ marginRight: '4px' }} /></span>
                                            <div>
                                                <strong>Szczegóły:</strong> {el.trainingDetails}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="training-actions">
                                    <button className="btn btn-success" onClick={() => handleSign(el.trainingID)}>
                                        <FaCheck style={{ marginRight: '5px' }} /> Zapisz się
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => removeFromTraining(el.trainingID)}>
                                        <FaTimes style={{ marginRight: '5px' }} /> Zrezygnuj
                                    </button>
                                    {isAdmin && (
                                        <>
                                            <button className="btn btn-primary" onClick={() => handleEditClick(el)}>
                                                <FaEdit style={{ marginRight: '5px' }} /> Edytuj
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(el.trainingID)}>
                                                <FaTrash style={{ marginRight: '5px' }} /> Usuń
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="participants-section">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => showParticipants(el.trainingID)}
                                        style={{ width: '100%' }}
                                    >
                                        {activeTrainingID === el.trainingID
                                            ? <><FaChevronDown style={{ marginRight: '5px' }} /> Ukryj uczestników</>
                                            : <><FaChevronRight style={{ marginRight: '5px' }} /> Pokaż uczestników</>
                                        }
                                    </button>
                                    {activeTrainingID === el.trainingID && (
                                        participants.length === 0 ? (
                                            <div className="participants-empty">
                                                Nikt nie zapisał się na ten trening
                                            </div>
                                        ) : (
                                            <ul className="participants-list">
                                                {participants.map(p => (
                                                    <li key={p.userID}>
                                                        <FaUser style={{ marginRight: '5px' }} /> {p.name} {p.surname}
                                                    </li>
                                                ))}
                                            </ul>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        Widok tabeli - do zaimplementowania (opcjonalnie)
                    </p>
                )}

                {isAdmin && (
                    <div className="admin-section" id="editTraining">
                        <h2>
                            <span><FaCog /></span>
                            Panel Administratora
                        </h2>

                        <button
                            className="btn btn-primary"
                            onClick={() => setForm(prev => !prev)}
                            style={{ marginBottom: '20px' }}
                        >
                            {showForm ? <FaTimes style={{ marginRight: '5px' }} /> : <FaPlus style={{ marginRight: '5px' }} />}{showForm ? 'Anuluj dodawanie' : 'Dodaj nowy trening'}

                        </button>

                        {showForm && (
                            <div className="form-container">
                                <h3 style={{ marginBottom: '20px' }}>Dodaj nowy trening</h3>
                                <form onSubmit={handleAdd}>
                                    <TrainingForm />
                                    <button type="submit" className="btn btn-success" style={{ marginTop: '15px' }}>
                                        <FaCheck style={{ marginRight: '5px' }} /> Dodaj trening
                                    </button>
                                </form>
                            </div>
                        )}

                        {editTraining && (
                            <div className="form-container" ref={editFormRef}>
                                <h3 style={{ marginBottom: '20px' }}>Edytowanie treningu</h3>
                                <form onSubmit={handleUpdate}>
                                    <TrainingForm training={editTraining} />
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '15px', marginRight: '10px' }}>
                                        <FaCheck style={{ marginRight: '5px' }} /> Zapisz zmiany
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setEditTraining(null)}
                                    >
                                        <FaTimes style={{ marginRight: '5px' }} /> Anuluj
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}