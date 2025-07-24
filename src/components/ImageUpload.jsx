import { useState, useRef } from "react";
import { storage } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import "./ImageUpload.css";

export default function ImageUpload({ images = [], onImagesChange, maxImages = 3 }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    if (!user) {
      setError("Kérjük, jelentkezz be a képfeltöltéshez!");
      return;
    }
    
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} képet tölthetsz fel!`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validáció
        if (!file.type.startsWith('image/')) {
          setError(`${file.name} nem képfájl!`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setError(`${file.name} túl nagy! Maximum 5MB lehet.`);
          continue;
        }

        // Egyedi fájlnév generálása
        const timestamp = Date.now();
        const fileName = `provider-images/${timestamp}-${file.name}`;
        const storageRef = ref(storage, fileName);

        try {
          // Firebase Storage feltöltés
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          uploadedImages.push({
            url: downloadURL,
            path: fileName,
            name: file.name,
            uploadedAt: new Date()
          });

          // Progress frissítése
          setUploadProgress(((i + 1) / files.length) * 100);
        } catch (uploadError) {
          console.error("Képfeltöltési hiba:", uploadError);
          
          // Részletes hibaüzenet
          if (uploadError.code === 'storage/unauthorized') {
            setError("Nincs jogosultság a képfeltöltéshez. Kérjük, jelentkezz be újra.");
          } else if (uploadError.code === 'storage/cors') {
            setError("CORS hiba: A Firebase Storage beállítások nem megfelelőek. Kérjük, ellenőrizd a Firebase Console-t.");
          } else {
            setError(`Képfeltöltési hiba: ${uploadError.message}`);
          }
          break;
        }
      }

      if (uploadedImages.length > 0) {
        // Új képek hozzáadása a meglévőkhöz
        const newImages = [...images, ...uploadedImages];
        onImagesChange(newImages);
      }

    } catch (error) {
      console.error("Hiba a képfeltöltés során:", error);
      setError("Hiba történt a képfeltöltés során! Kérjük, próbáld újra.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageDelete = async (index) => {
    const imageToDelete = images[index];
    
    try {
      // Firebase Storage-ból törlés
      const storageRef = ref(storage, imageToDelete.path);
      await deleteObject(storageRef);
      
      // Listából törlés
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      
    } catch (error) {
      console.error("Hiba a kép törlése során:", error);
      setError("Hiba történt a kép törlése során!");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const event = { target: { files } };
      handleFileSelect(event);
    }
  };

  return (
    <div className="image-upload-container">
      <label className="form-label">Képek (maximum {maxImages})</label>
      
      {/* Hibaüzenet */}
      {error && (
        <div className="upload-error">
          <p>⚠️ {error}</p>
          <button 
            onClick={() => setError("")}
            className="error-close-btn"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Képfeltöltési terület */}
      <div 
        className={`image-upload-area ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
          disabled={uploading || images.length >= maxImages}
        />
        
        {uploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p>Feltöltés... {Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📷</div>
            <p>Húzd ide a képeket vagy kattints a kiválasztáshoz</p>
            <p className="upload-hint">
              Maximum {maxImages} kép, egyenként max 5MB
            </p>
            {!user && (
              <p className="upload-warning">
                ⚠️ Jelentkezz be a képfeltöltéshez!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Feltöltött képek megjelenítése */}
      {images.length > 0 && (
        <div className="uploaded-images">
          <h4>Feltöltött képek ({images.length}/{maxImages})</h4>
          <div className="images-grid">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <img 
                  src={image.url} 
                  alt={`Kép ${index + 1}`}
                  className="uploaded-image"
                  onError={(e) => {
                    console.error("Kép betöltési hiba:", image.url);
                    e.target.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  className="delete-image-btn"
                  onClick={() => handleImageDelete(index)}
                  title="Kép törlése"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 