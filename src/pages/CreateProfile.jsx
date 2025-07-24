import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CreateProfile.css";

export default function CreateProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  // Ellenőrizzük, hogy a felhasználó már rendelkezik-e szolgáltatói profillal
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) {
        setCheckingProfile(false);
        return;
      }

      try {
        const q = query(collection(db, "providers"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data();
          setExistingProfile({
            id: querySnapshot.docs[0].id,
            ...profileData
          });
        }
      } catch (err) {
        console.error("Hiba a profil ellenőrzése során:", err);
        setError("Hiba történt a profil ellenőrzése során.");
      } finally {
        setCheckingProfile(false);
      }
    };

    checkExistingProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validáció
    const requiredFields = ['name', 'category', 'description', 'city', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !form[field].trim());
    
    if (missingFields.length > 0) {
      setError("Kérjük, töltsd ki az összes kötelező mezőt!");
      setLoading(false);
      return;
    }

    // Location validáció
    if (!form.latitude || !form.longitude) {
      setError("Kérjük, add meg a földrajzi koordinátákat!");
      setLoading(false);
      return;
    }

    try {
      const providerData = {
        ...form,
        location: {
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude)
        },
        ratings: 0,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
      };

      // Töröljük a latitude és longitude mezőket, mert a location objektumban vannak
      delete providerData.latitude;
      delete providerData.longitude;

      await addDoc(collection(db, "providers"), providerData);
      
      setSuccess("Sikeresen létrehoztad a szolgáltatói profilodat!");
      setTimeout(() => {
        navigate("/dashboard", { state: { from: 'create-profile' } });
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Hiba történt a mentés során. Kérjük, próbáld újra!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="provider-form-container">
        <div className="provider-form-card">
          <p className="login-required">Bejelentkezés szükséges.</p>
        </div>
      </div>
    );
  }

  if (checkingProfile) {
    return (
      <div className="provider-form-container">
        <div className="provider-form-card">
          <p className="login-required">Profil ellenőrzése...</p>
        </div>
      </div>
    );
  }

  // Ha már van szolgáltatói profil, akkor azt jelenítjük meg
  if (existingProfile) {
    return (
      <div className="provider-form-container">
        <div className="provider-form-card">
          <h2 className="provider-form-title">
            Meglévő szolgáltatói profil
          </h2>
          
          <div className="existing-profile-info">
            <p className="profile-notice">
              Már rendelkezel egy szolgáltatói profillal. Az alábbi adatok jelennek meg a szolgáltatói listában:
            </p>
            
            <div className="profile-details">
              <div className="profile-detail">
                <strong>Vállalkozás neve:</strong> {existingProfile.name}
              </div>
              <div className="profile-detail">
                <strong>Kategória:</strong> {existingProfile.category}
              </div>
              <div className="profile-detail">
                <strong>Leírás:</strong> {existingProfile.description}
              </div>
              <div className="profile-detail">
                <strong>Város:</strong> {existingProfile.city}
              </div>
              <div className="profile-detail">
                <strong>Telefonszám:</strong> {existingProfile.phone}
              </div>
              <div className="profile-detail">
                <strong>Email:</strong> {existingProfile.email}
              </div>
              {existingProfile.website && (
                <div className="profile-detail">
                  <strong>Weboldal:</strong> {existingProfile.website}
                </div>
              )}
              <div className="profile-detail">
                <strong>Helyszín:</strong> {existingProfile.location?.latitude}, {existingProfile.location?.longitude}
              </div>
            </div>
            
            <div className="profile-actions">
              <button 
                onClick={() => navigate("/dashboard")}
                className="submit-button"
              >
                Vissza a Dashboard-ra
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ellenőrizzük, hogy minden kötelező mező ki van-e töltve
  const isFormValid = form.name.trim() && 
                     form.category.trim() && 
                     form.description.trim() && 
                     form.city.trim() && 
                     form.phone.trim() && 
                     form.email.trim() && 
                     form.latitude.trim() && 
                     form.longitude.trim();

  return (
    <div className="provider-form-container">
      <div className="provider-form-card">
        <h2 className="provider-form-title">
          Szolgáltatói profil létrehozása
        </h2>
        
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
        
        <form onSubmit={handleSubmit} className="provider-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Vállalkozás neve *
              </label>
              <input 
                name="name" 
                placeholder="pl. Kovács Fodrászat" 
                onChange={handleChange} 
                value={form.name}
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Kategória *
              </label>
              <input 
                name="category" 
                placeholder="pl. fodrász, kozmetikus, masszőr" 
                onChange={handleChange} 
                value={form.category}
                required 
                className="form-input" 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Leírás *
            </label>
            <textarea 
              name="description" 
              placeholder="Írj rövid leírást a szolgáltatásodról..." 
              onChange={handleChange} 
              value={form.description}
              required 
              rows="4"
              className="form-textarea" 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Város *
              </label>
              <input 
                name="city" 
                placeholder="pl. Budapest" 
                onChange={handleChange} 
                value={form.city}
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Telefonszám *
              </label>
              <input 
                name="phone" 
                type="tel"
                placeholder="pl. +36 20 123 4567" 
                onChange={handleChange} 
                value={form.phone}
                required 
                className="form-input" 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Email cím *
              </label>
              <input 
                name="email" 
                type="email"
                placeholder="pl. info@pelda.hu" 
                onChange={handleChange} 
                value={form.email}
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Weboldal
              </label>
              <input 
                name="website" 
                type="url"
                placeholder="pl. https://pelda.hu" 
                onChange={handleChange} 
                value={form.website}
                className="form-input" 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Szélesség (latitude) *
              </label>
              <input 
                name="latitude" 
                type="number"
                step="any"
                placeholder="pl. 47.4979" 
                onChange={handleChange} 
                value={form.latitude}
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Hosszúság (longitude) *
              </label>
              <input 
                name="longitude" 
                type="number"
                step="any"
                placeholder="pl. 19.0402" 
                onChange={handleChange} 
                value={form.longitude}
                required 
                className="form-input" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !isFormValid} 
            className="submit-button"
          >
            {loading ? "Mentés..." : "Szolgáltatói profil létrehozása"}
          </button>
        </form>
      </div>
    </div>
  );
} 