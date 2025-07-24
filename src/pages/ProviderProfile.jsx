import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import "./ProviderProfile.css";

export default function ProviderProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "providers"), where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const profileData = querySnapshot.docs[0].data();
        setProfile({
          id: querySnapshot.docs[0].id,
          ...profileData
        });
        setError("");
      } else {
        setProfile(null);
        setError("Nem található profil");
      }
      setLoading(false);
    }, (err) => {
      console.error("Hiba a profil betöltése során:", err);
      setError("Hiba történt a profil betöltése során.");
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [user]);

  const handleDeleteProfile = async () => {
    if (!profile) return;
    
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "providers", profile.id));
      setShowDeleteModal(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Hiba a profil törlése során:", err);
      setError("Hiba történt a profil törlése során.");
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p className="error-message">Bejelentkezés szükséges.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="loading-spinner"></div>
          <p className="loading-text">Betöltés...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">Szolgáltatói Profil</h1>
          <div className="error-message">{error}</div>
          <div className="button-group">
            <Link to="/create-profile" className="btn btn-primary">
              Profil létrehozása
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Vissza a Dashboard-ra
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">Szolgáltatói Profil</h1>
          <p className="profile-subtitle">Saját profil adatai</p>
        </div>

        {profile && (
          <div className="profile-content">
            <div className="profile-grid">
              <div className="profile-field">
                <label className="field-label">Vállalkozás neve</label>
                <div className="field-value">{profile.name}</div>
              </div>

              <div className="profile-field">
                <label className="field-label">Kategória</label>
                <div className="field-value">{profile.category}</div>
              </div>

              <div className="profile-field full-width">
                <label className="field-label">Leírás</label>
                <div className="field-value description">{profile.description}</div>
              </div>

              <div className="profile-field">
                <label className="field-label">Város</label>
                <div className="field-value">{profile.city}</div>
              </div>

              <div className="profile-field">
                <label className="field-label">Telefonszám</label>
                <div className="field-value">
                  <a href={`tel:${profile.phone}`} className="contact-link">
                    {profile.phone}
                  </a>
                </div>
              </div>

              <div className="profile-field">
                <label className="field-label">Email</label>
                <div className="field-value">
                  <a href={`mailto:${profile.email}`} className="contact-link">
                    {profile.email}
                  </a>
                </div>
              </div>

              {profile.website && (
                <div className="profile-field">
                  <label className="field-label">Weboldal</label>
                  <div className="field-value">
                    <a 
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              )}

              <div className="profile-field">
                <label className="field-label">Átlagos értékelés</label>
                <div className="field-value">
                  {profile.ratings ? (
                    <div className="rating-display">
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${star <= profile.ratings ? 'filled' : 'empty'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rating-text">
                        {profile.ratings.toFixed(1)} csillag
                      </span>
                    </div>
                  ) : (
                    "Még nincs értékelés"
                  )}
                </div>
              </div>

              {profile.location && (
                <>
                  <div className="profile-field">
                    <label className="field-label">Szélesség</label>
                    <div className="field-value">{profile.location.latitude}</div>
                  </div>
                  <div className="profile-field">
                    <label className="field-label">Hosszúság</label>
                    <div className="field-value">{profile.location.longitude}</div>
                  </div>
                </>
              )}
            </div>

            <div className="profile-actions">
              <Link to="/edit-profile" className="btn btn-primary">
                Profil szerkesztése
              </Link>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-danger"
              >
                Profil törlése
              </button>
              <Link to="/szolgaltatok" className="btn btn-secondary">
                Szolgáltatók listája
              </Link>
              <Link to="/" className="btn btn-secondary">
                Vissza a főoldalra
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Profil törlése</h3>
            <p className="modal-message">
              Biztosan törölni szeretnéd a szolgáltatói profilodat? Ez a művelet nem vonható vissza.
            </p>
            <div className="modal-actions">
              <button 
                onClick={handleDeleteProfile}
                disabled={deleting}
                className="btn btn-danger"
              >
                {deleting ? "Törlés..." : "Igen, törlöm"}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="btn btn-secondary"
              >
                Mégse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 