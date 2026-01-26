import leftLogo from "../assets/images/lewo.jpg";
import rightLogo from "../assets/images/logo_politechniki_lubelskiej.jpg";

export default function Header() {
  return (
    <header className="container" style={{ maxWidth: "75%" }}>
      <div className="row align-items-center py-2">

        <div className="row align-items-center w-100">
          
          {/* Lewy logotyp */}
          <div className="col-6 col-md-4 d-flex align-items-center">
            <a href="https://szermierka.pollub.pl/">
              <img
                src={leftLogo}
                alt="Klub Szermierki Historycznej przy Politechnice Lubelskiej"
                className="img-fluid"
                style={{ maxHeight: "75px", objectFit: "contain" }}
              />
            </a>
          </div>

          {/* Prawy logotyp */}
          <div className="col-6 col-md-6 d-flex justify-content-end align-items-center">
            <a href="https://szermierka.pollub.pl/">
              <img
                src={rightLogo}
                alt="Logo Politechniki Lubelskiej"
                width="66"
                height="66"
                className="img-fluid"
                style={{ maxHeight: "75px", objectFit: "contain" }}
              />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
