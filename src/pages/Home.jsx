import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "providers"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data();
          setUserProfile({
            id: querySnapshot.docs[0].id,
            ...profileData
          });
        }
      } catch (err) {
        console.error("Hiba a profil betöltése során:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section fade-in">
        <h1 className="hero-title">
          Keress megbízható magyar vállalkozókat Svájcban!
        </h1>
        <p className="hero-subtitle">
          Segítünk megtalálni a számodra legjobb szolgáltatót, egyszerűen és gyorsan.
        </p>
        
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-icon">✓</div>
            <span>100+ regisztrált szolgáltató</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon">✓</div>
            <span>Növekvő közösség</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon">✓</div>
            <span>Vélemények alapján kiemelve</span>
          </div>
        </div>

        <div className="cta-buttons">
          {user ? (
            <Link to="/szolgaltatok" className="cta-primary">
              Fedezd fel a szolgáltatókat
            </Link>
          ) : (
            <Link to="/login" className="cta-primary">
              Bejelentkezés a szolgáltatók megtekintéséhez
            </Link>
          )}
          {user && !userProfile && (
            <Link to="/create-profile" className="cta-secondary">
              Szolgáltatói profil létrehozása
            </Link>
          )}
        </div>
      </section>

      {/* How it works section */}
      <section className="how-it-works">
        <div className="how-it-works-container">
          <h2 className="section-title">Hogyan működik?</h2>
          <div className="steps-grid">
            <div className="step-card slide-in-left">
              <div className="step-icon">🔍</div>
              <h3 className="step-title">Böngéssz kategóriák között</h3>
              <p className="step-description">
                Találd meg a szolgáltatást, amire szükséged van. Keresés kategóriák szerint vagy hely szerint.
              </p>
            </div>
            <div className="step-card fade-in">
              <div className="step-icon">⭐</div>
              <h3 className="step-title">Olvasd el mások értékelését</h3>
              <p className="step-description">
                Nézd meg a valós véleményeket és értékeléseket, hogy megbízható döntést hozhass.
              </p>
            </div>
            <div className="step-card slide-in-right">
              <div className="step-icon">💬</div>
              <h3 className="step-title">Vedd fel a kapcsolatot közvetlenül</h3>
              <p className="step-description">
                Kapcsolatba léphetsz a szolgáltatóval és megbeszélheted a részleteket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us section */}
      <section className="why-choose-us">
        <div className="why-choose-us-container">
          <h2 className="section-title">Miért válaszd ezt a platformot?</h2>
          <div className="benefits-grid">
            <div className="benefit-item slide-in-left">
              <div className="benefit-icon">🛡️</div>
              <div className="benefit-content">
                <h3>Csak megbízható, értékelt szolgáltatók</h3>
                <p>Minden szolgáltatót alaposan ellenőrzünk és csak a legjobb minőségűket ajánljuk.</p>
              </div>
            </div>
            <div className="benefit-item fade-in">
              <div className="benefit-icon">🇭🇺</div>
              <div className="benefit-content">
                <h3>Magyar nyelvű kommunikáció</h3>
                <p>Anyanyelvén beszélhetsz a szolgáltatóval, így nincs nyelvi akadály.</p>
              </div>
            </div>
            <div className="benefit-item slide-in-right">
              <div className="benefit-icon">👁️</div>
              <div className="benefit-content">
                <h3>Átlátható, reklámmentes rendszer</h3>
                <p>Nincs reklám, nincs rejtett költség. Minden információ ingyenesen elérhető.</p>
              </div>
            </div>
            <div className="benefit-item slide-in-left">
              <div className="benefit-icon">💎</div>
              <div className="benefit-content">
                <h3>Ingyenes keresés felhasználóknak</h3>
                <p>Nem kell fizetned a szolgáltatók kereséséért. Teljesen ingyenes platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provider CTA section */}
      <section className="provider-cta">
        <div className="provider-cta-container">
          <h2>Vállalkozó vagy?</h2>
          <p>Regisztrálj, hogy Téged is megtaláljanak!</p>
          <Link to="/provider-register" className="cta-primary">
            Szolgáltatói regisztráció
          </Link>
        </div>
      </section>

      {/* Reviews preview section */}
      <section className="reviews-preview">
        <div className="reviews-container">
          <h2 className="section-title">Mit mondanak rólunk?</h2>
          <div className="reviews-grid">
            <div className="review-card slide-in-left">
              <p className="review-text">
                "Nagyon segítőkész volt! Végre találtam egy megbízható magyar fodrászt Zürichben."
              </p>
              <div className="review-author">Anikó</div>
              <div className="review-location">Zürich</div>
            </div>
            <div className="review-card fade-in">
              <p className="review-text">
                "Gyorsan megtaláltam a megfelelő szakembert. A platform használata egyszerű és átlátható."
              </p>
              <div className="review-author">Péter</div>
              <div className="review-location">Genf</div>
            </div>
            <div className="review-card slide-in-right">
              <p className="review-text">
                "Kiváló szolgáltatás! Magyarul kommunikálhattam és gyorsan megoldódott a problémám."
              </p>
              <div className="review-author">Mária</div>
              <div className="review-location">Bern</div>
            </div>
          </div>
        </div>
      </section>

      {/* User dashboard section (if logged in) */}
      {user && !loading && (
        <section className="how-it-works">
          <div className="how-it-works-container">
            <h2 className="section-title">Üdvözöl, {user.email}!</h2>
            {userProfile ? (
              <div className="step-card fade-in">
                <h3 className="step-title">Már rendelkezel egy szolgáltatói profillal</h3>
                <div style={{ 
                  background: '#f0fdf4', 
                  border: '1px solid #bbf7d0', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  marginBottom: '1.5rem',
                  color: '#166534'
                }}>
                  <strong>{userProfile.name}</strong> - {userProfile.city}
                </div>
                <Link to="/szolgaltatok" className="cta-primary">
                  Szolgáltatók megtekintése
                </Link>
              </div>
            ) : (
              <div className="step-card fade-in">
                <h3 className="step-title">Készen állsz a szolgáltatói profil létrehozására?</h3>
                <Link to="/create-profile" className="cta-primary">
                  Szolgáltatói profil létrehozása
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
} 