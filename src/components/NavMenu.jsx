import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    handleStorageChange();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRankID(null);
    navigate("/");
  }

  // Ukryj navbar na stronie logowania
  if (location.pathname === "/Login" || location.pathname === "/login" || location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  return (
    <>
      <style>{`
        /* 
           PASEK NAD MENU (SEPARATOR)
            */
        .navbar-separator {
          height: 1px;
          background: linear-gradient(to right, transparent, #d0d0d0 20%, #d0d0d0 80%, transparent);
          margin: 0 auto;
          max-width: 1400px;
        }

        /* 
           GŁÓWNY KONTENER NAVBAR
            */
        .navbar {
          background-color: rgba(254, 254, 254, 1);
          padding: 0;
          position: relative;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: center;
          align-items: stretch;
        }

        /* 
           MENU NAWIGACYJNE - Główna lista
            */
        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0;
          align-items: stretch;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: stretch;
        }

        /* 
           LINKI MENU - Rozmiar tekstu i układ
            */
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 18px 22px;
          color: #333;
          text-decoration: none;
          font-size: 15px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          white-space: nowrap;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .nav-link:hover {
          background-color: #f8f8f8;
        }

        .nav-link:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* 
           MOBILE MENU
            */
        .mobile-toggle {
          display: none;
          background: #333;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 10px 20px;
          margin: 10px;
          border-radius: 4px;
        }

        @media (max-width: 992px) {
          .mobile-toggle {
            display: block;
          }

          .navbar-container {
            flex-direction: column;
            align-items: flex-start;
          }

          .nav-menu {
            display: none;
            flex-direction: column;
            width: 100%;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .nav-menu.mobile-open {
            display: flex;
          }

          .nav-item {
            width: 100%;
          }

          .nav-link {
            width: 100%;
            padding: 15px 20px;
          }
        }
      `}</style>

      <div className="navbar-separator"></div>

      <nav className="navbar">
        <div className="navbar-container">
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            Menu
          </button>

          <ul className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Panel startowy - zawsze widoczny dla zalogowanych */}
            {isLoggedIn && (
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  to="/frontPage"
                  style={location.pathname === "/frontPage" ? { background: '#f8f8f8' } : {}}
                >
                  Panel startowy
                </Link>
              </li>
            )}

            {/* Panel treningów - tylko dla zalogowanych */}
            {isLoggedIn && location.pathname !== "/trainingsPanel" && (
              <li className="nav-item">
                <Link className="nav-link" to="/trainingsPanel">
                  Panel treningów
                </Link>
              </li>
            )}

            {/* Płatności - tylko dla zalogowanych */}
            {isLoggedIn && location.pathname !== "/payments" && (
              <li className="nav-item">
                <Link className="nav-link" to="/payments">
                  Płatności
                </Link>
              </li>
            )}

            {/* Panel użytkowników - tylko dla adminów */}
            {isLoggedIn && rankID === 1 && location.pathname !== "/UsersPanel" && (
              <li className="nav-item">
                <Link className="nav-link" to="/UsersPanel">
                  Panel użytkowników
                </Link>
              </li>
            )}

            {/* Formularz kontaktowy - tylko dla niezalogowanych */}
            {!isLoggedIn && location.pathname !== "/appForm" && (
              <li className="nav-item">
                <Link className="nav-link" to="/appForm">
                  Formularz kontaktowy
                </Link>
              </li>
            )}

            {/* Wylogowanie - zawsze widoczne dla zalogowanych */}
            {isLoggedIn && (
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                  Wyloguj
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}