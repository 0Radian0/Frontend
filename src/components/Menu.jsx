import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Menu() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [rankID, setRankID] = useState(Number(localStorage.getItem("rankID")));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
            setRankID(Number(localStorage.getItem("rankID")));
        }

        window.addEventListener("storage", handleStorageChange);
        handleStorageChange(); // inicjalizacja

        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setRankID(null);
        navigate("/");
    }

    return (
        <nav className="Navigation" id="menu">
            <div className="Top_menu">
                <h1 className="title">SZERMIERKA HISTORYCZNA</h1>
                <p className="subtitle">Klub przy Politechnice Lubelskiej</p>
                <ul className="desktop-menu">
                    {location.pathname === "/" && (
                        <>
                            <li><a href="https://drogamiecza.pl/hema-walki-rycerskie/">HEMA</a></li>
                            <li><a href="#reko">REKO</a></li>
                            <li><a href="#kim_jestesmy">O nas</a></li>
                            <li><a href="#map">Lokalizacja</a></li>
                            <li><a href="#treningi">Treningi</a></li>
                            <li><a href="#kontakt">Kontakt</a></li>
                        </>
                    )}
                    {isLoggedIn && location.pathname !== "/frontPage" && (
                        <li><Link to="/frontPage">Panel startowy</Link></li>

                    )}
                    {isLoggedIn && rankID === 1 && location.pathname !== "/UsersPanel" && (
                        <li><Link to="/UsersPanel">Panel użytkowników</Link></li>
                    )}

                    {!isLoggedIn && location.pathname !== "/appForm" && (
                        <li><Link to="/appForm">Formularz kontaktowy</Link></li>
                    )}

                    {isLoggedIn ? (
                        <li><button onClick={handleLogout}>Wyloguj</button></li>
                    ) : (
                        (location.pathname !== "/Login" ? <li><Link to="/Login">Logowanie</Link></li> : <></>)
                    )}

                    {location.pathname !== "/" && (
                        <li><Link to="/">Strona główna</Link></li>
                    )}
                    {isLoggedIn && location.pathname !== "/trainingsPanel" && (
                        <li><Link to="/trainingsPanel">Panel treningów</Link></li>
                    )}
                    {isLoggedIn && location.pathname !== "/payments" && (
                        <li><Link to="/payments">Płatności</Link></li>
                    )}
                </ul>
            </div>

            <div className="drop_menu">
                <button className="menu_icon"></button>
                <div className="content">
                    {location.pathname !== "/" && (
                        <li><Link to="/">Strona główna</Link></li>
                    )}
                    {isLoggedIn && location.pathname !== "/frontPage" && (
                        <li><Link to="/frontPage">Panel startowy</Link></li>

                    )}
                    {isLoggedIn && location.pathname !== "/payments" && (
                        <li><Link to="/payments">Płatności</Link></li>

                    )}
                    {isLoggedIn && rankID === 1 && location.pathname !== "/UsersPanel" && (
                        <Link to="/UsersPanel">Panel użytkowników</Link>
                    )}
                    {isLoggedIn && location.pathname !== "/trainingsPanel" && (
                        <li><Link to="/trainingsPanel">Panel treningów</Link></li>
                    )}
                    {!isLoggedIn && location.pathname !== "/appForm" && (
                        <li><Link to="/appForm">Formularz kontaktowy</Link></li>
                    )}


                    {isLoggedIn ? (
                        <button onClick={handleLogout}>Wyloguj</button>
                    ) : (
                        (location.pathname !== "/Login" ? <li><Link to="/Login">Logowanie</Link></li> : <></>)
                    )}
                </div>
            </div>
        </nav>
    );
}
