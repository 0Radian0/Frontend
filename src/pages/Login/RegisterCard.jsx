import RegisterForm from "./RegisterForm";
import { Link } from "react-router-dom";

export default function RegisterCard() {
    return (
        <div className="login-card">
            <h2 className="login-title">Załóż konto</h2>
            <p className="login-subtitle">Wprowadź dane, aby utworzyć konto</p>

            <RegisterForm />

            <p className="login-switch">
                Masz już konto?{" "}
                <Link to="/Login" className="login-link">
                    Zaloguj się
                </Link>
            </p>
        </div>
    );
}
