import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaEye,
  FaFont,
  FaFilter,
  FaAngleDown,
} from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";

export default function TopBar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showContrast, setShowContrast] = useState(false);

  return (
    <section
      className="colored py-0 top-header"
      style={{ backgroundColor: "rgb(0,0,0)" }}
    >
      <div className="container" style={{ maxWidth: '75%' }}>
        <div className="row align-items-center py-2">
          {/* Lewa kolumna */}
          <div className="col-xl-4 col-lg-6 col-md-6 col-12 mb-2 mb-md-0">
            <div className="block-content clearfix block-description">
              <a
                href="https://pollub.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none me-2"
              >
                Strona główna Politechniki Lubelskiej
              </a>
              <a
                href="https://szermierka.pollub.pl/panel/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none"
              >
                Panel
              </a>
            </div>
          </div>

          {/* Prawa kolumna */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-end text-white">
            {/* Ikony społecznościowe */}
            <div className="block-content me-3">
              <a
                href="https://www.facebook.com/GFHLublin"
                target="_blank"
                rel="noreferrer"
                className="text-white me-3"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/grupa_fechtunku_historycznego?igsh=MWhrY2M1cjM4MGx5Zw=="
                target="_blank"
                rel="noreferrer"
                className="text-white"
              >
                <FaInstagram />
              </a>
            </div>

            {/* Dropdown: Wyszukiwarka */}
            <div className="dropdown me-3 position-relative">
              <button
                className="btn btn-link text-white d-flex align-items-center text-decoration-none"
                type="button"
                onClick={() => setShowSearch(!showSearch)}
              >
                <IoSearchOutline size={16} />
                <span className="ms-2">
                  Wyszukaj <FaAngleDown className="ms-1" />
                </span>
              </button>

              {showSearch && (
                <div
                  className="dropdown-menu dropdown-menu-end show mt-2 p-3 text-dark"
                  style={{ minWidth: "250px" }}
                >
                  <div className="dropdown-header fw-bold">Wyszukaj</div>
                  <form action="/wyszukiwarka" method="GET">
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        name="query"
                        placeholder="Wpisz szukaną frazę"
                        required
                        minLength={3}
                        className="form-control"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary d-flex align-items-center"
                      >
                        <IoSearchOutline />
                        <span className="visually-hidden">Szukaj</span>
                      </button>
                    </div>
                  </form>
                  <a
                    href="/wyszukiwarka"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <FaFilter className="me-2" /> Wyszukiwarka zaawansowana
                  </a>
                </div>
              )}
            </div>

            {/* Dropdown: Kontrast / ustawienia */}
            <div className="dropdown position-relative">
              <button
                className="btn btn-link text-white d-flex align-items-center text-decoration-none"
                type="button"
                onClick={() => setShowContrast(!showContrast)}
              >
                <FaEye />
                <span className="ms-2 d-none d-lg-block">
                  Kontrast <FaAngleDown className="ms-1" />
                </span>
              </button>

              {showContrast && (
                <div
                  className="dropdown-menu dropdown-menu-end show mt-2 text-dark p-3"
                  style={{ minWidth: "260px" }}
                >
                  <div className="dropdown-header fw-bold">
                    Zmień rozmiar czcionki
                  </div>
                  <div className="d-flex justify-content-around py-2">
                    <button className="btn btn-outline-secondary btn-sm">
                      <FaFont />
                    </button>
                    <button className="btn btn-outline-secondary btn-sm fs-5">
                      <FaFont />
                    </button>
                    <button className="btn btn-outline-secondary btn-sm fs-4">
                      <FaFont />
                    </button>
                  </div>

                  <div className="dropdown-header fw-bold border-top pt-2">
                    Wersje kontrastowe
                  </div>
                  <div className="d-flex justify-content-around py-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      title="Domyślny"
                    >
                      <FaFont />
                    </button>
                    <button
                      className="btn btn-dark btn-sm text-white"
                      title="Biały tekst na czarnym"
                    >
                      <FaFont />
                    </button>
                    <button
                      className="btn btn-warning btn-sm text-black"
                      title="Czarny tekst na żółtym"
                    >
                      <FaFont />
                    </button>
                    <button
                      className="btn btn-dark btn-sm text-warning"
                      title="Żółty tekst na czarnym"
                    >
                      <FaFont />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
