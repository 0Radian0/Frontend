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
        if (onChange) onChange({ paymentDate, dueDate, amount });
    }, [paymentDate, dueDate, amount, onChange]);

    return (
        <>
            {/* Formularz dodawania i edycji płatności */}
            <div>
                <label>Data dokonania płatności: </label>
                <input
                    type="date"
                    name="paymentDate"
                    placeholder="Podaj termin zapłaty"
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                />
            </div>
            <div>
                <label>Termin dokonania płatności: </label>
                <input
                    type="date"
                    name="dueDate"
                    placeholder="Podaj termin zapłaty"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                />
            </div>
            <div>
                <label>Kwota do zapłaty: </label>
                <input
                    type="number"
                    name="amount"
                    placeholder="Podaj kwotę do zapłaty"
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value))}
                ></input>
            </div>
        </>
    );
}
