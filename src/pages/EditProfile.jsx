import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, query, where, getDocs, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import "./CreateProfile.css";

export default function EditProfile() {
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

  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Betöltjük a felhasználó meglévő profil adatait
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setInitialLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "providers"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data();
          setProfileId(querySnapshot.docs[0].id);
          
          // Kitöltjük a form-ot a meglévő adatokkal
          setForm({
            name: profileData.name || "",
            description: profileData.description || "",
            category: profileData.category || "",
            city: profileData.city || "",
            phone: profileData.phone || "",
            email: profileData.email || "",
            website: profileData.website || "",
            latitude: profileData.location?.latitude?.toString() || "",
            longitude: profileData.location?.longitude?.toString() || "",
          });

          // Képek betöltése, ha vannak
          if (profileData.images) {
            setImages(profileData.images);
          }
        } else {
          // Ha nincs profil, átirányítjuk a létrehozás oldalra
          navigate("/create-profile");
        }
      } catch (err) {
        console.error("Hiba a profil betöltése során:", err);
        setError("Hiba történt a profil betöltése során.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserProfile();
  }, [user, navigate]);

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
        name: form.name,
        description: form.description,
        category: form.category,
        city: form.city,
        phone: form.phone,
        email: form.email,
        website: form.website,
        images: images, // Képek hozzáadása
        location: {
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude)
        },
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, "providers", profileId), providerData);
      
      setSuccess("Sikeresen frissítetted a szolgáltatói profilodat!");
      setTimeout(() => {
        navigate("/dashboard", { state: { from: 'edit-profile' } });
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

  if (initialLoading) {
    return (
      <div className="provider-form-container">
        <div className="provider-form-card">
          <p className="login-required">Profil betöltése...</p>
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
          Szolgáltatói profil szerkesztése
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
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Kategória *
              </label>
              <input 
                name="category" 
                placeholder="pl. Szépségápolás" 
                onChange={handleChange} 
                value={form.category}
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
              rows="4"
              className="form-textarea"
            />
          </div>

          {/* Képfeltöltési komponens */}
          <ImageUpload 
            images={images}
            onImagesChange={setImages}
            maxImages={3}
          />

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Város *
              </label>
              <input 
                name="city" 
                placeholder="pl. Zürich" 
                onChange={handleChange} 
                value={form.city}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Telefonszám *
              </label>
              <input 
                name="phone" 
                placeholder="pl. +41 79 123 45 67" 
                onChange={handleChange} 
                value={form.phone}
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
                placeholder="pl. info@vallalkozas.ch" 
                onChange={handleChange} 
                value={form.email}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Weboldal
              </label>
              <input 
                name="website" 
                placeholder="pl. https://www.vallalkozas.ch" 
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
                placeholder="pl. 47.3769" 
                onChange={handleChange} 
                value={form.latitude}
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
                placeholder="pl. 8.5417" 
                onChange={handleChange} 
                value={form.longitude}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading || !isFormValid}
            >
              {loading ? "Mentés..." : "Profil mentése"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 