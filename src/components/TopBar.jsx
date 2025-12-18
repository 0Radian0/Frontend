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
          </div>
        </div>
      </div>
    </section>
  );
}
