import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function UsersPanel() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('regDate');

    const [order, setOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');
    const [changingRanksUserID, setchangingRanksUserID] = useState(null);
    const [loading, setLoading] = useState(false);

    // Kolumny do sortowania
    const sortColumnsMap = {
    regDate: "registrationDate",
    descp: "description",
    lastLog: "lastLog",
    deactivated: "deactivated",
    payStatus: "paymentActive",
    sumToPay: "sumToPay"
};


    // Uprawnienia do filtrowania
    const rankNames = {
        1: "Administrator",
        2: "Trener",
        3: "Użytkownik"
    };

    // Odświeżanie strony
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
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI(`/auth/users?${params.toString()}`, {
                method: 'GET'
            });
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error("❌ Błąd pobierania użytkowników:", err);
            alert("Nie udało się pobrać listy użytkowników");
            setLoading(false);
        }
    };

    // Sprawdzanie czy nastąpiła wpłata w tym miesiącu
    const isPaidThisMonth = (user) => {
        if (!user.amount || !user.paymentDate || !user.dueDate) return "NIE";
        const payment = new Date(user.paymentDate);
        const due = new Date(user.dueDate);
        return (payment.getMonth() === due.getMonth() && payment.getFullYear() === due.getFullYear()) ? "TAK" : "NIE";
    };

    // Usuwanie użytkownika
    const handleDelete = async (userID) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika? Operacja jest nieodwracalna i spowoduje usunięcie wszystkich powiązanych danych.")) return;
        
        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI(`/auth/users/${userID}`, {
                method: 'DELETE'
            });

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

    // Zmiana uprawnień użytkownika
    const handleChangeRanks = async (rankID, userID) => {
        if (!window.confirm("Czy na pewno chcesz zmienić uprawnienia użytkownika?")) return;
        
        try {
            // ✅ Używamy fetchAPI
            const { data } = await fetchAPI('/auth/users/rank', {
                method: 'POST',
                body: JSON.stringify({ userID, rankID })
            });

            if (data.success) {
                alert(data.message || "Zmieniono uprawnienia użytkownika");
                fetchUsers();
            }
        } catch (err) {
            console.error("❌ Błąd przy zmianie uprawnień:", err);
            alert(err.message || "Błąd serwera. Nie udało się zmienić uprawnień");
        }
    };

    // Reset hasła i wysyłka na maila
    const handleResetPassword = async (userID) => {
        if (!window.confirm("Czy na pewno chcesz zresetować hasło tego użytkownika? Nowe hasło zostanie wysłane na jego e-mail.")) return;

        try {
            // ✅ Używamy fetchAPI
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

    // Dezaktywacja lub reaktywacja konta użytkownika
    const handleDeactivate = async (userID, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;

        if (!window.confirm(`Czy na pewno chcesz ${newStatus === 1 ? "zablokować" : "odblokować"} użytkownika?`)) return;

        try {
            // ✅ Używamy fetchAPI
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

    // Włączanie użytkownika do opłat
    const handleChangePaymentStatus = async (userID, paymentStatus) => {
        const newStatus = paymentStatus === 1 ? 0 : 1;

        if (!window.confirm(`Czy na pewno chcesz ${newStatus === 1 ? "wyłączyć z płatności" : "włączyć do opłat"} użytkownika?`)) return;

        try {
            // ✅ Używamy fetchAPI
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
        <div>
            <h1>Panel użytkowników</h1>
            <div className="usersPanel">
                {/* Opcje filtrowania */}
                <div className="filters">
                    <label>Filtrowanie po uprawnieniach:</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        <option value="admin">Administratorzy</option>
                        <option value="trainers">Trenerzy</option>
                        <option value="users">Pozostali użytkownicy</option>
                    </select>
                </div>
                
                <div className="filters">
                    <label>Filtrowanie:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">Wszyscy</option>
                        <option value="paymentActive">Włączone płatności</option>
                        <option value="paymentUnactive">Wyłączone płatności</option>
                        <option value="active">Aktywni</option>
                        <option value="deactivated">Zablokowani</option>
                        <option value="lackOfPayment">Nieopłacone płatności</option>
                    </select>
                </div>
                
                <div className="filters">
                    <label>Sortowanie:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        
                        <option value="regDate">Data rejestracji</option>
                        <option value="descp">Opis</option>
                        <option value="lastLog">Ostatnie logowanie</option>
                        <option value="deactivated">Status aktywności</option>
                        <option value="payStatus">Włączone płatności</option>
                        <option value="sumToPay">Kwota do zapłaty</option>
                    </select>
                </div>
                
                <div className="filters">
                    <label>Kolejność sortowania:</label>
                    <select value={order} onChange={(e) => setOrder(e.target.value)}>
                        <option value="asc">Rosnąco</option>
                        <option value="desc">Malejąco</option>
                    </select>
                </div>

                {loading ? (
                    <p>Ładowanie użytkowników...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                
                                <th>Imię i nazwisko</th>
                                <th>Rodzaj użytkownika</th>
                                <th>Data rejestracji</th>
                                <th>Ostatnie logowanie</th>
                                <th>Opis</th>
                                <th>Status użytkownika</th>
                                <th>Opcje</th>
                                <th>Opłaty</th>
                                <th>Czy nastąpiła wpłata w tym miesiącu?</th>
                                <th>Łączna kwota do zapłaty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.userID}>
                                        
                                        <td>{user.name + " " + user.surname}</td>
                                        <td>{rankNames[user.rankID]}</td>
                                        <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                                        <td>{user.lastLog ? new Date(user.lastLog).toLocaleDateString() : "brak danych"}</td>
                                        <td>{user.description || "-"}</td>
                                        <td>{user.deactivated === 1 ? "Blokada" : "Aktywny"}</td>
                                        <td>
                                            <button type="submit" onClick={() => handleResetPassword(user.userID)}>
                                                Zresetuj hasło
                                            </button>
                                            <button onClick={() => handleDeactivate(user.userID, user.deactivated)}>
                                                {(user.deactivated === 1 ? "Odblokuj" : "Zablokuj") + " użytkownika"}
                                            </button>
                                            <button type="submit" onClick={() => handleDelete(user.userID)}>
                                                Usuń użytkownika
                                            </button>
                                            {changingRanksUserID === user.userID ? (
                                                <div className='filters'>
                                                    <select
                                                        value={user.rankID}
                                                        onChange={(e) => handleChangeRanks(Number(e.target.value), user.userID)}
                                                        onBlur={() => setchangingRanksUserID(null)}
                                                    >
                                                        <option value={1}>Administrator</option>
                                                        <option value={2}>Trener</option>
                                                        <option value={3}>Użytkownik</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => setchangingRanksUserID(user.userID)}>
                                                    Zmień uprawnienia
                                                </button>
                                            )}
                                            <button onClick={() => handleChangePaymentStatus(user.userID, user.paymentActive)}>
                                                {user.paymentActive === 1 ? "Wyłącz z płatności" : "Włącz opłaty"}
                                            </button>
                                        </td>
                                        <td>{user.paymentActive === 1 ? "Składka obowiązuje" : "Wyłączony z opłat"}</td>
                                        <td>{isPaidThisMonth(user)}</td>
                                        <td>{user.sumToPay}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center" }}>
                                        Brak użytkowników spełniających zadane kryteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}