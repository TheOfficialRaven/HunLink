import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Ha nincs bejelentkezett felhasználó, átirányítás
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Firestore-ból lekérjük a felhasználó adatait
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Ellenőrizzük az admin jogosultságot
          if (userData.isAdmin === true) {
            setIsAdmin(true);
            setAdminData(userData);
          } else {
            // Ha nem admin, átirányítás a főoldalra
            navigate("/");
          }
        } else {
          // Ha nincs felhasználó dokumentum, átirányítás
          navigate("/");
        }
      } catch (error) {
        console.error("Hiba az admin jogosultság ellenőrzése során:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  // Loading állapot
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Admin jogosultság ellenőrzése...</p>
      </div>
    );
  }

  // Ha nem admin, ne jelenjen meg semmi (átirányítás folyamatban)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Admin Dashboard Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">🔐 Admin Felület</h1>
            <p className="admin-subtitle">
              Üdvözöllek az admin felületen, {adminData?.displayName || user?.email}!
            </p>
          </div>
          <div className="admin-user-info">
            <div className="admin-avatar">
              {adminData?.displayName?.charAt(0) || user?.email?.charAt(0) || "A"}
            </div>
            <div className="admin-details">
              <span className="admin-name">{adminData?.displayName || "Admin"}</span>
              <span className="admin-email">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Admin Dashboard Content */}
        <div className="admin-content">
          <div className="admin-stats-grid">
            {/* Statisztika kártyák */}
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3 className="stat-number">0</h3>
                <p className="stat-label">Regisztrált felhasználók</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <h3 className="stat-number">0</h3>
                <p className="stat-label">Szolgáltatók</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3 className="stat-number">0</h3>
                <p className="stat-label">Vélemények</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3 className="stat-number">0</h3>
                <p className="stat-label">Kategóriák</p>
              </div>
            </div>
          </div>

          {/* Admin Funkciók */}
          <div className="admin-functions">
            <h2 className="functions-title">Admin Funkciók</h2>
            
            <div className="functions-grid">
              <div className="function-card">
                <div className="function-icon">👥</div>
                <h3 className="function-title">Felhasználók Kezelése</h3>
                <p className="function-description">
                  Regisztrált felhasználók megtekintése és kezelése
                </p>
                <button className="function-button" disabled>
                  Hamarosan
                </button>
              </div>

              <div className="function-card">
                <div className="function-icon">🏢</div>
                <h3 className="function-title">Szolgáltatók Moderálása</h3>
                <p className="function-description">
                  Szolgáltatói profilok jóváhagyása és kezelése
                </p>
                <button className="function-button" disabled>
                  Hamarosan
                </button>
              </div>

              <div className="function-card">
                <div className="function-icon">⭐</div>
                <h3 className="function-title">Vélemények Kezelése</h3>
                <p className="function-description">
                  Vélemények moderálása és jelentések kezelése
                </p>
                <button className="function-button" disabled>
                  Hamarosan
                </button>
              </div>

              <div className="function-card">
                <div className="function-icon">📊</div>
                <h3 className="function-title">Statisztikák</h3>
                <p className="function-description">
                  Részletes statisztikák és jelentések megtekintése
                </p>
                <button className="function-button" disabled>
                  Hamarosan
                </button>
              </div>

              <div className="function-card">
                <div className="function-icon">⚙️</div>
                <h3 className="function-title">Rendszer Beállítások</h3>
                <p className="function-description">
                  Weboldal beállítások és konfiguráció
                </p>
                <button className="function-button" disabled>
                  Hamarosan
                </button>
              </div>

              <div className="function-card">
                <div className="function-icon">🔒</div>
                <h3 className="function-title">Admin Jogosultságok</h3>
                <p className="function-description">
                  Admin jogosultságok kezelése és hozzáadása
                </p>
                <button className="function-button" disabled>
                  Hamarosan
                </button>
              </div>
            </div>
          </div>

          {/* Gyors Műveletek */}
          <div className="quick-actions">
            <h2 className="actions-title">Gyors Műveletek</h2>
            <div className="actions-buttons">
              <button className="action-button">
                📊 Statisztikák Frissítése
              </button>
              <button className="action-button">
                🔍 Jelentések Megtekintése
              </button>
              <button className="action-button">
                ⚠️ Moderálási Várakozó
              </button>
              <button className="action-button">
                📧 Rendszer Értesítések
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 