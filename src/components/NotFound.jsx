import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div>
            <h1><FaExclamationTriangle style={{ color: '#293d3d', marginRight: '5px' }} /></h1>
            <h2>Ups! Strona o podanym adresie nie istnieje </h2>
            <br />
            <Link to="/">Powrót na stronę główną</Link>
        </div>
    )
}