import React, { useState, useEffect } from "react";

export default function PaymentForm({ payment, onChange }) {
    const [paymentDate, setPaymentDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        // Sprawdzenie czy płatność istnieje i wypełnienie danymi
        if (payment) {
            setPaymentDate(payment.paymentDate ? new Date(payment.paymentDate).toISOString().slice(0, 10) : "");
            setDueDate(payment.dueDate ? new Date(payment.dueDate).toISOString().slice(0, 10) : "");
            setAmount(payment.amount || "");
        }
    }, [payment]);

    useEffect(() => {
        if (onChange) {
            // Upewnij się, że przekazujesz pusty string zamiast NaN
            onChange({ 
                paymentDate: paymentDate || null,  // null zamiast pustego stringa
                dueDate, 
                amount: amount === "" ? "" : amount 
            });
        }
    }, [paymentDate, dueDate, amount, onChange]);

    return (
        <>
            {/* Formularz dodawania i edycji płatności */}
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Data dokonania płatności (opcjonalna):
                </label>
                <input
                    type="date"
                    name="paymentDate"
                    placeholder="Podaj termin zapłaty"
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: '2px solid #e0e0e0',
                        fontSize: '14px'
                    }}
                />
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                    ℹ️ Pozostaw puste dla płatności nieopłaconych
                </small>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Termin dokonania płatności: <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="date"
                    name="dueDate"
                    placeholder="Podaj termin zapłaty"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: '2px solid #e0e0e0',
                        fontSize: '14px'
                    }}
                />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Kwota do zapłaty: <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="number"
                    name="amount"
                    placeholder="Podaj kwotę do zapłaty"
                    step="0.01"
                    min="0"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)} // Przechowuj jako string!
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: '2px solid #e0e0e0',
                        fontSize: '14px'
                    }}
                />
            </div>
        </>
    );
}