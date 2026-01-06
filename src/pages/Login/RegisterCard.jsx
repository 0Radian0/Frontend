import RegisterForm from "./RegisterForm";
import "./login.css";

export default function RegisterCard() {
    return (
        <div className="register-card">
          

            <h2 className="register-title">Stwórz konto</h2>
            <p className="register-subtitle">Wprowadź dane aby rozpocząć.</p>

            <RegisterForm />
        </div>
    );
}