import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api";
import {
    FaUserTie, FaSearch, FaSyncAlt, FaSortAmountUp,
    FaCalendarAlt, FaClock, FaMoneyBillWave, FaCreditCard,
    FaStickyNote, FaKey, FaLock, FaCheck, FaTrash,
    FaExclamationTriangle, FaUser, FaUsers, FaTimes,
    FaTable, FaIdCard 
} from 'react-icons/fa';


export default function UsersPanel() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('regDate');
    const [order, setOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');
    const [changingRanksUserID, setchangingRanksUserID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('cards');

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

    // 1. Funkcja odświeżająca dane - używana wszędzie
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
            console.error("Błąd pobierania użytkowników:", err);
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

    // 2. POPRAWIONE: Usuwanie użytkownika
    const handleDelete = async (userID) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika? Operacja jest nieodwracalna i spowoduje usunięcie wszystkich powiązanych danych.")) return;

        try {
            const { data } = await fetchAPI(`/auth/users/${userID}`, { method: 'DELETE' });
            if (data.success) {
                alert("Użytkownik został usunięty");
                // ← ZMIANA: Zamiast lokalnego filtrowania, odśwież z serwera
                await fetchUsers();
                
                // ← DODANE: Jeśli usunięty użytkownik miał otwarte uprawnienia, zamknij
                if (changingRanksUserID === userID) {
                    setchangingRanksUserID(null);
                }
            }
        } catch (err) {
            console.error("Błąd przy usuwaniu użytkownika:", err);
            alert(err.message || "Błąd serwera. Usuwanie użytkownika nie powiodło się");
            // ← ZMIANA: Zamiast fetchUsers() po błędzie, możesz zostawić lub usunąć
            // W oryginalnym kodzie było fetchUsers() - zostawiam dla spójności
            await fetchUsers();
        }
    };

    // 3. POPRAWIONE: Zmiana uprawnień
    const handleChangeRanks = async (rankID, userID) => {
        if (!window.confirm("Czy na pewno chcesz zmienić uprawnienia użytkownika?")) return;

        try {
            const { data } = await fetchAPI('/auth/users/rank', {
                method: 'POST',
                body: JSON.stringify({ userID, rankID })
            });

            if (data.success) {
                alert(data.message || "Zmieniono uprawnienia użytkownika");
                // ← ZMIANA: Odśwież dane z aktywnym filtrem
                await fetchUsers();
                setchangingRanksUserID(null);
                
                // ← WYJAŚNIENIE: Po zmianie rangi użytkownik może zniknąć z listy
                // jeśli mamy aktywny filtr np. "tylko administratorzy"
                // fetchUsers() zapewni że lista będzie zgodna z filtrem
            }
        } catch (err) {
            console.error("Błąd przy zmianie uprawnień:", err);
            alert(err.message || "Błąd serwera. Nie udało się zmienić uprawnień");
        }
    };

    // 4. Reset hasła - bez zmian (nie wpływa na listę)
    const handleResetPassword = async (userID) => {
        if (!window.confirm("Czy na pewno chcesz zresetować hasło tego użytkownika? Nowe hasło zostanie wysłane na jego e-mail.")) return;

        try {
            const { data } = await fetchAPI('/auth/users/reset-password', {
                method: 'POST',
                body: JSON.stringify({ userID })
            });

            if (data.success) {
                alert(data.message || "Hasło zostało zresetowane i wysłane na email");
                // ← BRAK fetchUsers() - reset hasła nie zmienia danych wyświetlanych w liście
            }
        } catch (err) {
            console.error("Błąd przy resecie hasła:", err);
            alert(err.message || "Błąd serwera. Nie udało się zresetować hasła");
        }
    };

    // 5. POPRAWIONE: Blokowanie/odblokowanie użytkownika
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
            // ← ZMIANA: Odśwież dane z serwera
            await fetchUsers();
            
            // ← WYJAŚNIENIE: Po zablokowaniu użytkownika może on zniknąć z listy
            // jeśli mamy aktywny filtr "aktywni" lub "zablokowani"
            // fetchUsers() zapewni że lista będzie zgodna z filtrem
        } catch (err) {
            console.error("Błąd przy zmianie statusu użytkownika:", err);
            alert(err.message || "Błąd serwera. Nie udało się zmienić statusu użytkownika");
        }
    };

    // 6. POPRAWIONE: Zmiana statusu płatności
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
            // ← ZMIANA: Odśwież dane z serwera
            await fetchUsers();
            
            // ← WYJAŚNIENIE: Po zmianie statusu płatności użytkownik może zniknąć z listy
            // jeśli mamy aktywny filtr "z płatnościami" lub "bez płatności"
            // fetchUsers() zapewni że lista będzie zgodna z filtrem
        } catch (err) {
            console.error("Błąd przy zmianie statusu płatności:", err);
            alert(err.message || "Błąd serwera. Nie udało się zmienić statusu płatności");
        }
    };

    // 7. useEffect - automatyczne odświeżanie przy zmianie filtrów
    useEffect(() => {
        fetchUsers();
    }, [filter, statusFilter, sortBy, order]);

    return (
        <>
            <style>{`
                /* 
   MAIN CONTAINER
    */
.users-panel-container {
    max-width: 1600px;
    margin: 40px auto;
    padding: 0 20px;
}

/* 
   HEADER
    */
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

/* 
   STATS OVERVIEW
    */
.stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
    font-size: 36px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
}

.stat-info {
    flex: 1;
}

.stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    line-height: 1;
}

.stat-label {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
}

/* 
   FILTERS
    */
.filters-container {
    background: white;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
}

.filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
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
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 
   VIEW TOGGLE
    */
.view-toggle {
    display: flex;
    gap: 8px;
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

/* 
   USERS GRID (CARDS VIEW)
    */
.users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
}

.user-card {
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.user-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
}

.user-card.deactivated {
    opacity: 0.7;
    border-color: #f44336;
    background: #fff5f5;
}

.user-card-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
}

.user-info {
    flex: 1;
}

.user-name {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
}

.user-role {
    font-size: 13px;
    color: #667eea;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.user-status-badge {
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}

.user-status-badge.active {
    background: #d4edda;
    color: #155724;
}

.user-status-badge.blocked {
    background: #f8d7da;
    color: #721c24;
}

/* 
   USER DETAILS
    */
.user-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.detail-item {
    display: flex;
    align-items: start;
    gap: 12px;
}

.detail-icon {
    font-size: 20px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border-radius: 8px;
    flex-shrink: 0;
}

.detail-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 2px;
}

.detail-value {
    font-size: 14px;
    color: #333;
    font-weight: 600;
}

.detail-value.debt {
    color: #f44336;
}

.detail-value.paid {
    color: #4caf50;
}

.user-description {
    margin-top: 10px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.description-text {
    font-size: 13px;
    color: #555;
    line-height: 1.6;
    margin-top: 8px;
}

/* 
   USER ACTIONS
    */
.user-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 15px;
    border-top: 2px solid #f0f0f0;
}

.rank-selector select {
    width: 100%;
    padding: 10px;
    border: 2px solid #667eea;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
}

/* 
   BUTTONS
    */
.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-sm {
    padding: 6px 12px;
    font-size: 12px;
}

.btn-primary {
    background: #667eea;
    color: white;
}

.btn-primary:hover {
    background: #764ba2;
}

.btn-success {
    background: #4caf50;
    color: white;
}

.btn-success:hover {
    background: #45a049;
}

.btn-warning {
    background: #ff9800;
    color: white;
}

.btn-warning:hover {
    background: #f57c00;
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
    border: 2px solid #e0e0e0;
    color: #666;
}

.btn-secondary:hover {
    background: #f5f5f5;
}

/* 
   TABLE VIEW
    */
.table-container {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow-x: auto;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table th {
    background: #f8f9fa;
    padding: 15px;
    text-align: left;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid #e0e0e0;
    white-space: nowrap;
    font-size: 13px;
}

.users-table td {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
}

.users-table tr:hover {
    background: #f8f9fa;
}

.row-deactivated {
    background: #fff5f5;
    opacity: 0.7;
}

.role-badge {
    padding: 4px 10px;
    background: #e3f2fd;
    color: #1976d2;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}

.status-badge.active {
    background: #d4edda;
    color: #155724;
}

.status-badge.blocked {
    background: #f8d7da;
    color: #721c24;
}

.payment-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.payment-badge.active {
    background: #d4edda;
    color: #155724;
}

.payment-badge.inactive {
    background: #f0f0f0;
    color: #999;
}

.debt-amount {
    color: #f44336;
    font-weight: 700;
}

.paid-amount {
    color: #4caf50;
    font-weight: 700;
}

.table-actions {
    display: flex;
    gap: 6px;
}

.btn-icon {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: #f5f5f5;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-icon:hover {
    background: #e0e0e0;
}

.btn-icon.btn-danger:hover {
    background: #f44336;
}

/* 
   LOADING & EMPTY STATE
    */
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

.empty-state h3 {
    font-size: 24px;
    color: #666;
    margin-bottom: 10px;
}

/* 
   RESPONSIVE
    */
@media (max-width: 1200px) {
    .users-grid {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
}

@media (max-width: 768px) {
    .stats-overview {
        grid-template-columns: repeat(2, 1fr);
    }

    .filters-grid {
        grid-template-columns: 1fr;
    }

    .users-grid {
        grid-template-columns: 1fr;
    }

    .panel-header h1 {
        font-size: 24px;
    }

    .user-actions {
        flex-direction: column;
    }

    .user-actions .btn {
        width: 100%;
    }

    .table-container {
        padding: 20px;
    }
}

@media (max-width: 480px) {
    .stats-overview {
        grid-template-columns: 1fr;
    }

    .stat-card {
        padding: 20px;
    }

    .stat-value {
        font-size: 28px;
    }
}
            `}</style>

            <div className="users-panel-container">
                {/* HEADER */}
                <div className="panel-header">
                    <h1><span><FaUsers /></span> Panel Użytkowników</h1>
                    <p>Zarządzaj użytkownikami, uprawnieniami i płatnościami</p>
                </div>

                {/* STATS OVERVIEW */}
                <div className="stats-overview">
                    <div className="stat-card">
                        <div className="stat-icon"><FaUser /></div>
                        <div className="stat-info">
                            <div className="stat-value">{users.length}</div>
                            <div className="stat-label">Użytkowników</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaCheck /></div>
                        <div className="stat-info">
                            <div className="stat-value">{users.filter(u => u.deactivated === 0).length}</div>
                            <div className="stat-label">Aktywnych</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaCreditCard /></div>
                        <div className="stat-info">
                            <div className="stat-value">{users.filter(u => u.paymentActive === 1).length}</div>
                            <div className="stat-label">Z płatnościami</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><FaExclamationTriangle /></div>
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
                            <label><FaUserTie style={{ marginRight: 5 }} /> Uprawnienia</label>
                            <select value={filter} onChange={e => setFilter(e.target.value)}>
                                <option value="all">Wszystkie</option>
                                <option value="admin">Administratorzy</option>
                                <option value="trainers">Trenerzy</option>
                                <option value="users">Użytkownicy</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label><FaSearch style={{ marginRight: 5 }} /> Status</label>
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
                            <label><FaSyncAlt style={{ marginRight: 5 }} /> Sortuj po</label>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="regDate">Data rejestracji</option>
                                <option value="lastLog">Ostatnie logowanie</option>
                                <option value="sumToPay">Kwota do zapłaty</option>
                                <option value="deactivated">Status</option>
                                <option value="payStatus">Płatności</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label><FaSortAmountUp style={{ marginRight: 5 }} /> Kolejność</label>
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
                            <FaIdCard style={{ marginRight: '5px' }} /> Karty
                        </button>
                        <button
                            className={`view-button ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <FaTable style={{ marginRight: '5px' }} /> Tabela
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p style={{ marginTop: '20px', color: '#666' }}>Ładowanie użytkowników...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="empty-state">
                        
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
                                        {user.deactivated === 1 ? <><FaLock style={{ marginRight: '5px', color: 'gray' }} />Zablokowany</>
                                            : <><FaCheck style={{ marginRight: '5px', color: 'green' }} />Aktywny</>}
                                    </div>
                                </div>

                                <div className="user-details">
                                    <div className="detail-item">
                                        <span className="detail-icon"><FaCalendarAlt color='grey' style={{ marginRight: 5 }} /></span>
                                        <div>
                                            <div className="detail-label">Rejestracja</div>
                                            <div className="detail-value">{new Date(user.registrationDate).toLocaleDateString('pl-PL')}</div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-icon"><FaClock color='grey' style={{ marginRight: 5 }} /></span>
                                        <div>
                                            <div className="detail-label">Ostatnie logowanie</div>
                                            <div className="detail-value">{user.lastLog ? new Date(user.lastLog).toLocaleDateString('pl-PL') : 'Brak danych'}</div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-icon"><FaMoneyBillWave color='grey' style={{ marginRight: 5 }} /></span>
                                        <div>
                                            <div className="detail-label">Do zapłaty</div>
                                            <div className={`detail-value ${user.sumToPay > 0 ? 'debt' : 'paid'}`}>
                                                {user.sumToPay > 0 ? `${user.sumToPay} zł` : 'Opłacone'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-icon"><FaCreditCard color='grey' style={{ marginRight: 5 }} /></span>
                                        <div>
                                            <div className="detail-label">Status płatności</div>
                                            <div className="detail-value">
                                                {user.paymentActive === 1
                                                    ? <><FaCheck color='grey' style={{ marginRight: 5 }} /> Aktywny</>
                                                    : <><FaTimes color='grey' style={{ marginRight: 5 }} /> Nieaktywny</>}
                                            </div>
                                        </div>
                                    </div>

                                    {user.description && (
                                        <div className="user-description">
                                            <div className="detail-label"><FaCreditCard color='grey' style={{ marginRight: 5 }} /> Opis:</div>
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
                                                <FaUserTie style={{ marginRight: 5 }} /> Uprawnienia
                                            </button>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleResetPassword(user.userID)}>
                                                <FaKey style={{ marginRight: 5 }} /> Reset hasła
                                            </button>
                                            <button
                                                className={`btn btn-sm ${user.deactivated === 1 ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => handleDeactivate(user.userID, user.deactivated)}
                                            >
                                                {user.deactivated === 1
                                                    ? <><FaCheck style={{ marginRight: 5 }} /> Odblokuj</>
                                                    : <><FaLock style={{ marginRight: 5 }} /> Zablokuj</>}
                                            </button>
                                            <button
                                                className={`btn btn-sm ${user.paymentActive === 1 ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() => handleChangePaymentStatus(user.userID, user.paymentActive)}
                                            >
                                                {user.paymentActive === 1
                                                    ? <><FaCreditCard style={{ marginRight: 5 }} /> Wyłącz płatności</>
                                                    : <><FaMoneyBillWave style={{ marginRight: 5 }} /> Włącz płatności</>}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(user.userID)}
                                            >
                                                <FaTrash style={{ marginRight: 5 }} /> Usuń
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
                                            <div style={{ fontWeight: '600' }}>{user.name} {user.surname}</div>
                                            <div style={{ fontSize: '12px', color: '#999' }}>{user.email}</div>
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
                                                <button className="btn-icon" onClick={() => setchangingRanksUserID(user.userID)} title="Uprawnienia"><FaUserTie style={{ marginRight: 5 }} /></button>
                                                <button className="btn-icon" onClick={() => handleResetPassword(user.userID)} title="Reset hasła"><FaKey style={{ marginRight: 5 }} /></button>
                                                <button className="btn-icon" onClick={() => handleDeactivate(user.userID, user.deactivated)} title={user.deactivated === 1 ? 'Odblokuj' : 'Zablokuj'}>
                                                    {user.deactivated === 1
                                                        ? <><FaCheck style={{ marginRight: 5 }} /></>
                                                        : <><FaLock style={{ marginRight: 5 }} /></>}
                                                </button>
                                                <button className="btn-icon" onClick={() => handleChangePaymentStatus(user.userID, user.paymentActive)} title="Płatności"><FaCreditCard color='black' style={{ marginRight: 5 }} /></button>
                                                <button className="btn-icon btn-danger" onClick={() => handleDelete(user.userID)} title="Usuń"><FaTrash color='black' style={{ marginRight: 5 }} /></button>
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