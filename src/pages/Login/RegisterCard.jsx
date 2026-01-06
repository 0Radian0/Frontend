import RegisterForm from "./RegisterForm";

export default function RegisterCard() {
    return (
        <div className="register-card">
            {/* Logo section */}
            <div className="register-logo">
                <div className="register-logo-icon">
                    {/* Logo SVG - takie samo jak w login */}
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 4L22 8V16L16 20L10 16V8L16 4Z" fill="#ffffff"/>
                        <path d="M16 12L20 14.5V22L16 24.5V17L12 14.5V22L16 24.5L20 22" fill="#ffffff"/>
                    </svg>
                </div>
            </div>

            <h2 className="register-title">Create an account</h2>
            <p className="register-subtitle">Enter your details to get started.</p>

            <RegisterForm />
        </div>
    );
}