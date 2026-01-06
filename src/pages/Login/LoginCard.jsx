import LoginForm from "./LoginForm";

export default function LoginCard() {
    return (
        <div className="login-card">
            {/* Logo section */}
            

            <h2 className="login-title">Witaj</h2>
            <p className="login-subtitle">Podaj dane logowania.</p>

            <LoginForm />
        </div>
    );
}