import React, { useState, useEffect } from "react";
import PaymentForm from "../components/PaymentForm";

export default function PaymentsPanel() {
    const [payments, setPayments] = useState([]);
    const [filter, setFilter] = useState('notPaidAfterDueTime')
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
    }

    // Historia płatności użytkownika o podanym ID
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
            case "all":
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
            const res = await fetch(`http://localhost:5000/api/getAllPaymentsByID?${params.toString()}`);
            if (!res.ok) throw new Error("Błąd połączenia z serwerem");
            const data = await res.json();
            setPayments(data.userPayments || []);
        } catch (err) {
            console.error("Błąd podczas pobierania historii płatności:", err);
            alert("Nie udało się pobrać historii płatności.");
        }
    };

    // Pobieranie listy użytkowników do filtrowania w postaci tablicy
    const fetchUsersList = async () => {
        if (Number(rank) !== 1) return;
        try {
            const res = await fetch("http://localhost:5000/api/users");
            const data = await res.json();
            setUsersList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Błąd pobierania listy użytkowników:", err);
            setUsersList([]);
        }
    };

    // Pobieranie listy użytkowników do dodania płatności 
    const fetchUsersListToPick = async () => {
        if (Number(rank) !== 1) return;
        try {
            const res = await fetch("http://localhost:5000/api/users?statusFilter=payActive");
            const data = await res.json();
            setUsersListToPick(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Błąd pobierania listy użytkowników:", err);
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
            const res = await fetch("http://localhost:5000/api/addSinglePayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: userID,
                    paymentDate: paymentDate || null,
                    dueDate: dueDate,
                    amount: amount
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Płatność została dodana");
                e.target.reset();
                setForm(false);
                fetchPayments();
            } else {
                alert(data.error || "Błąd podczas dodawania płatności");
            }
        } catch (err) {
            console.error("Błąd podczas dodawania płatności:", err);
            alert("Błąd serwera");
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
            const res = await fetch("http://localhost:5000/api/addMultiplePayments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paymentDate: paymentDate || null,
                    dueDate: dueDate,
                    amount: amount
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert(`${data.message || "Płatności zostały dodane"}`);
                e.target.reset();
                setForm(false);
                fetchPayments();
            } else {
                alert(data.error || "Błąd podczas dodawania płatności");
            }
        } catch (err) {
            console.error("Błąd podczas dodawania płatności:", err);
            alert("Błąd serwera");
        }
    };

    // Usuwanie płatności
    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć płatność? Operacja jest nieodwracalna")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/deletePayment/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                alert("Płatność została usunięta");
                setPayments(p => p.filter(t => t.paymentID !== id));
            } else alert(data.error || "Błąd podczas usuwania płatności");
        } catch (e) {
            console.error("Błąd przy usuwaniu płatności:", e);
            alert("Błąd serwera");
        }

    }

    // Oznaczanie płatności jako opłaconej dzisiaj
    const handleSetPaymentToday = async (paymentID) => {
        if (!window.confirm("Czy chcesz oznaczyć tę płatność jako opłaconą dzisiaj?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/setPaymentDateOnToday/${paymentID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            if (data.success) {
                alert("Dokonano płatności");
                fetchPayments();
            } else {
                alert(data.error || "Błąd podczas aktualizacji płatności");
            }
        } catch (err) {
            console.error("Błąd serwera przy aktualizacji płatności:", err);
            alert("Błąd serwera");
        }
    };

    // Edycja płatności
    const handleModifyPayment = async (paymentDate, dueDate, amount, id) => {
        if (!checkParams(paymentDate, dueDate, amount)) return;
        try {
            const res = await fetch("http://localhost:5000/api/modifyPayment", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentDate, dueDate, amount, id })
            });
            const data = await res.json();
            if (data.success) {
                alert("Opłata zmodyfikowana");
                fetchPayments();
                fetchPaymentStatus();
            } else {
                alert(data.error || "Błąd przy modyfikacji płatności");
            }
        } catch (err) {
            console.error(err);
            alert("Błąd serwera");
        }
    }


    // Odświeżanie historii płatności
    const fetchPayments = async () => {
        try {
            const query = Number(rank) === 1 ? "" :`?userID=${id}`
            const res = await fetch(`http://localhost:5000/api/getAllPaymentsByID${query}`);
            const data = await res.json();
            if (data.success) setPayments(data.userPayments || []);
            else setPayments([]);
        } catch (err) {
            console.error("Błąd serwera przy pobieraniu płatności:", err);
            setPayments([]);
        }
    };

    // Aktualizacja statusu płatności od razu przy zmianie
    const fetchPaymentStatus = async () => {
        if (!id) return;
        try {
            const res = await fetch(`http://localhost:5000/api/paymentStatus/${id}`);
            const data = await res.json();
            if (res.ok) setSumToPay(Number(data.sumToPay) || 0);
        } catch (err) {
            console.error("Błąd wyświetlania statusu płatności:", err);
        }
    };

    const sendReminderToUser = async (userMail, paymentDelay) => {
        try {
            const res = await fetch("http://localhost:5000/api/users/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toWho: userMail,
                    subject: "Przypomnienie o opłaceniu składki członkowskiej",
                    content: `Cześć! Przypominamy, że za uczestnictwo w zajęciach obowiązuje miesięczna składka członkowska w wysokości 35,00 zł. Środki te są niezbędne do funkcjonowania klubu — pokrywają koszty organizacji zajęć, zawodów i sprzętu. Twoje aktualne saldo wynosi: ${paymentDelay} zł.`,
                    html: `
                        <div style="font-family: Arial, sans-serif;">
                                <h3>Cześć!</h3>
                                <p>
                                    Przypominamy, że za uczestnictwo w zajęciach obowiązuje
                                    miesięczna <strong>składka członkowska w wysokości 35,00 zł</strong>.
                                </p>
                                <p>
                                    Środki te są nam niezbędne do prawidłowego funkcjonowania klubu —
                                    wspierają zakup sprzętu oraz utrzymanie klubu.
                                </p>
                            <p>
                                <strong>Aktualna kwota do zapłaty wynosi:</strong> 
                                <span style="color: rgba(125, 11, 11, 1); font-weight: bold;">${paymentDelay} zł</span>
                            </p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-family: Arial, sans-serif;">
                                Do zobaczenia na treningu!<br>
                                Klub Szermierki Historycznej przy Politechnice Lubelskiej
                            </p>
                        </div>
                    `,
                }),
            });

            const data = await res.json();
            console.log(data);
            alert("Wiadomość została wysłana")
        } catch (err) {
            console.error("Błąd wysyłki maila:", err);
        }
    };

    // Odświeżanie historii płatności, statusu, listy użytkowników przy starcie
    useEffect(() => {
        fetchUsersList();
        fetchUsersListToPick();
        fetchPaymentStatus();
    }, []);

    // Odświeżanie statusu płatności po zmianie tabeli lub użytkownika
    useEffect(() => {
        fetchPaymentStatus();
    }, [id, payments]);

    // Odświeżanie historii płatności po zmianie filtrów
    useEffect(() => {
        if (id) showPaymentsHistory();
    }, [id, filter, sortBy, order, userToShowHistory]);

    // Odświeżanie statusów użytkowników po zmianie płatności lub listy użytkowników
    useEffect(() => {
        const fetchStatusTab = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/showUserPaymentStatus");
                const data = await res.json();
                // Dane są w data.paymentsTab
                setStatusTab(Array.isArray(data.paymentsTab) ? data.paymentsTab : []);
            } catch (err) {
                console.error("Błąd pobierania listy statusów:", err);
                setStatusTab([]);
            }
        };

        fetchStatusTab();
    }, [payments, usersList]);



    return (
        <div className="trainings-container">
            {/* Status płatności użytkownika */}
            <div>Twój status płatności na dzień dzisiejszy to:<br />
                {sumToPay > 0
                    ? `Na dzień dzisiejszy do zapłaty: ${sumToPay.toFixed(2)} zł`
                    : "Opłacone :)"}
            </div>
            <div>
                {/* Filtrowanie po płatnościach */}
                <div className="filters">
                    <label>Filtruj: </label>
                    <select value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="all">Wszystkie płatności</option>
                        <option value="paid">Wyłącznie opłacone</option>
                        <option value="notPaid">Wyłącznie nieopłacone</option>
                        <option value="notPaidAfterDueTime">Nieopłacone po terminie</option>
                    </select>
                    {/* Sortowanie po kolumnach */}
                    <label> Sortuj: </label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="paymentDate">Data płatności</option>
                        <option value="dueDate">Termin</option>
                        <option value="amount">Kwota</option>
                    </select>
                    {/* Wybór kierunku sortowania */}
                    <select value={order} onChange={(e) => setOrder(e.target.value)}>
                        <option value="ASC">Rosnąco</option>
                        <option value="DESC">Malejąco</option>
                    </select>
                    {
                        // Tylko dla administratora - może wyfiltrować sobie użytkownika do wyświetlenia jego historii płatności
                        Number(rank) === 1 && (
                            <>
                                <label>Użytkownik: </label>
                                <select value={userToShowHistory} onChange={(e) => setUserToShowHistory(e.target.value)}>
                                    <option value="all">Wszyscy użytkownicy</option>
                                    {usersList.map((u) => (
                                        <option key={u.userID} value={u.userID}>
                                            {u.name + " " + u.surname} (ID: {u.userID})
                                        </option>
                                    ))}
                                </select>
                            </>
                        )

                    }
                </div>
                {/* Tabelka z historią płatności */}
                <h2>Historia płatności {Number(rank) === 1 ? "użytkowników" : "użytkownika"}</h2>
                <table>
                    <thead>
                        <tr>
                            {Number(rank) === 1 && (
                                <th>Imię i nazwisko</th>
                            )}
                            <th>Data i godzina płatności</th>
                            <th>Termin zapłaty</th>
                            <th>Kwota do zapłaty</th>
                            {Number(rank) === 1 && (
                                <th>Opcje dodatkowe</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((el) => (
                                <tr key={el.paymentID || el.userID}>
                                    {Number(rank) === 1 && (
                                        <td>{usersList.find(u => u.userID === el.userID)?.name + " " + usersList.find(u => u.userID === el.userID)?.surname || el.userID}</td>
                                    )}
                                    <td>{el.paymentDate ? new Date(el.paymentDate).toLocaleDateString() : "Nieopłacone"}</td>
                                    <td>{new Date(el.dueDate).toLocaleDateString()}</td>
                                    <td>{el.amount} zł</td>
                                    {Number(rank) === 1 && (
                                        <td>
                                            <button onClick={() => handleDelete(el.paymentID)}>Usuń płatność</button>
                                            <a href="#editPayment"><button onClick={() => setEditingPayment(el)}>Modyfikuj szczegóły</button></a>
                                            {!el.paymentDate && (<button onClick={() => handleSetPaymentToday(el.paymentID)}>Opłacono dzisiaj</button>)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Brak zapisanych płatności</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Statusy płatności dla wszystkich użytkowników - dostępne dla Admina */}
            {Number(rank) === 1 && (
                <div>
                    {/* Sekcja dodawania płatności */}
                    <h2>Dodaj nową płatność</h2>

                    {/* Przycisk pokazujący formularz */}
                    <button onClick={() => setForm(prev => !prev)}>
                        {form ? "Anuluj dodawanie" : "Dodaj płatność"}
                    </button>

                    {/* Przycisk przełączania trybu z płatności pojedyńczej na wielkrotną*/}
                    {form && (
                        <button onClick={() => setPressedMultiple(prev => !prev)}>
                            {pressedMultiple
                                ? "Dodaj płatność dla pojedynczego użytkownika"
                                : "Dodaj płatność dla wszystkich użytkowników"}
                        </button>
                    )}

                    {/* Formularz dodawania płatności */}
                    {form && (
                        <form onSubmit={pressedMultiple ? handleMultipleAdd : handleSingleAdd}>
                            {/* W przypadku płatności pojedyńczej - wybór użytkownika */}
                            {!pressedMultiple && (
                                <div>
                                    <label htmlFor="userID">Wybierz użytkownika:</label>
                                    <select id="userID" name="userID" required>
                                        <option value="">-- Wybierz użytkownika --</option>
                                        {usersListToPick.map(user => (
                                            <option key={user.userID} value={user.userID}>
                                                {user.name + " " + user.surname}
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
                    )}
                    {/* Formularz edytowania płatnośći */}
                    {editingPayment && (
                        <div id="editPayment"><form onSubmit={e => {
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
                        </form></div>
                    )}
                </div>
            )}

            {Number(rank) === 1 && (
                <div>
                    <h2>Statusy płatności dla poszczególnych użytkowników</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Użytkownik</th>
                                <th>Kwota do zapłaty</th>
                                <th>Termin ostatniej płatności</th>
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
                                            <td>{user ? `${user.name} ${user.surname}` : "Nieznany użytkownik"}</td>
                                            <td>{(+el.sumToPay || 0).toFixed(2)} zł</td>
                                            <td>{el.lastPaymentDate ? new Date(el.lastPaymentDate).toLocaleDateString() : "Brak wykonanych płatności"}</td>
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
                                    <td colSpan="4">Brak zapisanych statusów</td>
                                </tr>
                            )}
                        </tbody>



                    </table>
                </div>
            )}

        </div>
    );
}
