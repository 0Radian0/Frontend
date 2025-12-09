//Layout dwoch sekcji - slider ze zdjeciem oraz karta z formularzem logowania
import './login-slider.css'
import LoginSlider from "./LoginSlider";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";
import { Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();

  // Wybieramy formularz na podstawie aktualnej ścieżki
  let FormComponent;
  if (location.pathname.includes("register")) {
    FormComponent = RegisterCard;
  } else {
    FormComponent = LoginCard;
  }

  return (
    <div 
      className="login-wrapper"
      style={{ marginLeft: "15%", marginRight: "15%", height: "75vh"  }}
    >
      <div className="row">

        {/* Lewa część – slider */}
        <div className="col-md-7 login-left p-0 bg-blue">
          <LoginSlider />
        </div>

        {/* Prawa część – formularz */}
        <div className="col-md-5 login-right d-flex justify-content-center align-items-center bg-black">
          {/* Renderujemy odpowiedni formularz */}
          <FormComponent />
        </div>

      </div>
    </div>
  );
}
