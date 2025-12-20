import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <>
      <style>{`
        /* ============================================
           PASEK NAD MENU (SEPARATOR)
           ============================================ */
        .navbar-separator {
          height: 1px;
          background: linear-gradient(to right, transparent, #d0d0d0 20%, #d0d0d0 80%, transparent);
          margin: 0 auto;
          max-width: 1400px;
        }

        /* ============================================
           GŁÓWNY KONTENER NAVBAR
           ============================================ */
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

        /* ============================================
           MENU NAWIGACYJNE - Główna lista
           ============================================ */
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

        /* ============================================
           LINKI MENU - Rozmiar tekstu i układ
           MODYFIKUJ TUTAJ: font-size, padding, letter-spacing
           ============================================ */
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px; /* Odstęp między tekstem a strzałką */
          padding: 18px 22px; /* MODYFIKUJ: góra/dół lewo/prawo */
          color: #333;
          text-decoration: none;
          font-size: 15px; /* MODYFIKUJ: rozmiar czcionki menu */
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.3px; /* MODYFIKUJ: odstępy między literami */
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          white-space: nowrap;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          position: relative;
        }

        /* Animowana linia pod przyciskiem menu */
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 3px;
          background-color: #333;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-item.active .nav-link::after {
          width: 100%;
        }

        /* Strzałka dropdown */
        .nav-link svg {
          font-size: 12px; /* MODYFIKUJ: rozmiar strzałki */
          transition: transform 0.3s ease;
        }

        .nav-item:hover .nav-link svg,
        .nav-item.active .nav-link svg {
          transform: rotate(180deg);
        }

        /* ============================================
           DROPDOWN MENU - Rozwijane podmenu
           ============================================ */
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e0e0e0;
          border-top: none;
          list-style: none;
          padding: 15px 20px; /* MODYFIKUJ: padding wewnętrzny dropdown */
          margin: 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease;
          z-index: 1000;
          display: flex; /* Elementy obok siebie */
          flex-direction: row; /* Poziomo */
          gap: 30px; /* MODYFIKUJ: odstęp między elementami */
          white-space: nowrap;
        }

        /* Pokazanie dropdown przy hover lub active */
        .nav-item:hover > .dropdown-menu,
        .nav-item.active > .dropdown-menu {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
          display: block;
        }

        /* ============================================
           ELEMENTY DROPDOWN - Rozmiar i układ
           MODYFIKUJ TUTAJ: font-size elementów w dropdown
           ============================================ */
        .dropdown-item {
          display: block;
          padding: 8px 0; /* MODYFIKUJ: padding elementów dropdown */
          color: #333;
          text-decoration: none;
          font-size: 14px; /* MODYFIKUJ: rozmiar tekstu w dropdown */
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: background-color 0.2s ease;
          position: relative;
          border: none;
          white-space: nowrap;
        }

        /* Podkreślenie przy hover (bez animacji) */
        .dropdown-item::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 0;
          right: 0;
          height: 1px;
          background-color: #333;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .dropdown-item:hover::after {
          opacity: 1;
        }

        .dropdown-item:hover {
          background-color: transparent;
        }

        /* ============================================
           ZAGNIEŻDŻONE DROPDOWN (submenu)
           ============================================ */
        .dropdown-submenu {
          position: relative;
        }

        .dropdown-submenu > .dropdown-menu {
          left: 100%;
          top: -8px;
          border-left: 1px solid #e0e0e0;
        }

        .dropdown-submenu:hover > .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        /* Strzałka wskazująca na submenu */
        .dropdown-submenu > .dropdown-item::before {
          content: "→";
          float: right;
          margin-left: 10px;
          font-size: 12px;
        }

        /* Usunięcie podkreślenia dla submenu parent */
        .dropdown-submenu > .dropdown-item::after {
          display: none;
        }

        /* ============================================
           MOBILE MENU - Responsive
           ============================================ */
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

          .nav-link::after {
            display: none;
          }

          .dropdown-menu {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            box-shadow: none;
            border: none;
            border-left: 3px solid #e0e0e0;
            margin-left: 15px;
            display: none;
          }

          .nav-item:hover > .dropdown-menu,
          .nav-item.active > .dropdown-menu,
          .dropdown-submenu:hover > .dropdown-menu {
            display: block;
          }

          .dropdown-submenu > .dropdown-menu {
            left: 0;
            margin-left: 30px;
          }

          .dropdown-item::after {
            display: none;
          }
        }
      `}</style>

      {/* Pasek separujący nad menu */}
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
            {/* Strona główna */}
            <li className="nav-item">
              <a className="nav-link" href="/">
                Strona główna
              </a>
            </li>

            {/* O nas - Z DROPDOWN */}
            <li 
              className={`nav-item ${activeDropdown === 'onas' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('onas')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link">
                O nas <FaAngleDown />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="/o-nas/kim-jestesmy">
                    Kim jesteśmy
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/o-nas/treningi">
                    Treningi
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/o-nas/zarzad">
                    Zarząd Klubu
                  </a>
                </li>
              </ul>
            </li>

            {/* Szermierka - Z DROPDOWN */}
            <li 
              className={`nav-item ${activeDropdown === 'szermierka' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('szermierka')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link">
                Szermierka <FaAngleDown />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="/szermierka/wprowadzenie">
                    Wprowadzenie
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/szermierka/bron">
                    Broń
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/szermierka/sprzet">
                    Sprzęt
                  </a>
                </li>
              </ul>
            </li>

            {/* Rekonstrukcja - Z DROPDOWN I SUBMENU */}
            <li 
              className={`nav-item ${activeDropdown === 'rekonstrukcja' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('rekonstrukcja')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link">
                Rekonstrukcja <FaAngleDown />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a 
                    className="dropdown-item" 
                    href="https://rycerze.com.pl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Stowarzyszeniem Chorągiew Rycerstwa Ziemi Lubelskiej
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/rekonstrukcja/podstawy-reko">
                    Podstawy
                  </a>
                </li>
                <li className="dropdown-submenu">
                  <a className="dropdown-item" href="/rekonstrukcja/hajduk">
                    Hajduk
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/rekonstrukcja/hajduk/hajduk-ubior">
                        Ubiór
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/rekonstrukcja/hajduk/hajduk-ekwipunek">
                        Ekwipunek
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Kontakt */}
            <li className="nav-item">
              <a className="nav-link" href="/kontakt">
                Kontakt
              </a>
            </li>

            {/* Regulamin */}
            <li className="nav-item">
              <a className="nav-link" href="/regulamin">
                Regulamin
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}