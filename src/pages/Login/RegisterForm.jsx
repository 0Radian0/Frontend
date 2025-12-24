import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../../config/api"; // ✅ Import API config

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

    // Walidacja
    if (!formData.acceptedTerms) {
      setError("Musisz zaakceptować regulamin");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są takie same");
      return;
    }

    // Przygotowanie danych do backendu
    const payload = {

      email: formData.email,
      name: formData.firstName,
      surname: formData.lastName,
      password: formData.password
    };

    setLoading(true);

    try {
      // ✅ Używamy fetchAPI zamiast hardcoded URL
      const { data } = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (data.success) {
        setSuccessMessage(data.message);
        // Przekierowanie po 3 sekundach
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

      <label>Email</label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        disabled={loading}
        required
        placeholder="Wprowadź email"
      />

      <div className="name-row">
        <div className="name-field">
          <label>Imię</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            disabled={loading}
            required
            placeholder="Imię"
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
            placeholder="Nazwisko"
          />
        </div>
      </div>

      <label>Hasło</label>
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        disabled={loading}
        required
        placeholder="Hasło"
      />

      <label>Powtórz hasło</label>
      <input
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        disabled={loading}
        required
        placeholder="Powtórz hasło"
      />

      {error && <p className="register-error">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}. Przekierowanie...</p>}

      <div className="register-actions">
        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? 'Rejestracja...' : 'Zarejestruj się'}  
        </button>
        <label className="terms-label">
          <input
            type="checkbox"
            checked={formData.acceptedTerms}
            onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
            disabled={loading}
          />
          Przeczytałem i akceptuję regulamin
        </label>
      </div>
    </form>
  );
}