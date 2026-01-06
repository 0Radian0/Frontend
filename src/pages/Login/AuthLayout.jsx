import LoginSlider from "./LoginSlider";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";
import { useLocation } from "react-router-dom";

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
    <div className="auth-layout-wrapper">
      <div className="auth-layout-container">
        {/* Lewa część – slider */}
        <div className="auth-slider-section">
          <LoginSlider />
        </div>

        {/* Prawa część – formularz */}
        <div className="auth-form-section">
          <FormComponent />
        </div>
      </div>
    </div>
  );
}