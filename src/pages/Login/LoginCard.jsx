import LoginForm from "./LoginForm";

export default function LoginCard() {
    return (
        <div className="login-card">
            {/* Logo section */}
            <div className="login-logo">
                <div className="login-logo-icon">
                    {/* Możesz tutaj wstawić swoje logo SVG */}
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 4L22 8V16L16 20L10 16V8L16 4Z" fill="#ffffff"/>
                        <path d="M16 12L20 14.5V22L16 24.5V17L12 14.5V22L16 24.5L20 22" fill="#ffffff"/>
                    </svg>
                </div>
            </div>

            <h2 className="login-title">Welcome back</h2>
            <p className="login-subtitle">Please enter your details.</p>

            <LoginForm />
        </div>
    );
}