import { useState, useEffect, useRef } from "react";
import { FaAngleDown } from "react-icons/fa";

export default function Navbar() {
const [openMenu, setOpenMenu] = useState(null);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const navRef = useRef(null);

const toggleDropdown = (menu) => {
setOpenMenu(openMenu === menu ? null : menu);
};

// Zamknięcie dropdownu po kliknięciu poza navbar
useEffect(() => {
const handleClickOutside = (event) => {
if (navRef.current && !navRef.current.contains(event.target)) {
setOpenMenu(null);
}
};
document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

return (
<nav
ref={navRef}
className="navbar navbar-expand-lg py-0"
style={{ backgroundColor: "rgba(254, 254, 254, 1)" }}
> <div className="container-fluid ps-5 pe-5">
{/* Przycisk menu w widoku mobilnym */}
<button
className="navbar-toggler"
type="button"
onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
aria-controls="mainNav"
aria-expanded={mobileMenuOpen}
aria-label="Toggle navigation"
> <span className="navbar-toggler-icon"></span> <small className="pl-2">Menu</small> </button>

    {/* Główne menu */}
    <div className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`} id="mainNav">
      <ul className="navbar-nav mx-auto">
        {/* Strona główna */}
        <li className="nav-item">
          <a className="nav-link active" href="/">
            Strona główna
          </a>
        </li>

        {/* O nas */}
        <li className="nav-item dropdown">
          <button
            className="nav-link btn btn-link"
            onClick={() => toggleDropdown("onas")}
          >
            O nas <FaAngleDown />
          </button>
          {openMenu === "onas" && (
            <ul className="dropdown-menu show">
              <li><a className="dropdown-item" href="https://szermierka.pollub.pl/o-nas/kim-jestesmy">Kim jesteśmy</a></li>
              <li><a className="dropdown-item" href="https://szermierka.pollub.pl/o-nas/treningi">Treningi</a></li>
              <li><a className="dropdown-item" href="https://szermierka.pollub.pl/o-nas/zarzad">Zarząd Klubu</a></li>
            </ul>
          )}
        </li>

        {/* Sport */}
        <li className="nav-item dropdown">
          <button
            className="nav-link btn btn-link"
            onClick={() => toggleDropdown("sport")}
          >
            Sport <FaAngleDown />
          </button>
          {openMenu === "sport" && (
            <ul className="dropdown-menu show">
              <li className="dropdown-submenu">
                <a className="dropdown-item" href="https://szermierka.pollub.pl/sport/podstawy">Podstawy</a>
                <ul className="dropdown-menu show">
                  <li><a className="dropdown-item" href="https://szermierka.pollub.pl/sport/podstawy/praca-nog">Praca nóg</a></li>
                  <li><a className="dropdown-item" href="https://szermierka.pollub.pl/sport/podstawy/zaslony">Zasłony</a></li>
                </ul>
              </li>
              <li className="dropdown-submenu">
                <a className="dropdown-item" href="https://szermierka.pollub.pl/sport/bron">Broń</a>
                <ul className="dropdown-menu show">
                  <li><a className="dropdown-item" href="https://szermierka.pollub.pl/sport/bron/miecz">Miecz</a></li>
                  <li><a className="dropdown-item" href="https://szermierka.pollub.pl/sport/bron/szabla">Szabla</a></li>
                </ul>
              </li>
              <li><a className="dropdown-item" href="https://szermierka.pollub.pl/sport/sprzet">Sprzęt</a></li>
              <li><a className="dropdown-item" href="https://szermierka.pollub.pl/sport/zasady">Zasady</a></li>
            </ul>
          )}
        </li>

        {/* Rekonstrukcja */}
        <li className="nav-item dropdown">
          <button
            className="nav-link btn btn-link"
            onClick={() => toggleDropdown("rekonstrukcja")}
          >
            Rekonstrukcja <FaAngleDown />
          </button>
          {openMenu === "rekonstrukcja" && (
            <ul className="dropdown-menu show">
              <li><a className="dropdown-item" href="https://rycerze.com.pl/" target="_blank" rel="noopener noreferrer">Chorągiew Rycerstwa Ziemi Lubelskiej</a></li>
              <li><a className="dropdown-item" href="https://szermierka.pollub.pl/rekonstrukcja/podstawy-reko">Podstawy</a></li>
              <li className="dropdown-submenu">
                <a className="dropdown-item" href="https://szermierka.pollub.pl/rekonstrukcja/hajduk">Hajduk</a>
                <ul className="dropdown-menu show">
                  <li><a className="dropdown-item" href="https://szermierka.pollub.pl/rekonstrukcja/hajduk/hajduk-ubior">Ubiór</a></li>
                  <li><a className="dropdown-item" href="https://szermierka.pollub.pl/rekonstrukcja/hajduk/hajduk-ekwipunek">Ekwipunek</a></li>
                </ul>
              </li>
            </ul>
          )}
        </li>

        {/* Kontakt / Regulamin */}
        <li className="nav-item">
          <a className="nav-link" href="https://szermierka.pollub.pl/kontakt">Kontakt</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://szermierka.pollub.pl/regulamin">Regulamin</a>
        </li>
      </ul>
    </div>
  </div>
</nav>


);
}
