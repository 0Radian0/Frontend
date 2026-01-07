import React, { useState, useEffect, useRef } from "react";
import PaymentForm from "../components/PaymentForm";
import { fetchAPI } from "../config/api";
import { FaCheck, FaTimes, FaPlus, FaExclamationTriangle, FaClock, FaTrash, FaEdit, FaCog, FaUser, FaUsers} from 'react-icons/fa';


export default function PaymentsPanel() {
    const editFormRef = useRef(null)
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
    const isAdmin = Number(rank) === 1;

    const sortColumnsMap = {
        paymentDate: "paymentDate",
        dueDate: "dueDate",
        amount: "amount"
    };

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

    const showPaymentsHistory = async () => {
        const userIDToUse = isAdmin && userToShowHistory !== "all" ? userToShowHistory : (!isAdmin ? id : null);
        if (!userIDToUse && !isAdmin) {
            alert("Brak ID użytkownika w localStorage.");
            return;
        }

        const sortColumn = sortColumnsMap[sortBy] || "paymentDate";
        const orderValue = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

        let paid = "false", unpaid = "false", afterDueTime = "false";
        switch (filter) {
            case "notPaidAfterDueTime": afterDueTime = "true"; break;
            case "notPaid": unpaid = "true"; break;
            case "paid": paid = "true"; break;
            default: break;
        }

        const params = new URLSearchParams({
            ...(userIDToUse ? { userID: userIDToUse } : {}),
            paid, unpaid, afterDueTime,
            tempSort: sortColumn,
            order: orderValue
        });

        try {
            setLoading(true);
            const { data } = await fetchAPI(`/payments/getAllPaymentsByID?${params.toString()}`, { method: 'GET' });
            setPayments(data.userPayments || []);
            setLoading(false);
        } catch (err) {
            console.error("❌ Błąd podczas pobierania historii płatności:", err);
            alert("Nie udało się pobrać historii płatności.");
            setLoading(false);
        }
    };

    const fetchUsersList = async () => {
        if (!isAdmin) return;
        try {
            const { data } = await fetchAPI('/auth/users', { method: 'GET' });
            setUsersList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("❌ Błąd pobierania listy użytkowników:", err);
            setUsersList([]);
        }
    };

    const fetchUsersListToPick = async () => {
        if (!isAdmin) return;
        try {
            const { data } = await fetchAPI('/auth/users?statusFilter=payActive', { method: 'GET' });
            setUsersListToPick(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("❌ Błąd pobierania listy użytkowników:", err);
            setUsersListToPick([]);
        }
    };

    const handleSingleAdd = async (e) => {
        e.preventDefault();
        const form = e.target;
        const userID = form.elements.userID?.value || null;
        const paymentDate = form.paymentDate?.value || null;
        const dueDate = form.dueDate?.value || null;
        const amount = form.amount?.value ? parseFloat(form.amount.value) : null;

        if (!checkParams(paymentDate, dueDate, amount)) return;

        try {
            const { data } = await fetchAPI('/payments/addSinglePayment', {
                method: 'POST',
                body: JSON.stringify({ userID, paymentDate: paymentDate || null, dueDate, amount })
            });

            if (data.success) {
                alert("Płatność została dodana ");
                e.target.reset();
                setForm(false);
                fetchPayments();
            }
        } catch (err) {
            console.error("❌ Błąd podczas dodawania płatności:", err);
            alert(err.message || "Błąd podczas dodawania płatności");
        }
    };

    const handleMultipleAdd = async (e) => {
        e.preventDefault();
        const form = e.target;
        const paymentDate = form.paymentDate?.value || null;
        const dueDate = form.dueDate?.value || null;
        const amount = form.amount?.value ? parseFloat(form.amount.value) : null;

        if (!checkParams(paymentDate, dueDate, amount)) return;

        try {
            const { data } = await fetchAPI('/payments/addMultiplePayments', {
                method: 'POST',
                body: JSON.stringify({ paymentDate: paymentDate || null, dueDate, amount })
            });

            if (data.success) {
                alert(`${data.message || "Płatności zostały dodane"} `);
                e.target.reset();
                setForm(false);
                fetchPayments();
            }
        } catch (err) {
            console.error("❌ Błąd podczas dodawania płatności:", err);
            alert(err.message || "Błąd podczas dodawania płatności");
        }
    };

    const handleEditClick = (payment) => {
        setEditingPayment(payment);
        setTimeout(() => {
            editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

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

    const handleSetPaymentToday = async (paymentID) => {
        if (!window.confirm("Czy chcesz oznaczyć tę płatność jako opłaconą dzisiaj?")) return;
        try {
            const { data } = await fetchAPI(`/payments/setPaymentDateOnToday/${paymentID}`, { method: 'PUT' });
            if (data.success) {
                alert("Dokonano płatności");
                fetchPayments();
            }
        } catch (err) {
            console.error("❌ Błąd przy aktualizacji płatności:", err);
            alert(err.message || "Błąd podczas aktualizacji płatności");
        }
    };

    const handleModifyPayment = async (paymentDate, dueDate, amount, id) => {
        if (!checkParams(paymentDate, dueDate, amount)) return;
        try {
            const { data } = await fetchAPI('/payments/modifyPayment', {
                method: 'PUT',
                body: JSON.stringify({ paymentDate: paymentDate || null, dueDate, amount, id })
            });
            if (data.success) {
                alert("Opłata zmodyfikowana");
                fetchPayments();
                fetchPaymentStatus();
                setEditingPayment(null);
            }
        } catch (err) {
            console.error("❌ Błąd przy modyfikacji płatności:", err);
            alert(err.message || "Błąd przy modyfikacji płatności");
        }
    };

    const fetchPayments = async () => {
        try {
            const query = isAdmin ? "" : `?userID=${id}`;
            const { data } = await fetchAPI(`/payments/getAllPaymentsByID${query}`, { method: 'GET' });
            if (data.success) setPayments(data.userPayments || []);
            else setPayments([]);
        } catch (err) {
            console.error("❌ Błąd przy pobieraniu płatności:", err);
            setPayments([]);
        }
    };

    const fetchPaymentStatus = async () => {
        if (!id) return;
        try {
            const { data } = await fetchAPI(`/payments/paymentStatus/${id}`, { method: 'GET' });
            setSumToPay(Number(data.sumToPay) || 0);
        } catch (err) {
            console.error("❌ Błąd wyświetlania statusu płatności:", err);
        }
    };

    const sendReminderToUser = async (userMail, paymentDelay) => {
        try {
            const { data } = await fetchAPI('/auth/users/send-email', {
                method: 'POST',
                body: JSON.stringify({
                    toWho: userMail,
                    subject: "Przypomnienie o opłaceniu składki członkowskiej",
                    html: `<div style="font-family: Arial, sans-serif;">
                        <h3>Cześć!</h3>
                        <p>Przypominamy, że za uczestnictwo w zajęciach obowiązuje miesięczna <strong>składka członkowska w wysokości 35,00 zł</strong>.</p>
                        <p><strong>Aktualna kwota do zapłaty wynosi:</strong> <span style="color: #c33; font-weight: bold;">${paymentDelay} zł</span></p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p>Do zobaczenia na treningu!<br>Klub Szermierki Historycznej przy Politechnice Lubelskiej</p>
                    </div>`
                })
            });
            alert("Wiadomość została wysłana");
        } catch (err) {
            console.error("❌ Błąd wysyłki maila:", err);
            alert(err.message || "Nie udało się wysłać przypomnienia");
        }
    };

    const fetchStatusTab = async () => {
        try {
            const { data } = await fetchAPI('/payments/showUserPaymentStatus', { method: 'GET' });
            setStatusTab(Array.isArray(data.paymentsTab) ? data.paymentsTab : []);
        } catch (err) {
            console.error("❌ Błąd pobierania listy statusów:", err);
            setStatusTab([]);
        }
    };

    useEffect(() => {
        fetchUsersList();
        fetchUsersListToPick();
        fetchPaymentStatus();
    }, []);

    useEffect(() => {
        fetchPaymentStatus();
    }, [id, payments]);

    useEffect(() => {
        if (id) showPaymentsHistory();
    }, [id, filter, sortBy, order, userToShowHistory]);

    useEffect(() => {
        fetchStatusTab();
    }, [payments, usersList]);

    const isPaymentOverdue = (dueDate, paymentDate) => {
        if (paymentDate) return false;
        return new Date(dueDate) < new Date();
    };




    return (
        <>
            <style>{`
               /* 
    MAIN CONTAINER
     */
    .payments-panel-container {
        max-width: 1400px;
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
    PAYMENT STATUS CARD
     */
    .payment-status-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 16px;
        margin-bottom: 30px;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    }

    .payment-status-card h3 {
        font-size: 18px;
        margin-bottom: 15px;
        opacity: 0.9;
    }

    .payment-amount-display {
        font-size: 48px;
        font-weight: 700;
        margin: 10px 0;
    }

    .payment-status-badge {
        display: inline-block;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
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
    TABLE
     */
    .payments-table-container {
        background: white;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        overflow-x: auto;
    }

    .payments-table {
        width: 100%;
        border-collapse: collapse;
    }

    .payments-table th {
        background: #f8f9fa;
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #333;
        border-bottom: 2px solid #e0e0e0;
        white-space: nowrap;
    }

    .payments-table td {
        padding: 15px;
        border-bottom: 1px solid #f0f0f0;
    }

    .payments-table tr:hover {
        background: #f8f9fa;
    }

    .payment-row.overdue {
        background: #fff3cd;
    }

    .payment-row.paid {
        background: #d4edda;
    }

    .status-badge {
        padding: 6px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
    }

    .status-badge.paid {
        background: #d4edda;
        color: #155724;
    }

    .status-badge.unpaid {
        background: #fff3cd;
        color: #856404;
    }

    .status-badge.overdue {
        background: #f8d7da;
        color: #721c24;
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
        margin-right: 8px;
        margin-bottom: 4px;
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

    .btn-success {
        background: #4caf50;
        color: white;
    }

    .btn-success:hover {
        background: #45a049;
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
    ADMIN SECTION
     */
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
        margin-bottom: 20px;
        color: #333;
    }

    .form-container {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 12px;
        margin-top: 20px;
    }

    /* 
    STATUS GRID
     */
    .status-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .status-card {
        background: white;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s ease;
    }

    .status-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .status-card.has-debt {
        border-color: #f44336;
        background: #fff5f5;
    }

    .status-card-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 15px;
    }

    .user-name {
        font-weight: 700;
        font-size: 16px;
        color: #333;
    }

    .debt-amount {
        font-size: 24px;
        font-weight: 700;
        color: #f44336;
    }

    .debt-amount.paid {
        color: #4caf50;
    }

    /* 
    LOADING
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

    /* 
    RESPONSIVE
     */
    @media (max-width: 768px) {
        .filters-grid {
            grid-template-columns: 1fr;
        }

        .panel-header h1 {
            font-size: 24px;
        }

        .payment-amount-display {
            font-size: 36px;
        }

        .status-grid {
            grid-template-columns: 1fr;
        }

        .payments-table-container {
            padding: 20px;
        }

        .btn {
            display: block;
            width: 100%;
            margin-right: 0;
            margin-bottom: 8px;
        }
    }
            `}</style>

            <div className="payments-panel-container">
                {/* HEADER */}
                <div className="panel-header">
                    <h1><span>💳</span> Panel Płatności</h1>
                    <p>Zarządzaj płatnościami i składkami członkowskimi</p>
                </div>

                {/* STATUS CARD - tylko dla użytkownika */}
                {!isAdmin && (
                    <div className="payment-status-card">
                        <h3>💰 Twój status płatności</h3>
                        <div className="payment-amount-display">
                            {sumToPay > 0 ? `${sumToPay.toFixed(2)} zł` : '0.00 zł'}
                        </div>
                        <div className="payment-status-badge">
                            <span>
                                {sumToPay > 0 ? <FaExclamationTriangle style={{ marginRight: '5px' }} /> : <FaCheck style={{ marginRight: '5px' }} />}
                                {sumToPay > 0 ? 'Do zapłaty' : 'Wszystko opłacone!'}
                            </span>

                        </div>
                    </div>
                )}

                {/* FILTRY */}
                <div className="filters-container">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>📊 Filtruj płatności</label>
                            <select value={filter} onChange={e => setFilter(e.target.value)}>
                                <option value="all">Wszystkie płatności</option>
                                <option value="paid">Opłacone</option>
                                <option value="notPaid">Nieopłacone</option>
                                <option value="notPaidAfterDueTime">Po terminie</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>🔄 Sortuj po</label>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="paymentDate">Data płatności</option>
                                <option value="dueDate">Termin</option>
                                <option value="amount">Kwota</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>⬆️ Kolejność</label>
                            <select value={order} onChange={e => setOrder(e.target.value)}>
                                <option value="ASC">Rosnąco</option>
                                <option value="DESC">Malejąco</option>
                            </select>
                        </div>

                        {isAdmin && (
                            <div className="filter-group">
                                <label>👤 Użytkownik</label>
                                <select value={userToShowHistory} onChange={e => setUserToShowHistory(e.target.value)}>
                                    <option value="all">Wszyscy</option>
                                    {usersList.map(u => (
                                        <option key={u.userID} value={u.userID}>
                                            {u.name} {u.surname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* TABELA PŁATNOŚCI */}
                <div className="payments-table-container">
                    <h2 style={{ marginBottom: '20px' }}>📜 Historia Płatności</h2>
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p style={{ marginTop: '20px', color: '#666' }}>Ładowanie płatności...</p>
                        </div>
                    ) : payments.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            Brak płatności do wyświetlenia
                        </p>
                    ) : (
                        <table className="payments-table">
                            <thead>
                                <tr>
                                    {isAdmin && <th>👤 Użytkownik</th>}
                                    <th>📅 Data płatności</th>
                                    <th>⏰ Termin</th>
                                    <th>💵 Kwota</th>
                                    <th>📊 Status</th>
                                    {isAdmin && <th>⚙️ Opcje</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(el => {
                                    const user = usersList.find(u => u.userID === el.userID);
                                    const overdue = isPaymentOverdue(el.dueDate, el.paymentDate);

                                    return (
                                        <tr key={el.paymentID} className={`payment-row ${overdue ? 'overdue' : ''} ${el.paymentDate ? 'paid' : ''}`}>
                                            {isAdmin && (
                                                <td>{user ? `${user.name} ${user.surname}` : `ID: ${el.userID}`}</td>
                                            )}
                                            <td>{el.paymentDate ? new Date(el.paymentDate).toLocaleDateString('pl-PL') : '-'}</td>
                                            <td>{new Date(el.dueDate).toLocaleDateString('pl-PL')}</td>
                                            <td><strong>{el.amount} zł</strong></td>
                                            <td>
                                                <span className={`status-badge ${el.paymentDate ? 'paid' : overdue ? 'overdue' : 'unpaid'}`}>
                                                    {el.paymentDate ? <FaCheck style={{ marginRight: '5px', color: 'green' }} />
                                                        : overdue ? <FaTimes style={{ marginRight: '5px', color: 'red' }} />
                                                            : <FaClock style={{ marginRight: '5px', color: 'orange' }} />}
                                                    {el.paymentDate ? 'Opłacone' : overdue ? 'Po terminie' : 'Do zapłaty'}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td>
                                                    <button className="btn btn-danger" onClick={() => handleDelete(el.paymentID)}><FaTrash /></button>
                                                    <button className="btn btn-primary" onClick={() => handleEditClick(el)}><FaEdit /></button>
                                                    {!el.paymentDate && (
                                                        <button className="btn btn-success" onClick={() => handleSetPaymentToday(el.paymentID)}><FaCheck /></button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* PANEL ADMINA */}
                {isAdmin && (
                    <>
                        <div className="admin-section" id="editPayment">
                            <h2><FaCog style={{ marginRight: '5px' }} /> Dodaj Płatność</h2>
                            <button className="btn btn-primary" onClick={() => setForm(!form)}>
                                {form ? <FaTimes style={{ marginRight: '5px' }} /> : <FaPlus style={{ marginRight: '5px' }} />}
                                {form ? ' Anuluj' : ' Dodaj płatność'}
                            </button>

                            {form && (
                                <div className="form-container">
                                    <button className="btn btn-secondary" onClick={() => setPressedMultiple(!pressedMultiple)} style={{ marginBottom: '15px' }}>
                                        {pressedMultiple ? <FaUser style={{ marginRight: '5px' }}/> : <FaUsers style={{ marginRight: '5px' }}/>}
                                        {pressedMultiple ? 'Pojedyncza' : 'Dla wszystkich'}
                                    </button>

                                    <form onSubmit={pressedMultiple ? handleMultipleAdd : handleSingleAdd}>
                                        {!pressedMultiple && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <label>Wybierz użytkownika:</label>
                                                <select name="userID" required style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '8px', border: '2px solid #e0e0e0' }}>
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
                                        <button type="submit" className="btn btn-success" style={{ marginTop: '15px' }}>
                                            Dodaj {pressedMultiple ? 'płatności' : 'płatność'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {editingPayment && (
                                <div className="form-container" ref={editFormRef}>
                                    <h3>Edytowanie płatności</h3>
                                    <form onSubmit={e => {
                                        e.preventDefault();
                                        handleModifyPayment(
                                            editingValues.paymentDate,
                                            editingValues.dueDate,
                                            parseFloat(editingValues.amount),
                                            editingPayment.paymentID
                                        );
                                    }}>
                                        <PaymentForm payment={editingPayment} onChange={setEditingValues} />
                                        <button type="submit" className="btn btn-primary" style={{ marginTop: '15px', marginRight: '10px' }}>💾 Zapisz</button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setEditingPayment(null)}>❌ Anuluj</button>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* STATUSY UŻYTKOWNIKÓW */}

                        <div className="admin-section">
                            <h2><FaUsers style={{ marginRight: '5px' }}/> Statusy Płatności Użytkowników</h2>

                            {/* Dodaj informacje debugowania dla admina */}
                            {statusTab.length === 0 && (
                                <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                    Brak danych o statusach płatności
                                </p>
                            )}

                            <div className="status-grid">
                                {statusTab.map((el, idx) => {
                                    // Teraz backend zwraca wszystkie potrzebne dane!
                                    const debt = Number(el.sumToPay) || 0;
                                    const userName = `${el.name || ''} ${el.surname || ''}`.trim() || 'Nieznany użytkownik';
                                    const userEmail = el.email;

                                    return (
                                        <div key={idx} className={`status-card ${debt > 0 ? 'has-debt' : ''}`}>
                                            <div className="status-card-header">
                                                <div className="user-name">
                                                    {userName}
                                                </div>
                                                <div className={`debt-amount ${debt === 0 ? 'paid' : ''}`}>
                                                    {debt.toFixed(2)} zł
                                                </div>
                                            </div>

                                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                                                Ostatnia płatność: {el.lastPaymentDate ? new Date(el.lastPaymentDate).toLocaleDateString('pl-PL') : 'Brak'}
                                            </div>

                                            {/* Email info */}
                                            {userEmail && (
                                                <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                                                    📧 {userEmail}
                                                </div>
                                            )}

                                            {/* Przycisk przypomnienia */}
                                            {debt > 0 && (
                                                userEmail ? (
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ width: '100%' }}
                                                        onClick={() => sendReminderToUser(userEmail, debt.toFixed(2))}
                                                    >
                                                        📧 Wyślij przypomnienie
                                                    </button>
                                                ) : (
                                                    <div style={{
                                                        padding: '10px',
                                                        backgroundColor: '#fff3cd',
                                                        border: '1px solid #ffc107',
                                                        borderRadius: '8px',
                                                        fontSize: '13px',
                                                        color: '#856404',
                                                        textAlign: 'center'
                                                    }}>
                                                        ⚠️ Użytkownik nie ma przypisanego emaila
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}