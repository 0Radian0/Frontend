import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">

          {/* Kolumna 1 */}
          <div className="col-12 col-md-6 col-xl-4 mb-4">
            <h2 className="h4 fw-bold">
              Klub Szermierki Historycznej przy Politechnice Lubelskiej
            </h2>
            <p className="mb-1">ul. Nadbystrzycka 36 C</p>
            <p>20-618 Lublin</p>
          </div>

          {/* Kolumna 2 */}
          <div className="col-12 col-md-6 col-xl-4 mb-4">
            <h2 className="h5 fw-bold">Na skróty</h2>
            <ul className="list-unstyled">
              <li><a className="text-light text-decoration-none" href="https://szermierka.pollub.pl/o-nas/kim-jestesmy">O nas</a></li>
              <li><a className="text-light text-decoration-none" href="/sport/podstawy">HEMA</a></li>
              <li><a className="text-light text-decoration-none" href="https://szermierka.pollub.pl/rekonstrukcja/podstawy-reko">Rekonstrukcja</a></li>
              <li><a className="text-light text-decoration-none" href="https://szermierka.pollub.pl/kontakt">Kontakt</a></li>
            </ul>
          </div>

          {/* Kolumna 3 */}
          <div className="col-12 col-md-6 col-xl-4 mb-4">
            <h2 className="h5 fw-bold">Linki</h2>
            <ul className="list-unstyled">
              <li>
                <a className="text-light text-decoration-none"
                   href="https://www.facebook.com/GFHLublin">
                  Facebook
                </a>
              </li>
              <li>
                <a className="text-light text-decoration-none"
                   href="https://www.instagram.com/grupa_fechtunku_historycznego?igsh=MWhrY2M1cjM4MGx5Zw==">
                  Instagram
                </a>
              </li>
              <li>
                <a className="text-light text-decoration-none"
                   href="https://pollub.pl/">
                  Pollub
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
