import React, { useState, useEffect } from "react";
import PaymentForm from "../components/PaymentForm";
import { fetchAPI } from "../config/api"; // ✅ Import API config

export default function PaymentsPanel() {
    const [payments, setPayments] = useState([]);
    const [filter, setFilter] = useState('notPaidAfterDueTime');
    const [sortBy, setSortBy] = useState('paymentDate');
    const [order, setOrder] = useState('ASC');
    const [userToShowHistory, setUserToShowHistory] = useState("all");
    const [usersList, setUsersList] = useState([]);
    const [usersListToPick, setUsersListToPick] = useState([]);
    const [pressedMultiple, setPressedMultiple] = useState(false);
    const [form, setForm] = useState(false);
    const [sumToPay, setSumToPay] = useState(null);
    const [editingPayment, setEditingPayment] = useState(null);
    const [editingValues, setEditingValues] = useState({ paymentDate: "", dueDate: "", amount: "" });
    const [statusTab, setStatusTab] = useState([]);
    const [loading, setLoading] = useState(false);

    const rank = localStorage.getItem("rankID");
    const id = localStorage.getItem("userID");

    // Wybór kolumn do sortowania
    const sortColumnsMap = {
        paymentDate: "paymentDate",
        dueDate: "dueDate",
        amount: "amount"
    };

    // Walidacja płatności
    const checkParams = (payDay, dueDay, amount) => {
        if (amount === null || amount === undefined || amount === "" || isNaN(Number(amount))) {
            alert("Podaj poprawną kwotę");
            return false;
        }
        if (!dueDay) {
            alert("Brak terminu płatności (dueDate)");
            return false;
        }
        if (amount < 0) {
            alert("Kwota płatności nie może być mniejsza od zera");
            return false;
        }
        return true;
    };

    // Historia płatności użytkownika
    const showPaymentsHistory = async () => {
        const userIDToUse = Number(rank) === 1 && userToShowHistory !== "all" ? userToShowHistory : (Number(rank) === 1 ? null : id);

        if (!userIDToUse && Number(rank) !== 1) {
            alert("Brak ID użytkownika w localStorage.");
            return;
        }

        const sortColumn = sortColumnsMap[sortBy] || "paymentDate";
        const orderValue = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

        let paid = "false";
        let unpaid = "false";
        let afterDueTime = "false";

        switch (filter) {
            case "notPaidAfterDueTime":
                afterDueTime = "true";
                break;
            case "notPaid":
                unpaid = "true";
                break;
            case "paid":
                paid = "true";
                break;
            default:
                break;
        }

        const params = new URLSearchParams({
            ...(userIDToUse ? { userID: userIDToUse } : {}),
            paid,
            unpaid,
            afterDueTime,
            tempSort: sortColumn,
            order: orderValue
        });

        try {
            setLoading(true);
            const { data } = await fetchAPI(`/payments/getAllPaymentsByID?${params.toString()}`, {
                method: 'GET'
            });
            setPayments(data.userPayments || []);
            setLoading(false);
        } catch (err) {
            console.error("❌ Błąd podczas pobierania historii płatności:", err);
            alert("Nie udało się pobrać historii płatności.");
            setLoading(false);
        }
    };

    // Pobieranie listy użytkowników do filtrowania
    const fetchUsersList = async () => {
        if (Number(rank) !== 1) return;
        try {
            const { data } = await fetchAPI('/auth/users', { method: 'GET' });
            setUsersList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("❌ Błąd pobierania listy użytkowników:", err);
            setUsersList([]);
        }
    };

    // Pobieranie listy użytkowników do dodania płatności
    const fetchUsersListToPick = async () => {
        if (Number(rank) !== 1) return;
        try {
            const { data } = await fetchAPI('/auth/users?statusFilter=payActive', { method: 'GET' });
            setUsersListToPick(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("❌ Błąd pobierania listy użytkowników:", err);
            setUsersListToPick([]);
        }
    };

    // Dodanie pojedynczej płatności
    const handleSingleAdd = async (e) => {
        e.preventDefault();
        const form = e.target;

        const userID = form.elements.userID?.value || null;
        const paymentDate = form.paymentDate?.value || null;
        const dueDate = form.dueDate?.value || null;
        const amountStr = form.amount?.value;
        const amount = amountStr !== undefined && amountStr !== "" ? parseFloat(amountStr) : null;

        if (!checkParams(paymentDate, dueDate, amount)) return;

        try {
            const { data } = await fetchAPI('/payments/addSinglePayment', {
                method: 'POST',
                body: JSON.stringify({
                    userID,
                    paymentDate: paymentDate || null,
                    dueDate,
                    amount
                })
            });

            if (data.success) {
                alert("Płatność została dodana ✅");
                e.target.reset();
                setForm(false);
                fetchPayments();
            }
        } catch (err) {
            console.error("❌ Błąd podczas dodawania płatności:", err);
            alert(err.message || "Błąd podczas dodawania płatności");
        }
    };

    // Dodanie płatności dla wszystkich użytkowników
    const handleMultipleAdd = async (e) => {
        e.preventDefault();
        const form = e.target;

        const paymentDate = form.paymentDate?.value || null;
        const dueDate = form.dueDate?.value || null;
        const amountStr = form.amount?.value;
        const amount = amountStr !== undefined && amountStr !== "" ? parseFloat(amountStr) : null;

        if (!checkParams(paymentDate, dueDate, amount)) return;

        try {
            const { data } = await fetchAPI('/payments/addMultiplePayments', {
                method: 'POST',
                body: JSON.stringify({
                    paymentDate: paymentDate || null,
                    dueDate,
                    amount
                })
            });

            if (data.success) {
                alert(`${data.message || "Płatności zostały dodane"} ✅`);
                e.target.reset();
                setForm(false);
                fetchPayments();
            }
        } catch (err) {
            console.error("❌ Błąd podczas dodawania płatności:", err);
            alert(err.message || "Błąd podczas dodawania płatności");
        }
    };

    // Usuwanie płatności
    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć płatność? Operacja jest nieodwracalna")) return;
        
        try {
            const { data } = await fetchAPI(`/payments/deletePayment/${id}`, { method: 'DELETE' });
            if (data.success) {
                alert("Płatność została usunięta");
                setPayments(p => p.filter(t => t.paymentID !== id));
            }
        } catch (err) {
            console.error("❌ Błąd przy usuwaniu płatności:", err);
            alert(err.message || "Błąd podczas usuwania płatności");
        }
    };

    // Oznaczanie płatności jako opłaconej dzisiaj
    const handleSetPaymentToday = async (paymentID) => {
        if (!window.confirm("Czy chcesz oznaczyć tę płatność jako opłaconą dzisiaj?")) return;
        
        try {
            const { data } = await fetchAPI(`/payments/setPaymentDateOnToday/${paymentID}`, {
                method: 'PUT'
            });

            if (data.success) {
                alert("Dokonano płatności ✅");
                fetchPayments();
            }
        } catch (err) {
            console.error("❌ Błąd przy aktualizacji płatności:", err);
            alert(err.message || "Błąd podczas aktualizacji płatności");
        }
    };

    // Edycja płatności
    const handleModifyPayment = async (paymentDate, dueDate, amount, id) => {
        if (!checkParams(paymentDate, dueDate, amount)) return;
        
        try {
            const { data } = await fetchAPI('/payments/modifyPayment', {
                method: 'PUT',
                body: JSON.stringify({ paymentDate, dueDate, amount, id })
            });
            
            if (data.success) {
                alert("Opłata zmodyfikowana ✅");
                fetchPayments();
                fetchPaymentStatus();
            }
        } catch (err) {
            console.error("❌ Błąd przy modyfikacji płatności:", err);
            alert(err.message || "Błąd przy modyfikacji płatności");
        }
    };

    // Odświeżanie historii płatności
    const fetchPayments = async () => {
        try {
            const query = Number(rank) === 1 ? "" : `?userID=${id}`;
            const { data } = await fetchAPI(`/payments/getAllPaymentsByID${query}`, {
                method: 'GET'
            });
            if (data.success) setPayments(data.userPayments || []);
            else setPayments([]);
        } catch (err) {
            console.error("❌ Błąd przy pobieraniu płatności:", err);
            setPayments([]);
        }
    };

    // Aktualizacja statusu płatności
    const fetchPaymentStatus = async () => {
        if (!id) return;
        try {
            const { data } = await fetchAPI(`/payments/paymentStatus/${id}`, {
                method: 'GET'
            });
            setSumToPay(Number(data.sumToPay) || 0);
        } catch (err) {
            console.error("❌ Błąd wyświetlania statusu płatności:", err);
        }
    };

    // Wysyłanie przypomnienia
    const sendReminderToUser = async (userMail, paymentDelay) => {
        try {
            const { data } = await fetchAPI('/auth/users/send-email', {
                method: 'POST',
                body: JSON.stringify({
                    toWho: userMail,
                    subject: "Przypomnienie o opłaceniu składki członkowskiej",
                    html: `
                        <div style="font-family: Arial, sans-serif;">
                            <h3>Cześć!</h3>
                            <p>Przypominamy, że za uczestnictwo w zajęciach obowiązuje miesięczna <strong>składka członkowska w wysokości 35,00 zł</strong>.</p>
                            <p>Środki te są niezbędne do prawidłowego funkcjonowania klubu — wspierają zakup sprzętu oraz utrzymanie klubu.</p>
                            <p><strong>Aktualna kwota do zapłaty wynosi:</strong> <span style="color: rgba(125, 11, 11, 1); font-weight: bold;">${paymentDelay} zł</span></p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p>Do zobaczenia na treningu!<br>Klub Szermierki Historycznej przy Politechnice Lubelskiej</p>
                        </div>
                    `
                })
            });
            alert("Wiadomość została wysłana ✅");
        } catch (err) {
            console.error("❌ Błąd wysyłki maila:", err);
            alert(err.message || "Nie udało się wysłać przypomnienia");
        }
    };

    // Pobieranie statusów użytkowników
    const fetchStatusTab = async () => {
        try {
            const { data } = await fetchAPI('/payments/showUserPaymentStatus', {
                method: 'GET'
            });
            setStatusTab(Array.isArray(data.paymentsTab) ? data.paymentsTab : []);
        } catch (err) {
            console.error("❌ Błąd pobierania listy statusów:", err);
            setStatusTab([]);
        }
    };

    // Odświeżanie przy starcie
    useEffect(() => {
        fetchUsersList();
        fetchUsersListToPick();
        fetchPaymentStatus();
    }, []);

    // Odświeżanie statusu płatności
    useEffect(() => {
        fetchPaymentStatus();
    }, [id, payments]);

    // Odświeżanie historii płatności
    useEffect(() => {
        if (id) showPaymentsHistory();
    }, [id, filter, sortBy, order, userToShowHistory]);

    // Odświeżanie statusów użytkowników
    useEffect(() => {
        fetchStatusTab();
    }, [payments, usersList]);

    return (
        <div className="trainings-container">
            {/* Status płatności użytkownika */}
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                <strong>Twój status płatności:</strong><br />
                {sumToPay > 0
                    ? `Do zapłaty: ${sumToPay.toFixed(2)} zł`
                    : "Wszystko opłacone! 🎉"}
            </div>

            {/* Filtrowanie */}
            <div className="filters">
                <label>Filtruj: </label>
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">Wszystkie płatności</option>
                    <option value="paid">Wyłącznie opłacone</option>
                    <option value="notPaid">Wyłącznie nieopłacone</option>
                    <option value="notPaidAfterDueTime">Nieopłacone po terminie</option>
                </select>

                <label>Sortuj: </label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="paymentDate">Data płatności</option>
                    <option value="dueDate">Termin</option>
                    <option value="amount">Kwota</option>
                </select>

                <select value={order} onChange={(e) => setOrder(e.target.value)}>
                    <option value="ASC">Rosnąco</option>
                    <option value="DESC">Malejąco</option>
                </select>

                {Number(rank) === 1 && (
                    <>
                        <label>Użytkownik: </label>
                        <select value={userToShowHistory} onChange={(e) => setUserToShowHistory(e.target.value)}>
                            <option value="all">Wszyscy użytkownicy</option>
                            {usersList.map((u) => (
                                <option key={u.userID} value={u.userID}>
                                    {u.name} {u.surname} (ID: {u.userID})
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>

            {/* Historia płatności */}
            <h2>Historia płatności</h2>
            {loading ? (
                <p>Ładowanie płatności...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            {Number(rank) === 1 && <th>Imię i nazwisko</th>}
                            <th>Data płatności</th>
                            <th>Termin zapłaty</th>
                            <th>Kwota</th>
                            {Number(rank) === 1 && <th>Opcje</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((el) => (
                                <tr key={el.paymentID || el.userID}>
                                    {Number(rank) === 1 && (
                                        <td>
                                            {usersList.find(u => u.userID === el.userID)?.name} {usersList.find(u => u.userID === el.userID)?.surname || el.userID}
                                        </td>
                                    )}
                                    <td>{el.paymentDate ? new Date(el.paymentDate).toLocaleDateString() : "Nieopłacone"}</td>
                                    <td>{new Date(el.dueDate).toLocaleDateString()}</td>
                                    <td>{el.amount} zł</td>
                                    {Number(rank) === 1 && (
                                        <td>
                                            <button onClick={() => handleDelete(el.paymentID)}>Usuń</button>
                                            <a href="#editPayment">
                                                <button onClick={() => setEditingPayment(el)}>Modyfikuj</button>
                                            </a>
                                            {!el.paymentDate && (
                                                <button onClick={() => handleSetPaymentToday(el.paymentID)}>
                                                    Opłacono dzisiaj
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={Number(rank) === 1 ? "5" : "4"}>Brak płatności</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Panel admina */}
            {Number(rank) === 1 && (
                <>
                    {/* Dodawanie płatności */}
                    <h2>Dodaj nową płatność</h2>
                    <button onClick={() => setForm(prev => !prev)}>
                        {form ? "Anuluj" : "Dodaj płatność"}
                    </button>

                    {form && (
                        <>
                            <button onClick={() => setPressedMultiple(prev => !prev)}>
                                {pressedMultiple
                                    ? "Pojedyncza płatność"
                                    : "Płatności dla wszystkich"}
                            </button>

                            <form onSubmit={pressedMultiple ? handleMultipleAdd : handleSingleAdd}>
                                {!pressedMultiple && (
                                    <div>
                                        <label htmlFor="userID">Wybierz użytkownika:</label>
                                        <select id="userID" name="userID" required>
                                            <option value="">-- Wybierz --</option>
                                            {usersListToPick.map(user => (
                                                <option key={user.userID} value={user.userID}>
                                                    {user.name} {user.surname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <PaymentForm />
                                <button type="submit">
                                    Dodaj {pressedMultiple ? "płatności" : "płatność"}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Edytowanie płatności */}
                    {editingPayment && (
                        <div id="editPayment">
                            <h2>Edytowanie płatności</h2>
                            <form onSubmit={e => {
                                e.preventDefault();
                                handleModifyPayment(
                                    editingValues.paymentDate,
                                    editingValues.dueDate,
                                    parseFloat(editingValues.amount),
                                    editingPayment.paymentID
                                );
                                setEditingPayment(null);
                            }}>
                                <PaymentForm payment={editingPayment} onChange={setEditingValues} />
                                <button type="submit">Zapisz zmiany</button>
                                <button type="button" onClick={() => setEditingPayment(null)}>Anuluj</button>
                            </form>
                        </div>
                    )}

                    {/* Statusy płatności */}
                    <h2>Statusy płatności użytkowników</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Użytkownik</th>
                                <th>Kwota do zapłaty</th>
                                <th>Ostatnia płatność</th>
                                <th>Opcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statusTab.length > 0 ? (
                                statusTab.map((el, idx) => {
                                    const user = usersList.find(u => u.userID === el.userID) || usersList.find(u => u.login === el.login);
                                    const userEmail = el.email || user?.email;

                                    return (
                                        <tr key={idx}>
                                            <td>{user ? `${user.name} ${user.surname}` : "Nieznany"}</td>
                                            <td>{(+el.sumToPay || 0).toFixed(2)} zł</td>
                                            <td>
                                                {el.lastPaymentDate
                                                    ? new Date(el.lastPaymentDate).toLocaleDateString()
                                                    : "Brak płatności"}
                                            </td>
                                            <td>
                                                {(+el.sumToPay || 0) > 0 && userEmail && (
                                                    <button onClick={() => sendReminderToUser(userEmail, (+el.sumToPay || 0).toFixed(2))}>
                                                        Wyślij przypomnienie
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4">Brak statusów</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}