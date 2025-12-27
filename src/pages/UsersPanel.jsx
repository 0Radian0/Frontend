import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api";

export default function UsersPanel() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('regDate');
    const [order, setOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');
    const [changingRanksUserID, setchangingRanksUserID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

    const sortColumnsMap = {
        regDate: "registrationDate",
        descp: "description",
        lastLog: "lastLog",
        deactivated: "deactivated",
        payStatus: "paymentActive",
        sumToPay: "sumToPay"
    };

    const rankNames = {
        1: "Administrator",
        2: "Trener",
        3: "Użytkownik"
    };

    const fetchUsers = async () => {
        const sortColumn = sortColumnsMap[sortBy] || "registrationDate";
        const orderValue = order === "asc" ? "ASC" : "DESC";

        let status = "all";
        switch (statusFilter) {
            case "paymentActive": status = "payActive"; break;
            case "paymentUnactive": status = "payUnactive"; break;
            case "active": status = "active"; break;
            case "deactivated": status = "deactivated"; break;
            case "lackOfPayment": status = "lackOfPayment"; break;
            default: status = "all";
        }

        let params = new URLSearchParams({
            rank: filter === 'all' ? 'all' : (filter === 'admin' ? 1 : (filter === 'trainers' ? 2 : 3)),
            statusFilter: status,
            tempSort: sortColumn,
            order: orderValue,
        });

        try {
            setLoading(true);
            const { data } = await fetchAPI(`/auth/users?${params.toString()}`, { method: 'GET' });
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error("❌ Błąd pobierania użytkowników:", err);
            alert("Nie udało się pobrać listy użytkowników");
            setLoading(false);
        }
    };

    const isPaidThisMonth = (user) => {
        if (!user.amount || !user.paymentDate || !user.dueDate) return false;
        const payment = new Date(user.paymentDate);
        const due = new Date(user.dueDate);
        return (payment.getMonth() === due.getMonth() && payment.getFullYear() === due.getFullYear());
    };

    const handleDelete = async (userID) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika? Operacja jest nieodwracalna i spowoduje usunięcie wszystkich powiązanych danych.")) return;
        
        try {
            const { data } = await fetchAPI(`/auth/users/${userID}`, { method: 'DELETE' });
            if (data.success) {
                alert("Użytkownik został usunięty");
                setUsers(prev => prev.filter(u => u.userID !== userID));
            }
        } catch (err) {
            console.error("❌ Błąd przy usuwaniu użytkownika:", err);
            alert(err.message || "Błąd serwera. Usuwanie użytkownika nie powiodło się");
            fetchUsers();
        }
    };

    const handleChangeRanks = async (rankID, userID) => {
        if (!window.confirm("Czy na pewno chcesz zmienić uprawnienia użytkownika?")) return;
        
        try {
            const { data } = await fetchAPI('/auth/users/rank', {
                method: 'POST',
                body: JSON.stringify({ userID, rankID })
            });

            if (data.success) {
                alert(data.message || "Zmieniono uprawnienia użytkownika");
                fetchUsers();
                setchangingRanksUserID(null);
            }
        } catch (err) {
            console.error("❌ Błąd przy zmianie uprawnień:", err);
            alert(err.message || "Błąd serwera. Nie udało się zmienić uprawnień");
        }
    };

    const handleResetPassword = async (userID) => {
        if (!window.confirm("Czy na pewno chcesz zresetować hasło tego użytkownika? Nowe hasło zostanie wysłane na jego e-mail.")) return;

        try {
            const { data } = await fetchAPI('/auth/users/reset-password', {
                method: 'POST',
                body: JSON.stringify({ userID })
            });

            if (data.success) {
                alert(data.message || "Hasło zostało zresetowane i wysłane na email");
            }
        } catch (err) {
            console.error("❌ Błąd przy resecie hasła:", err);
            alert(err.message || "Błąd serwera. Nie udało się zresetować hasła");
        }
    };

    const handleDeactivate = async (userID, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;

        if (!window.confirm(`Czy na pewno chcesz ${newStatus === 1 ? "zablokować" : "odblokować"} użytkownika?`)) return;

        try {
            const { data } = await fetchAPI('/auth/users/deactivateUser', {
                method: 'POST',
                body: JSON.stringify({
                    userID: Number(userID),
                    deactivatedStatus: newStatus
                })
            });

            alert(data.message || `Użytkownik został ${newStatus === 1 ? "zablokowany" : "odblokowany"}`);
            fetchUsers();
        } catch (err) {
            console.error("❌ Błąd przy zmianie statusu użytkownika:", err);
            alert(err.message || "Błąd serwera. Nie udało się zmienić statusu użytkownika");
        }
    };

    const handleChangePaymentStatus = async (userID, paymentStatus) => {
        const newStatus = paymentStatus === 1 ? 0 : 1;

        if (!window.confirm(`Czy na pewno chcesz ${newStatus === 1 ? "wyłączyć z płatności" : "włączyć do opłat"} użytkownika?`)) return;

        try {
            const { data } = await fetchAPI('/auth/users/changePaymentStatus', {
                method: 'POST',
                body: JSON.stringify({
                    userID: Number(userID),
                    paymentActive: newStatus
                })
            });

            alert(data.message || `Użytkownik został ${newStatus === 1 ? "wyłączony z płatności" : "włączony do opłat"}`);
            fetchUsers();
        } catch (err) {
            console.error("❌ Błąd przy zmianie statusu płatności:", err);
            alert(err.message || "Błąd serwera. Nie udało się zmienić statusu płatności");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filter, statusFilter, sortBy, order]);

    return (
        <>
            <style>{`
                /* ============================================
                   TUTAJ BĘDĄ STYLE W NASTĘPNEJ WIADOMOŚCI
                   ============================================ */
            `}</style>

            <div className="users-panel-container">
                {/* HEADER */}
                <div className="panel-header">
                    <h1><span>👥</span> Panel Użytkowników</h1>
                    <p>Zarządzaj użytkownikami, uprawnieniami i płatnościami</p>
                </div>

                {/* STATS OVERVIEW */}
                <div className="stats-overview">
                    <div className="stat-card">
                        <div className="stat-icon">👤</div>
                        <div className="stat-info">
                            <div className="stat-value">{users.length}</div>
                            <div className="stat-label">Użytkowników</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <div className="stat-value">{users.filter(u => u.deactivated === 0).length}</div>
                            <div className="stat-label">Aktywnych</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💳</div>
                        <div className="stat-info">
                            <div className="stat-value">{users.filter(u => u.paymentActive === 1).length}</div>
                            <div className="stat-label">Z płatnościami</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-info">
                            <div className="stat-value">{users.filter(u => u.sumToPay > 0).length}</div>
                            <div className="stat-label">Do zapłaty</div>
                        </div>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="filters-container">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>👔 Uprawnienia</label>
                            <select value={filter} onChange={e => setFilter(e.target.value)}>
                                <option value="all">Wszystkie</option>
                                <option value="admin">Administratorzy</option>
                                <option value="trainers">Trenerzy</option>
                                <option value="users">Użytkownicy</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>🔍 Status</label>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="all">Wszyscy</option>
                                <option value="active">Aktywni</option>
                                <option value="deactivated">Zablokowani</option>
                                <option value="paymentActive">Z płatnościami</option>
                                <option value="paymentUnactive">Bez płatności</option>
                                <option value="lackOfPayment">Zaległości</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>🔄 Sortuj po</label>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="regDate">Data rejestracji</option>
                                <option value="lastLog">Ostatnie logowanie</option>
                                <option value="sumToPay">Kwota do zapłaty</option>
                                <option value="deactivated">Status</option>
                                <option value="payStatus">Płatności</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>⬆️ Kolejność</label>
                            <select value={order} onChange={e => setOrder(e.target.value)}>
                                <option value="asc">Rosnąco</option>
                                <option value="desc">Malejąco</option>
                            </select>
                        </div>
                    </div>

                    <div className="view-toggle">
                        <button 
                            className={`view-button ${viewMode === 'cards' ? 'active' : ''}`}
                            onClick={() => setViewMode('cards')}
                        >
                            📇 Karty
                        </button>
                        <button 
                            className={`view-button ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            📊 Tabela
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p style={{marginTop: '20px', color: '#666'}}>Ładowanie użytkowników...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <h3>Brak użytkowników</h3>
                        <p>Nie znaleziono użytkowników spełniających kryteria</p>
                    </div>
                ) : viewMode === 'cards' ? (
                    <div className="users-grid">
                        {users.map(user => (
                            <div key={user.userID} className={`user-card ${user.deactivated === 1 ? 'deactivated' : ''}`}>
                                <div className="user-card-header">
                                    <div className="user-info">
                                        <div className="user-name">{user.name} {user.surname}</div>
                                        <div className="user-role">{rankNames[user.rankID]}</div>
                                    </div>
                                    <div className={`user-status-badge ${user.deactivated === 1 ? 'blocked' : 'active'}`}>
                                        {user.deactivated === 1 ? '🔒 Zablokowany' : '✅ Aktywny'}
                                    </div>
                                </div>

                                <div className="user-details">
                                    <div className="detail-item">
                                        <span className="detail-icon">📅</span>
                                        <div>
                                            <div className="detail-label">Rejestracja</div>
                                            <div className="detail-value">{new Date(user.registrationDate).toLocaleDateString('pl-PL')}</div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-icon">🕐</span>
                                        <div>
                                            <div className="detail-label">Ostatnie logowanie</div>
                                            <div className="detail-value">{user.lastLog ? new Date(user.lastLog).toLocaleDateString('pl-PL') : 'Brak danych'}</div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-icon">💰</span>
                                        <div>
                                            <div className="detail-label">Do zapłaty</div>
                                            <div className={`detail-value ${user.sumToPay > 0 ? 'debt' : 'paid'}`}>
                                                {user.sumToPay > 0 ? `${user.sumToPay} zł` : 'Opłacone'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-icon">💳</span>
                                        <div>
                                            <div className="detail-label">Status płatności</div>
                                            <div className="detail-value">
                                                {user.paymentActive === 1 ? '✅ Aktywny' : '❌ Nieaktywny'}
                                            </div>
                                        </div>
                                    </div>

                                    {user.description && (
                                        <div className="user-description">
                                            <div className="detail-label">📝 Opis:</div>
                                            <div className="description-text">{user.description}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="user-actions">
                                    {changingRanksUserID === user.userID ? (
                                        <div className="rank-selector">
                                            <select
                                                value={user.rankID}
                                                onChange={e => handleChangeRanks(Number(e.target.value), user.userID)}
                                                onBlur={() => setchangingRanksUserID(null)}
                                                autoFocus
                                            >
                                                <option value={1}>Administrator</option>
                                                <option value={2}>Trener</option>
                                                <option value={3}>Użytkownik</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <>
                                            <button className="btn btn-sm btn-secondary" onClick={() => setchangingRanksUserID(user.userID)}>
                                                👔 Uprawnienia
                                            </button>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleResetPassword(user.userID)}>
                                                🔑 Reset hasła
                                            </button>
                                            <button 
                                                className={`btn btn-sm ${user.deactivated === 1 ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => handleDeactivate(user.userID, user.deactivated)}
                                            >
                                                {user.deactivated === 1 ? '✅ Odblokuj' : '🔒 Zablokuj'}
                                            </button>
                                            <button 
                                                className={`btn btn-sm ${user.paymentActive === 1 ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() => handleChangePaymentStatus(user.userID, user.paymentActive)}
                                            >
                                                {user.paymentActive === 1 ? '💳 Wyłącz płatności' : '💰 Włącz płatności'}
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.userID)}>
                                                🗑️ Usuń
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Użytkownik</th>
                                    <th>Rola</th>
                                    <th>Rejestracja</th>
                                    <th>Ostatnie log.</th>
                                    <th>Status</th>
                                    <th>Płatności</th>
                                    <th>Do zapłaty</th>
                                    <th>Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.userID} className={user.deactivated === 1 ? 'row-deactivated' : ''}>
                                        <td>
                                            <div style={{fontWeight: '600'}}>{user.name} {user.surname}</div>
                                            <div style={{fontSize: '12px', color: '#999'}}>{user.email}</div>
                                        </td>
                                        <td><span className="role-badge">{rankNames[user.rankID]}</span></td>
                                        <td>{new Date(user.registrationDate).toLocaleDateString('pl-PL')}</td>
                                        <td>{user.lastLog ? new Date(user.lastLog).toLocaleDateString('pl-PL') : '-'}</td>
                                        <td>
                                            <span className={`status-badge ${user.deactivated === 1 ? 'blocked' : 'active'}`}>
                                                {user.deactivated === 1 ? 'Zablokowany' : 'Aktywny'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`payment-badge ${user.paymentActive === 1 ? 'active' : 'inactive'}`}>
                                                {user.paymentActive === 1 ? 'Aktywne' : 'Nieaktywne'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={user.sumToPay > 0 ? 'debt-amount' : 'paid-amount'}>
                                                {user.sumToPay || 0} zł
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="btn-icon" onClick={() => setchangingRanksUserID(user.userID)} title="Uprawnienia">👔</button>
                                                <button className="btn-icon" onClick={() => handleResetPassword(user.userID)} title="Reset hasła">🔑</button>
                                                <button className="btn-icon" onClick={() => handleDeactivate(user.userID, user.deactivated)} title={user.deactivated === 1 ? 'Odblokuj' : 'Zablokuj'}>
                                                    {user.deactivated === 1 ? '✅' : '🔒'}
                                                </button>
                                                <button className="btn-icon" onClick={() => handleChangePaymentStatus(user.userID, user.paymentActive)} title="Płatności">💳</button>
                                                <button className="btn-icon btn-danger" onClick={() => handleDelete(user.userID)} title="Usuń">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}