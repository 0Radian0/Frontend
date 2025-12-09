import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function UsersPanel() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all')
    const [sortBy, setSortBy] = useState('login');
    const [order, setOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');
    const [changingRanksUserID, setchangingRanksUserID] = useState(null);

    // Kolumny do sortowania
    const sortColumnsMap = {
        login: "login",
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
    const fetchUsers = () => {
        const sortColumn = sortColumnsMap[sortBy] || "login";
        const orderValue = order === "asc" ? "ASC" : "DESC";


        let status = "all";
        switch (statusFilter){
            case "paymentActive": status = "payActive"; break;
            case "paymentUnactive": status = "payUnactive"; break;
            case "active": status = "active"; break;
            case "deactivated": status = "deactivated"; break;
            case "lackOfPayment": status = "lackOfPayment"; break;
            default: status = "all";
        }

        let params = new URLSearchParams({
            rank: filter == 'all' ? 'all' : (filter == 'admin' ? 1 : (filter == 'trainers' ? 2 : 3)),
            statusFilter: status,
            tempSort: sortColumn,
            order: orderValue,
        });

        fetch(`http://localhost:5000/api/users?${params.toString()}`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(e => console.error("Błąd pobierania użytkowników: ", e));
    };


    //  Sprawdzanie czy nastpiła wpłata w tym miesiącu 
    const isPaidThisMonth = (user) => {
        if (!user.amount || !user.paymentDate || !user.dueDate) return "NIE"
        const payment = new Date(user.paymentDate);
        const due = new Date(user.dueDate);

        return (payment.getMonth() === due.getMonth() && payment.getFullYear() === due.getFullYear()) ? "TAK" : "NIE";
    }

    // Usuwanie użytkownika
    const handleDelete = async (userID) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika? Operacja jest nieodwracalna i spowoduje usunięcie wszystkich powiązanych danych.")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/${userID}`, {
                method: "DELETE"
            });
            const data = await res.json();

            if (data.success) {
                setUsers(prev => prev.filter(u => u.userID !== userID));
            } else {
                alert(data.error || "Usunięto użytkownika");
                fetchUsers();
            }
        } catch (e) {
            console.error(e);
            alert("Błąd serwera. Usuwanie użytkownika nie powiodło się")
        }
    }

    // Zmiana uprawnień użytkownika
    const handleChangeRanks = async (rankID, userID) => {
        if (!window.confirm("Czy na pewno chcesz zmienić uprawnienia użytkownika?")) return;
        try {
            const res = await fetch("http://localhost:5000/api/users/rank", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID, rankID })
            })


            const data = await res.json();
            if (data.success) {
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.userID === userID ? { ...user, rankID, rankName: rankID } : user
                    )
                );
                alert(data.message);
                fetchUsers();
            } else
                alert(data.error || "Błąd przy zmianie uprawnień");
        } catch (e) {
            console.error(e);
            alert("Błąd serwera. Nie udało się zmienić uprawnień");
        }
    };

    // resset hasła i wysyłka na maila
    const handleResetPassword = async (userID) => {
        if (!window.confirm("Czy na pewno chcesz zresetować hasło tego użytkownika? Nowe hasło zostanie wysłane na jego e-mail.")) return;

        try {
            const res = await fetch("http://localhost:5000/api/users/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID })
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message);
            } else
                alert(data.error || "Błąd przy próbie resetu hasła");
        } catch (e) {
            console.error(e);
            alert("Błąd serwera. Nie udało się zresetować hasła");
        }
    };

    // Dezaktywacja lub reaktywacja konta użytkownika
    const handleDeactivate = async (userID, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;

        if (!window.confirm(`Czy na pewno chcesz ${newStatus === 1 ? "zablokować" : "odblokować"} użytkownika? Działanie to spowoduje ${newStatus === 1 ? "brak możliwości ponownego zalogowania" : "odblokowanie możliwości logowania"} do systemu przez użytkownika`)) return;

        try {
            const res = await fetch("http://localhost:5000/api/users/deactivateUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: Number(userID),
                    deactivatedStatus: newStatus
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || `Nie udało się ${newStatus === 1 ? "zablokować" : "odblokować"} użytkownika`);
                return;
            }

            alert(data.message || `Użytkownik został ${newStatus === 1 ? "zablokowany" : "odblokowany"}`);
            fetchUsers();
        } catch (e) {
            console.error("Błąd przy zmianie statusu użytkownika:", e);
            alert("Błąd serwera. Nie udało się zmienić statusu użytkownika.");
        }
    };

    // Włączanie uzytkownika do opłat
    const handleChangePaymentStatus = async (userID, paymentStatus) => {
        const newStatus = paymentStatus === 1 ? 0 : 1;

        if (!window.confirm(`Czy na pewno chcesz ${newStatus === 1 ? "wyłączyć z płatności" : "włączyć do opłat"} użytkownika?`)) return;

        try {
            const res = await fetch("http://localhost:5000/api/users/changePaymentStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: Number(userID),
                    paymentActive: newStatus
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || `Nie udało się ${newStatus === 1 ? "wyłączyć z płatności" : "włączyć do opłatl"} użytkownika`);
                return;
            }

            alert(data.message || `Użytkownik został ${newStatus === 1 ? "wyłączony z płatności" : "włączony do opłat"}`);
            fetchUsers();
        } catch (e) {
            console.error("Błąd przy zmianie statusu płatności użytkownika:", e);
            alert("Błąd serwera. Nie udało się zmienić statusu płatności użytkownika.");
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [filter, statusFilter, sortBy, order]);


    return (
        <div >
            <h1>Panel użytkowników</h1>
            <div className="usersPanel">
                {/* Opcje filtrowania */}
                <div className="filters">
                    <label>Filtrowanie po uprawnieniach:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
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
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        {/* Opcje sortowania */}
                        <option value="login">Nazwa użytkownika</option>
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
                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                    >
                        {/* Kierunek sortowania */}
                        <option value="asc">Rosnąco</option>
                        <option value="desc">Malejąco</option>

                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Login</th>
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
                                    <td>{user.login}</td>
                                    <td>{user.name + " " + user.surname}</td>
                                    <td>{rankNames[user.rankID]}</td>
                                    <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                                    <td>
                                        {user.lastLog ? new Date(user.lastLog).toLocaleDateString() : "brak danych"}
                                    </td>
                                    <td>{user.description || "-"}</td>
                                    <td>{user.deactivated === 1 ? "Blokada" : "Aktywny"}</td>
                                    <td>
                                        {/* Przyciski funkcyjne */}
                                        <button type="submit" onClick={() => handleResetPassword(user.userID)}>Zresetuj hasło</button>
                                        <button onClick={() => handleDeactivate(user.userID, user.deactivated)}>
                                            {(user.deactivated === 1 ? "Odblokuj" : "Zablokuj") + " użytkownika"}
                                        </button>
                                        <button type="submit" onClick={() => handleDelete(user.userID)}>Usuń użytkownika</button>
                                        {changingRanksUserID === user.userID ? (
                                            <div className='filters'> <select
                                                value={user.rankID}
                                                onChange={(e) => handleChangeRanks(Number(e.target.value), user.userID)}
                                                onBlur={() => setchangingRanksUserID(null)}
                                            >
                                                <option value={1}>Administrator</option>
                                                <option value={2}>Trener</option>
                                                <option value={3}>Użytkownik</option>
                                            </select></div>
                                        ) : (
                                            <button type="button" onClick={() => setchangingRanksUserID(user.userID)}>
                                                Zmień uprawnienia
                                            </button>
                                        )}
                                        <button onClick={() => handleChangePaymentStatus(user.userID, user.paymentActive)}>{user.paymentActive == 1 ? "Wyłącz z płatności" : "Włącz opłaty"}</button>
                                    </td>
                                    <td>{user.paymentActive == 1 ? "Składka obowiązuje" : "Wyłączony z opłat"}</td>
                                    <td>{isPaidThisMonth(user)} </td>
                                    <td>{user.sumToPay} </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center" }}>
                                    Brak użytkowników spełniających zadane kryteria 
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
}