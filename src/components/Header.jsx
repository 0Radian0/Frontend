import leftLogo from "../assets/images/lewo.jpg";
import rightLogo from "../assets/images/prawo.png";

export default function Header() {
  return (
    <header className="container" style={{ maxWidth: '75%' }}>
      
      <div className="row align-items-center py-2">

        <div className="row align-items-center">
          {/* Lewy logotyp */}
          <div className=" col-md-4 col-8">
            <div className="block-content clearfix block-logo">
              <div className="logo" title="Strona główna">
                <a href="https://szermierka.pollub.pl/">
                  <img
                    src={leftLogo}
                    alt="Klub Szermierki Historycznej przy Politechnice Lubelskiej"
                    className="img-fluid"
                    style={{ maxHeight: "90px", objectFit: "contain" }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Prawy logotyp */}
          <div className="  col-md-6 d-flex justify-content-end">
            <div className="block-content clearfix block-description">
              <a href="https://pollub.pl/">
                <img
                  src={rightLogo}
                  alt="Logo Politechniki Lubelskiej"
                  width="66"
                  height="66"
                  className="img-fluid"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
