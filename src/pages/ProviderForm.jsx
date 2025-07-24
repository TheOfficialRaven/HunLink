import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { categories, getAllSubcategories } from "../utils/categories";
import ImageUpload from "../components/ImageUpload";
import "./ProviderForm.css";

export default function ProviderForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    city: "",
    website: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

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
          
          // Képek betöltése, ha vannak
          if (profileData.images) {
            setImages(profileData.images);
          }
        }
      } catch (err) {
        console.error("Hiba a profil ellenőrzése során:", err);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkExistingProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Töröljük a hibát, ha a felhasználó elkezd írni
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setForm({ ...form, category: categoryId, subcategory: "" });
    
    // Alkategóriák beállítása
    if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        setAvailableSubcategories(category.subcategories);
      } else {
        setAvailableSubcategories([]);
      }
    } else {
      setAvailableSubcategories([]);
    }
    
    if (errors.category) {
      setErrors({ ...errors, category: "" });
    }
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    const subcategory = availableSubcategories.find(sub => sub.id === subcategoryId);
    const displayName = subcategory ? subcategory.name : subcategoryId;
    setForm({ ...form, subcategory: subcategoryId, category: selectedCategory });
    
    if (errors.subcategory) {
      setErrors({ ...errors, subcategory: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "A vállalkozás neve kötelező";
    }
    
    if (!form.category) {
      newErrors.category = "Kérjük, válassz kategóriát";
    }
    
    if (!form.subcategory) {
      newErrors.subcategory = "Kérjük, válassz alkategóriát";
    }
    
    if (!form.description.trim()) {
      newErrors.description = "A leírás kötelező";
    }
    
    if (!form.city.trim()) {
      newErrors.city = "A város kötelező";
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Az email cím kötelező";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Érvénytelen email cím";
    }
    
    if (form.website && !isValidUrl(form.website)) {
      newErrors.website = "Érvénytelen weboldal URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFieldLabel = (field) => {
    const labels = {
      name: "vállalkozás neve",
      category: "kategória",
      subcategory: "alkategória",
      description: "leírás",
      city: "város",
      email: "email cím"
    };
    return labels[field] || field;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const providerData = {
        ...form,
        userId: user.uid,
        userEmail: user.email,
        images: images, // Képek hozzáadása
        createdAt: serverTimestamp(),
        ratings: {
          average: 0,
          count: 0
        }
      };

      await addDoc(collection(db, "providers"), providerData);
      
      setSuccess("Sikeresen létrehoztad a szolgáltatói profilod!");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error) {
      console.error("Hiba a profil létrehozása során:", error);
      setErrors({ general: "Hiba történt a profil létrehozása során. Kérjük, próbáld újra." });
    } finally {
      setLoading(false);
    }
  };

  if (checkingProfile) {
    return (
      <div className="provider-form-container">
        <div className="provider-form-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Profil ellenőrzése...</p>
          </div>
        </div>
      </div>
    );
  }

  if (existingProfile) {
    return (
      <div className="provider-form-container">
        <div className="provider-form-card">
          <div className="existing-profile">
            <h2 className="provider-form-title">
              Már rendelkezel egy szolgáltatói profillal
            </h2>
            
            <div className="profile-details">
              <div className="profile-detail">
                <strong>Név:</strong> {existingProfile.name}
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
              {existingProfile.images && existingProfile.images.length > 0 && (
                <div className="profile-detail">
                  <strong>Képek:</strong> {existingProfile.images.length} db
                </div>
              )}
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

  return (
    <div className="provider-form-container">
      <div className="provider-form-card">
        <h2 className="provider-form-title">
          Szolgáltatói profil létrehozása
        </h2>
        
        {errors.general && (
          <div className="error-message">
            {errors.general}
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
                className={`form-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">
                Kategória *
              </label>
              <select 
                name="category" 
                onChange={handleCategoryChange} 
                value={selectedCategory}
                className={`form-input ${errors.category ? 'error' : ''}`}
              >
                <option value="">Válassz kategóriát...</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Alkategória *
              </label>
              <select 
                name="subcategory" 
                onChange={handleSubcategoryChange} 
                value={form.subcategory}
                className={`form-input ${errors.subcategory ? 'error' : ''}`}
                disabled={!selectedCategory}
              >
                <option value="">
                  {selectedCategory ? "Válassz alkategóriát..." : "Először válassz kategóriát"}
                </option>
                {availableSubcategories.map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.icon} {subcategory.name}
                  </option>
                ))}
              </select>
              {errors.subcategory && <span className="error-text">{errors.subcategory}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">
                Város *
              </label>
              <input 
                name="city" 
                placeholder="pl. Zürich" 
                onChange={handleChange} 
                value={form.city}
                className={`form-input ${errors.city ? 'error' : ''}`}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
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
              className={`form-textarea ${errors.description ? 'error' : ''}`}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
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
                Telefonszám
              </label>
              <input 
                name="phone" 
                placeholder="pl. +41 79 123 45 67" 
                onChange={handleChange} 
                value={form.phone}
                className="form-input"
              />
            </div>
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
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Weboldal
              </label>
              <input 
                name="website" 
                placeholder="pl. https://www.vallalkozas.ch" 
                onChange={handleChange} 
                value={form.website}
                className={`form-input ${errors.website ? 'error' : ''}`}
              />
              {errors.website && <span className="error-text">{errors.website}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">
                Szélesség (latitude)
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Hosszúság (longitude)
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
            <div className="form-group">
              {/* Üres mező a layout kiegyensúlyozásához */}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Profil létrehozása..." : "Profil létrehozása"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 