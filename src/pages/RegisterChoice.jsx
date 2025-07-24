import { Link } from "react-router-dom";
import "./RegisterChoice.css";

export default function RegisterChoice() {
  return (
    <div className="register-choice-container">
      <div className="register-choice-card">
        <div className="register-choice-header">
          <h1 className="register-choice-title">Válaszd ki a regisztráció típusát</h1>
          <p className="register-choice-subtitle">
            Milyen szerepkörben szeretnél regisztrálni?
          </p>
        </div>

        <div className="choice-options">
          <Link to="/user-register" className="choice-option user-option">
            <div className="choice-icon">👤</div>
            <h3 className="choice-title">Felhasználó</h3>
            <p className="choice-description">
              Szolgáltatást keresek és szeretnék értékelni a szolgáltatókat
            </p>
            <ul className="choice-benefits">
              <li>✓ Szolgáltatók keresése</li>
              <li>✓ Vélemények írása</li>
              <li>✓ Értékelések megtekintése</li>
              <li>✓ Ingyenes használat</li>
            </ul>
            <div className="choice-button">Felhasználói Regisztráció</div>
          </Link>

          <Link to="/provider-register" className="choice-option provider-option">
            <div className="choice-icon">🏢</div>
            <h3 className="choice-title">Szolgáltató</h3>
            <p className="choice-description">
              Szolgáltatást nyújtok és szeretnék megjelenni a platformon
            </p>
            <ul className="choice-benefits">
              <li>✓ Profil létrehozása</li>
              <li>✓ Szolgáltatások hirdetése</li>
              <li>✓ Ügyfelek elérése</li>
              <li>✓ Vélemények kezelése</li>
            </ul>
            <div className="choice-button">Szolgáltatói Regisztráció</div>
          </Link>
        </div>

        <div className="register-choice-footer">
          <p className="login-link">
            Már van fiókod? <Link to="/login">Bejelentkezés</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 