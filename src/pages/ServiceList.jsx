import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import ProviderCard from "../components/ProviderCard";
import CategoryFilter from "../components/CategoryFilter";
import "./ServiceList.css";

export default function ServiceList() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" vagy "map"

  // Szolgáltatók betöltése Firestore-ból real-time listener-rel
  useEffect(() => {
    const providersCollection = collection(db, "providers");
    
    const unsubscribe = onSnapshot(providersCollection, (snapshot) => {
      try {
        const providersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProviders(providersList);
        setFilteredProviders(providersList);
      } catch (error) {
        console.error("Hiba a szolgáltatók betöltésekor:", error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Hiba a real-time listener-ben:", error);
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Kombinált szűrési logika
  useEffect(() => {
    let filtered = providers;

    // Kategória szűrés
    if (selectedCategory) {
      filtered = filtered.filter(provider => {
        // Ellenőrizzük a kategóriát és alkategóriát is
        const categoryMatch = provider.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                             provider.subcategory?.toLowerCase() === selectedCategory.toLowerCase();
        return categoryMatch;
      });
    }

    // Keresési szűrés
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => {
        return (
          provider.name?.toLowerCase().includes(searchLower) ||
          provider.category?.toLowerCase().includes(searchLower) ||
          provider.subcategory?.toLowerCase().includes(searchLower) ||
          provider.city?.toLowerCase().includes(searchLower) ||
          provider.description?.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredProviders(filtered);
  }, [searchTerm, selectedCategory, providers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const hasActiveFilters = searchTerm.trim() !== "" || selectedCategory !== null;

  return (
    <div className="service-list-container">
      {/* Header szekció a képen látható stílusban */}
      <div className="service-list-header">
        <div className="header-content">
          <h1 className="service-list-title">Magyar Szolgáltatók</h1>
          <p className="service-list-subtitle">
            Találd meg a megfelelő szolgáltatót a környékeden
          </p>
        </div>
        
        {/* Keresőmező a képen látható stílusban */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Keresés név, kategória vagy város alapján..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-button">
              Keresés
            </button>
          </div>
        </div>
      </div>

      {/* Fő tartalom - két oszlopos elrendezés */}
      <div className="main-content-layout">
        {/* Bal oldali szűrőpanel */}
        <div className="filter-sidebar">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Jobb oldali eredménylista */}
        <div className="results-section">
          {/* Eredmények fejléc */}
          <div className="results-header">
            <div className="results-info">
              <h3>Eredmények</h3>
              <p>{filteredProviders.length} szolgáltató találat</p>
            </div>
            <div className="results-controls">
              <button 
                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 Lista
              </button>
              <button 
                className={`view-toggle ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                🗺️ Térkép
              </button>
            </div>
          </div>

          {/* Aktív szűrők és törlés gomb */}
          {hasActiveFilters && (
            <div className="active-filters">
              <div className="filter-tags">
                {selectedCategory && (
                  <span className="filter-tag">
                    Kategória: {selectedCategory}
                    <button 
                      className="filter-remove"
                      onClick={() => setSelectedCategory(null)}
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="filter-tag">
                    Keresés: "{searchTerm}"
                    <button 
                      className="filter-remove"
                      onClick={() => setSearchTerm("")}
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <button 
                className="clear-all-filters"
                onClick={clearAllFilters}
              >
                Összes szűrő törlése
              </button>
            </div>
          )}

          {/* Szolgáltatók megjelenítése */}
          <div className="service-list-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Szolgáltatók betöltése...</p>
              </div>
            ) : filteredProviders.length > 0 ? (
              <div className="providers-grid">
                {filteredProviders.map(provider => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>Nincs találat</h3>
                <p>
                  {hasActiveFilters 
                    ? "Nem találtunk szolgáltatót a kiválasztott szűrőkre."
                    : "Még nincsenek szolgáltatók az adatbázisban."
                  }
                </p>
                {hasActiveFilters && (
                  <button 
                    className="clear-search-button"
                    onClick={clearAllFilters}
                  >
                    Szűrők törlése
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 