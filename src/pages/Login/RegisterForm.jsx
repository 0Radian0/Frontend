import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../../config/api";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const nameRegex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+){0,2}$/;
    const surnameRegex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:[-\s][A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?$/;

    if (!formData.acceptedTerms) {
      setError("Musisz zaakceptować regulamin");
      return;
    }
    if (!nameRegex.test(formData.firstName)) {
      setError("Imię musi zaczynać się wielką literą");
      return;
    }
    if (!surnameRegex.test(formData.lastName)) {
      setError("Nazwisko musi zaczynać się wielką literą");
      return;
    }
    if (formData.password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są takie same");
      return;
    }

    const payload = {
      email: formData.email,
      name: formData.firstName,
      surname: formData.lastName,
      password: formData.password
    };

    setLoading(true);

    try {
      const { data } = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => navigate("/login"), 3000);
      }

    } catch (err) {
      console.error('❌ Błąd rejestracji:', err);
      setError(err.message || "Wystąpił niespodziewany błąd");
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleRegister}>
      {/* Email field */}
      <div>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
          required
          placeholder="twoj@email.com"
        />
      </div>

      {/* Name fields row */}
      <div className="name-row">
        <div className="name-field">
          <label>Imię</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            disabled={loading}
            required
            placeholder="Jan"
          />
        </div>
        <div className="name-field">
          <label>Nazwisko</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            disabled={loading}
            required
            placeholder="Kowalski"
          />
        </div>
      </div>

      {/* Password field */}
      <div>
        <label>Hasło</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={loading}
          required
          minLength="8"
          placeholder="Co najmniej 8 znaków"
        />
      </div>

      {/* Confirm password field */}
      <div>
        <label>Powtórz hasło</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          disabled={loading}
          required
          minLength="8"
          placeholder="Powtórz hasło"
        />
      </div>

      {/* Error & Success messages */}
      {error && <p className="register-error">{error}</p>}
      {successMessage && <p className="register-success">{successMessage}. Przekierowanie...</p>}

      {/* Terms checkbox
      <div className="terms-wrapper">
        <label className="terms-checkbox">
          <input
            type="checkbox"
            checked={formData.acceptedTerms}
            onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
            disabled={loading}
          />
          <span>Przeczytałem i akceptuję regulamin</span>
        </label>
      </div> */}

      {/* Submit button */}
      <button type="submit" className="register-btn" disabled={loading}>
        {loading ? 'Rejestracja...' : 'Zarejestruj się'}
      </button>

      {/* Login link */}
      <p className="register-login-text">
        Masz już konto?{" "}
        <span
          className="register-login-link"
          onClick={() => navigate("/login")}
        >
          Zaloguj się
        </span>
      </p>
    </form>
  );
}