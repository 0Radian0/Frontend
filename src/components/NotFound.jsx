import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div>
            <h2>Ups! Strona o podanym adresie nie istnieje </h2>
            <br/>
            <Link to="/">Powrót na stronę główną</Link>
        </div>
    )
}