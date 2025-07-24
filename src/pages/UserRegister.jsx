import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import "./UserRegister.css";

export default function UserRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validáció
    if (password !== confirmPassword) {
      setError("A jelszavak nem egyeznek!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A jelszónak legalább 6 karakter hosszúnak kell lennie!");
      setLoading(false);
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("Kérjük, töltsd ki az összes mezőt!");
      setLoading(false);
      return;
    }

    try {
      // Felhasználó létrehozása Firebase Auth-ban
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Felhasználói profil létrehozása Firestore-ban
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        userType: "user", // Felhasználó típusa
        createdAt: new Date(),
        isActive: true
      });

      setSuccess("Sikeres regisztráció! Átirányítás a főoldalra...");
      
      // Átirányítás 2 másodperc múlva
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error("Hiba a regisztráció során:", err);
      
      if (err.code === "auth/email-already-in-use") {
        setError("Ez az email cím már használatban van!");
      } else if (err.code === "auth/weak-password") {
        setError("A jelszó túl gyenge!");
      } else if (err.code === "auth/invalid-email") {
        setError("Érvénytelen email cím!");
      } else {
        setError("Hiba történt a regisztráció során. Kérjük, próbáld újra!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Felhasználói Regisztráció</h1>
          <p className="register-subtitle">
            Regisztrálj, hogy megtaláld a számodra legjobb szolgáltatókat
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              Keresztnév *
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Vezetéknév *
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email cím *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Jelszó *
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              minLength={6}
            />
            <small className="form-help">
              Legalább 6 karakter hosszú
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Jelszó megerősítése *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Regisztráció..." : "Regisztráció"}
          </button>
        </form>

        <div className="register-footer">
          <p className="login-link">
            Már van fiókod? <Link to="/login">Bejelentkezés</Link>
          </p>
          <p className="provider-link">
            Szolgáltatóként szeretnél regisztrálni? <Link to="/provider-register">Kattints ide</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 