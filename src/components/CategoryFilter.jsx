import { useState } from "react";
import { categories } from "../utils/categories";
import "./CategoryFilter.css";

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "all");
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  const handleMainCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId === "all" ? null : categoryId);
    setSelectedMainCategory(null);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setActiveCategory(subcategoryId);
    onCategoryChange(subcategoryId);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedMainCategory(categoryId);
  };

  const handleBackToMain = () => {
    setSelectedMainCategory(null);
  };

  const getSelectedCategoryData = () => {
    if (!selectedMainCategory) return null;
    return categories.find(cat => cat.id === selectedMainCategory);
  };

  const selectedCategoryData = getSelectedCategoryData();

  // Helyek listája (példa adatok)
  const locations = [
    { id: "zurich", name: "Zürich", count: 15 },
    { id: "genf", name: "Genf", count: 8 },
    { id: "bern", name: "Bern", count: 12 },
    { id: "basel", name: "Basel", count: 10 },
    { id: "lausanne", name: "Lausanne", count: 6 },
    { id: "luzern", name: "Luzern", count: 4 }
  ];

  return (
    <div className="category-filter">
      <div className="category-filter-container">
        {/* Kategóriák szekció */}
        <div className="filter-section">
          <div className="filter-section-header">
            <span className="filter-icon">📂</span>
            <h3 className="filter-section-title">Kategóriák</h3>
          </div>
          
          {!selectedMainCategory ? (
            <div className="filter-list">
              <label className="filter-item">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={activeCategory === "all"}
                  onChange={() => handleMainCategoryClick("all")}
                  className="filter-checkbox"
                />
                <span className="filter-label">
                  <span className="filter-name">Összes</span>
                  <span className="filter-count">({categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)})</span>
                </span>
              </label>
              
              {categories.map((category) => (
                <label key={category.id} className="filter-item">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={activeCategory === category.id}
                    onChange={() => handleCategorySelect(category.id)}
                    className="filter-checkbox"
                  />
                  <span className="filter-label">
                    <span className="filter-name">{category.name}</span>
                    <span className="filter-count">({category.subcategories.length})</span>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="subcategory-list">
              <button className="back-button" onClick={handleBackToMain}>
                ← Vissza a kategóriákhoz
              </button>
              
              <label className="filter-item">
                <input
                  type="radio"
                  name="category"
                  value={selectedCategoryData.id}
                  checked={activeCategory === selectedCategoryData.id}
                  onChange={() => handleMainCategoryClick(selectedCategoryData.id)}
                  className="filter-checkbox"
                />
                <span className="filter-label">
                  <span className="filter-name">{selectedCategoryData.name}</span>
                  <span className="filter-count">(Teljes kategória)</span>
                </span>
              </label>
              
              {selectedCategoryData.subcategories.map((subcategory) => (
                <label key={subcategory.id} className="filter-item">
                  <input
                    type="radio"
                    name="category"
                    value={subcategory.id}
                    checked={activeCategory === subcategory.id}
                    onChange={() => handleSubcategoryClick(subcategory.id)}
                    className="filter-checkbox"
                  />
                  <span className="filter-label">
                    <span className="filter-name">{subcategory.name}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Helyek szekció */}
        <div className="filter-section">
          <div className="filter-section-header">
            <span className="filter-icon">📍</span>
            <h3 className="filter-section-title">Helyszínek</h3>
          </div>
          
          <div className="filter-list">
            {locations.map((location) => (
              <label key={location.id} className="filter-item">
                <input
                  type="checkbox"
                  name="location"
                  value={location.id}
                  className="filter-checkbox"
                />
                <span className="filter-label">
                  <span className="filter-name">{location.name}</span>
                  <span className="filter-count">({location.count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 