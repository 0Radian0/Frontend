import LoginForm from "./LoginForm";

export default function LoginCard() {
    return (
        <div className="login-card">
            <h2 className="login-title">Zaloguj się</h2>
            <p className="login-subtitle">Wprowadź dane, aby uzyskać dostęp</p>

            <LoginForm />
        </div>
    );
}
