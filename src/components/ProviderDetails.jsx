import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit, onSnapshot } from "firebase/firestore";
import ReviewForm from "./ReviewForm";
import ImageGallery from "./ImageGallery";
import "./ProviderDetails.css";

export default function ProviderDetails() {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!providerId) {
      setError("Hiányzó szolgáltató azonosító");
      setLoading(false);
      return;
    }

    // Real-time listener a szolgáltató adatokhoz
    const providerRef = doc(db, "providers", providerId);
    const unsubscribeProvider = onSnapshot(providerRef, (doc) => {
      if (!doc.exists()) {
        setError("A szolgáltató nem található");
        setLoading(false);
        return;
      }

      const providerData = doc.data();
      setProvider({
        id: doc.id,
        ...providerData
      });
      setLoading(false);
    }, (err) => {
      console.error("Hiba a szolgáltató betöltése során:", err);
      setError("Hiba történt az adatok betöltése során");
      setLoading(false);
    });

    // Real-time listener a véleményekhez
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("providerId", "==", providerId),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    
    const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setReviews(reviewsData);
    }, (err) => {
      console.error("Hiba a vélemények betöltése során:", err);
    });

    // Cleanup function
    return () => {
      unsubscribeProvider();
      unsubscribeReviews();
    };
  }, [providerId]);

  const handleReviewSubmitted = () => {
    // A real-time listener automatikusan frissíti az adatokat
    // Ez a függvény most már nem szükséges, de megtartjuk a kompatibilitás miatt
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="provider-details-container">
        <div className="provider-details-card">
          <div className="loading-spinner"></div>
          <p className="loading-text">Betöltés...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="provider-details-container">
        <div className="provider-details-card">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="provider-details-container">
        <div className="provider-details-card">
          <div className="error-message">A szolgáltató nem található</div>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-details-container">
      <div className="provider-details-card">
        <div className="provider-header">
          <div className="provider-info">
            <h1 className="provider-name">{provider.name}</h1>
            <div className="provider-categories">
              <span className="provider-category">{provider.category}</span>
              {provider.subcategory && (
                <span className="provider-subcategory">{provider.subcategory}</span>
              )}
            </div>
            <div className="provider-location">
              <span className="location-icon">📍</span>
              <span className="city">{provider.city}</span>
            </div>
          </div>
          
          <div className="provider-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < (provider.ratings?.average || 0) ? 'filled' : 'empty'}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="rating-text">
              {provider.ratings?.average ? `${provider.ratings.average.toFixed(1)}` : "Új"}
            </span>
            {provider.ratings?.count && (
              <span className="reviews-count">({provider.ratings.count} vélemény)</span>
            )}
          </div>
        </div>

        {/* Képgaléria */}
        {provider.images && provider.images.length > 0 && (
          <div className="provider-images-section">
            <h3>Képek</h3>
            <ImageGallery images={provider.images} maxHeight="300px" />
          </div>
        )}

        <div className="provider-description">
          <h3>Leírás</h3>
          <p>{provider.description}</p>
        </div>

        <div className="provider-contact">
          <h3>Kapcsolat</h3>
          <div className="contact-info">
            {provider.phone && (
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span className="contact-text">{provider.phone}</span>
              </div>
            )}
            {provider.email && (
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span className="contact-text">{provider.email}</span>
              </div>
            )}
            {provider.website && (
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <a 
                  href={provider.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  {provider.website}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="provider-reviews">
          <h3>Vélemények</h3>
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < review.rating ? 'filled' : 'empty'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="review-text">{review.comment}</p>
                  <div className="review-author">
                    <span className="author-name">{review.userName}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">Még nincsenek vélemények. Legyél az első!</p>
          )}
          
          <ReviewForm 
            providerId={providerId} 
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      </div>
    </div>
  );
} 