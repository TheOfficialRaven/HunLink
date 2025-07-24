import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import "./ReviewForm.css";

export default function ReviewForm({ providerId, providerName, onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);
  const [providerOwnerId, setProviderOwnerId] = useState(null);
  const [providerLoading, setProviderLoading] = useState(true);

  // Lekérjük a provider tulajdonosának userId-ját
  useEffect(() => {
    const fetchProviderOwner = async () => {
      if (!providerId) {
        setProviderLoading(false);
        return;
      }
      
      try {
        const providerDoc = await getDoc(doc(db, "providers", providerId));
        if (providerDoc.exists()) {
          setProviderOwnerId(providerDoc.data().userId);
        }
      } catch (err) {
        console.error("Hiba a szolgáltató tulajdonosának lekérdezésekor:", err);
      } finally {
        setProviderLoading(false);
      }
    };

    fetchProviderOwner();
  }, [providerId]);

  // Ellenőrizzük, hogy a felhasználó már értékelte-e ezt a szolgáltatót
  useEffect(() => {
    const checkExistingReview = async () => {
      if (!user || !providerId) {
        setCheckingReview(false);
        return;
      }

      try {
        const q = query(
          collection(db, "reviews"), 
          where("providerId", "==", providerId),
          where("userEmail", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setHasReviewed(true);
          const existingReview = querySnapshot.docs[0].data();
          setRating(existingReview.rating);
          setComment(existingReview.comment || "");
        }
      } catch (err) {
        console.error("Hiba a vélemény ellenőrzése során:", err);
      } finally {
        setCheckingReview(false);
      }
    };

    checkExistingReview();
  }, [user, providerId]);

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoverRating(starValue);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setComment(value);
    }
  };

  const updateProviderRating = async () => {
    try {
      // Összegyűjtjük az összes értékelést a szolgáltatóhoz
      const q = query(collection(db, "reviews"), where("providerId", "==", providerId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const reviews = querySnapshot.docs.map(doc => doc.data());
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / reviews.length) * 10) / 10; // 1 tizedesjegy
        
        // Frissítjük a szolgáltató ratings mezőjét
        const providerRef = doc(db, "providers", providerId);
        await updateDoc(providerRef, {
          ratings: averageRating
        });
      }
    } catch (err) {
      console.error("Hiba a szolgáltató értékelés frissítése során:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!user) {
      setError("Bejelentkezés szükséges az értékeléshez.");
      setLoading(false);
      return;
    }

    if (rating === 0) {
      setError("Kérjük, válassz ki egy értékelést!");
      setLoading(false);
      return;
    }

    try {
      const reviewData = {
        providerId,
        providerName,
        rating,
        comment: comment.trim(),
        userEmail: user.email,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "reviews"), reviewData);
      
      // Frissítjük a szolgáltató átlagos értékelését
      await updateProviderRating();
      
      setSuccess("Köszönjük az értékelést!");
      setHasReviewed(true);
      
      // Callback a szülő komponensnek
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // Reset form after successful submission
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      
    } catch (err) {
      console.error("Hiba a vélemény beküldése során:", err);
      setError("Hiba történt a vélemény beküldése során.");
    } finally {
      setLoading(false);
    }
  };

  // Betöltés közben
  if (providerLoading || checkingReview) {
    return (
      <div className="review-form-container">
        <div className="review-form-card">
          <div className="loading-spinner"></div>
          <p className="loading-text">Betöltés...</p>
        </div>
      </div>
    );
  }

  // Ha nincs bejelentkezve
  if (!user) {
    return (
      <div className="review-form-container">
        <div className="review-form-card">
          <h3 className="review-form-title">Értékelés írása</h3>
          <p className="review-form-message">
            Bejelentkezés szükséges az értékelés írásához.
          </p>
        </div>
      </div>
    );
  }

  // Ha a felhasználó a szolgáltató tulajdonosa
  if (user.uid === providerOwnerId) {
    return (
      <div className="review-form-container">
        <div className="review-form-card">
          <h3 className="review-form-title">Értékelés írása</h3>
          <p className="review-form-message">
            Saját szolgáltatódat nem értékelheted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <div className="review-form-card">
        <h3 className="review-form-title">
          {hasReviewed ? "Saját értékelésed" : "Értékelés írása"}
        </h3>
        
        {hasReviewed && (
          <div className="review-info">
            <p>Már értékelted ezt a szolgáltatót.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-section">
            <label className="rating-label">Értékelés *</label>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${star <= (hoverRating || rating) ? 'star-filled' : 'star-empty'}`}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  disabled={hasReviewed}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="rating-text">
              {rating > 0 ? `${rating} csillag` : "Válassz értékelést"}
            </p>
          </div>

          <div className="comment-section">
            <label className="comment-label">
              Vélemény (opcionális)
            </label>
            <textarea
              className="comment-textarea"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Írd meg a véleményedet... (max 500 karakter)"
              rows="4"
              maxLength="500"
              disabled={hasReviewed}
            />
            <div className="character-count">
              {comment.length}/500 karakter
            </div>
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          {success && (
            <div className="success-message">{success}</div>
          )}

          {!hasReviewed && (
            <button
              type="submit"
              className="submit-button"
              disabled={loading || rating === 0}
            >
              {loading ? "Beküldés..." : "Értékelés beküldése"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
} 