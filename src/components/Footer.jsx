import React from "react";

const Footer = () => {
  return (
    <>
      <style>{`
        /* 
           FOOTER - Główny kontener
            */
        .footer {
          margin-top: 100px;
          text-align: left;
          background-color: #000;
          color: #fff;
          padding: 60px 0 40px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 60px;
        }

        /* 
           KOLUMNA 1 - Informacje o klubie
            */
        .footer-column h2 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.3;
          letter-spacing: 0.3px;
          text-align: left; /* Wyrównanie do lewej */
        }

        .footer-column p {
          font-size: 15px;
          line-height: 1.6;
          margin: 8px 0;
          color: rgba(255, 255, 255, 0.8);
        }

        /* 
           KOLUMNA 2 i 3 - Linki
            */
        .footer-column h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          padding-left: 15px; /* MODYFIKUJ: Miejsce na kropki */
        }

        .footer-links li {
          margin-bottom: 10px;
          position: relative;
        }

        /* Kropki przed elementami listy */
        .footer-links li::before {
          content: "•";
          position: absolute;
          left: -15px; /* MODYFIKUJ: Odległość kropki od tekstu */
          color: rgba(255, 255, 255, 0.7);
          font-size: 18px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 15px;
          transition: color 0.2s ease;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #fff;
        }

        /* 
           RESPONSIVE - Mobile
            */
        @media (max-width: 992px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .footer {
            padding: 40px 0 30px 0;
          }

          .footer-column h2 {
            font-size: 20px;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          {/* Kolumna 1 - Informacje o klubie */}
          <div className="footer-column">
            <h2>
              Klub Szermierki Historycznej przy Politechnice Lubelskiej
            </h2>
            <p>ul. Nadbystrzycka 36 C</p>
            <p>20-618 Lublin</p>
          </div>

          {/* Kolumna 2 - Na skróty */}
          <div className="footer-column">
            <h3>Na skróty</h3>
            <ul className="footer-links">
              <li>
                <a href="https://szermierka.pollub.pl/o-nas/kim-jestesmy" >O nas</a>
              </li>
             
              <li>
                <a href="https://szermierka.pollub.pl/rekonstrukcja/podstawy-reko">Rekonstrukcja</a>
              </li>
               <li className="nav-item">
                <Link className="nav-link" to="/appForm">
                  Formularz kontaktowy
                </Link>
              </li>
              <li>
                <a href="https://szermierka.pollub.pl/kontakt">Kontakt</a>
              </li>
            </ul>
          </div>

          {/* Kolumna 3 - Linki */}
          <div className="footer-column">
            <h3>Linki</h3>
            <ul className="footer-links">
              <li>
                <a 
                  href="https://www.facebook.com/GFHLublin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/grupa_fechtunku_historycznego?igsh=MWhrY2M1cjM4MGx5Zw=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://pollub.pl/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pollub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;