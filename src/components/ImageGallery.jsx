import { useState } from "react";
import "./ImageGallery.css";

export default function ImageGallery({ images = [], maxHeight = "200px" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="image-gallery" style={{ maxHeight }}>
      <div className="gallery-container">
        <img
          src={images[currentIndex].url}
          alt={`Kép ${currentIndex + 1}`}
          className="gallery-image"
        />
        
        {/* Navigációs gombok */}
        {images.length > 1 && (
          <>
            <button
              className="gallery-nav-btn gallery-prev"
              onClick={prevImage}
              aria-label="Előző kép"
            >
              ‹
            </button>
            <button
              className="gallery-nav-btn gallery-next"
              onClick={nextImage}
              aria-label="Következő kép"
            >
              ›
            </button>
          </>
        )}
        
        {/* Kép számláló */}
        {images.length > 1 && (
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail navigáció */}
      {images.length > 1 && (
        <div className="thumbnail-container">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
              aria-label={`Kép ${index + 1}`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail-image"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 