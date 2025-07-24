import React from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from './ImageGallery';
import './ProviderCard.css';

const ProviderCard = ({ provider }) => {
  const handleWebsiteClick = (e) => {
    e.preventDefault();
    if (provider.website) {
      window.open(provider.website, '_blank', 'noopener,noreferrer');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half-filled">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  // Kép megjelenítése - ha vannak feltöltött képek, akkor azokat, egyébként placeholder
  const getProviderImage = () => {
    if (provider.images && provider.images.length > 0) {
      return null; // ImageGallery komponens kezeli
    }
    // Placeholder kép ha nincsenek feltöltött képek
    return `https://via.placeholder.com/200x150/7ed957/ffffff?text=${encodeURIComponent(provider.name)}`;
  };

  return (
    <div className="provider-card">
      {/* Kép szekció - bal oldalon */}
      <div className="provider-image-container">
        {provider.images && provider.images.length > 0 ? (
          <ImageGallery images={provider.images} maxHeight="200px" />
        ) : (
          <>
            <img 
              src={getProviderImage()} 
              alt={provider.name}
              className="provider-image"
            />
            <div className="provider-categories-overlay">
              <span className="provider-category">{provider.category}</span>
              {provider.subcategory && (
                <span className="provider-subcategory">{provider.subcategory}</span>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Tartalom szekció - jobb oldalon */}
      <div className="provider-content">
        <div className="provider-header">
          <h3 className="provider-name">{provider.name}</h3>
          <div className="provider-rating">
            <div className="rating-stars">
              {renderStars(provider.ratings?.average || provider.ratings)}
            </div>
            <span className="rating-text">
              {provider.ratings?.average ? `${provider.ratings.average.toFixed(1)}` : 
               provider.ratings ? `${provider.ratings.toFixed(1)}` : "Új"}
            </span>
            {provider.ratings && (
              <span className="reviews-count">
                ({provider.ratings?.count || Math.floor(Math.random() * 50) + 5} vélemény)
              </span>
            )}
          </div>
        </div>
        
        <p className="provider-description">{provider.description}</p>
        
        <div className="provider-details">
          <div className="provider-location">
            <span className="location-icon">📍</span>
            <span className="city">{provider.city}</span>
          </div>
          
          {/* Kép számláló, ha vannak képek */}
          {provider.images && provider.images.length > 0 && (
            <div className="provider-images-count">
              <span className="images-icon">📷</span>
              <span className="images-count">{provider.images.length} kép</span>
            </div>
          )}
          
          {/* Ár információ */}
          <div className="provider-price">
            <span className="price-label">Ár:</span>
            <span className="price-value">Kezdve 150 CHF-tól</span>
          </div>
        </div>
      </div>
      
      {/* Akció gombok - jobb oldalon alul */}
      <div className="provider-actions">
        {provider.website && (
          <button 
            className="website-button"
            onClick={handleWebsiteClick}
          >
            🌐 Weboldal
          </button>
        )}
        <Link to={`/szolgaltato/${provider.id}`} className="view-profile-button">
          Profil megtekintése
        </Link>
      </div>
    </div>
  );
};

export default ProviderCard; 