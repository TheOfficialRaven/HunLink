import React, { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import './MapView.css';

const MapView = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Magyarország középpont (Budapest)
  const center = {
    lat: 47.4979,
    lng: 19.0402
  };

  const mapContainerStyle = {
    width: '100%',
    height: '70vh'
  };

  // Szolgáltatók betöltése Firestore-ból
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providersCollection = collection(db, "providers");
        const providersSnapshot = await getDocs(providersCollection);
        const providersList = providersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Csak azok a szolgáltatók, akiknek van location adata
        const providersWithLocation = providersList.filter(provider => 
          provider.location && 
          provider.location.latitude && 
          provider.location.longitude
        );
        
        setProviders(providersWithLocation);
      } catch (error) {
        console.error("Hiba a szolgáltatók betöltésekor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleMarkerClick = (provider) => {
    setSelectedProvider(provider);
  };

  const handleInfoWindowClose = () => {
    setSelectedProvider(null);
  };

  if (loading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Térkép betöltése...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h2>Szolgáltatók térképen</h2>
        <p>{providers.length} szolgáltató található a térképen</p>
      </div>

      {/* Ideiglenes térkép komponens - Google Maps API kulcs szükséges */}
      <div className="temporary-map">
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          <h3>Google Maps térkép</h3>
          <p>Google Maps API kulcs szükséges a térkép megjelenítéséhez</p>
          <div className="api-key-info">
            <p><strong>Hogyan állítsd be:</strong></p>
            <ol>
              <li>Hozz létre egy Google Cloud projektet</li>
              <li>Engedélyezd a Maps JavaScript API-t</li>
              <li>Hozz létre egy API kulcsot</li>
              <li>Add hozzá a .env fájlhoz: VITE_GOOGLE_MAPS_API_KEY=your_key_here</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Szolgáltatók listája */}
      {providers.length > 0 && (
        <div className="providers-list">
          <h3>Szolgáltatók listája</h3>
          <div className="providers-grid">
            {providers.map((provider) => (
              <div key={provider.id} className="provider-item">
                <h4>{provider.name}</h4>
                <div className="category-info">
                  <p className="category">{provider.category}</p>
                  {provider.subcategory && (
                    <p className="subcategory">{provider.subcategory}</p>
                  )}
                </div>
                <p className="location">📍 {provider.city}</p>
                {provider.description && (
                  <p className="description">{provider.description}</p>
                )}
                {provider.website && (
                  <a 
                    href={provider.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="website-link"
                  >
                    🌐 Weboldal megtekintése
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {providers.length === 0 && !loading && (
        <div className="no-providers">
          <p>Nincsenek szolgáltatók a térképen</p>
          <p className="subtitle">A szolgáltatók megjelennek, amint hozzáadnak location adatokat</p>
        </div>
      )}
    </div>
  );
};

export default MapView; 