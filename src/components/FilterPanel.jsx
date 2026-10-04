function FilterPanel({
  selectedCity,
  onCityChange,
  selectedCategory,
  onCategoryChange,
  selectedPrice,
  onPriceChange,
  selectedDate,
  onDateChange,
  onClearFilters,
  hasActiveFilters
}) {
  const cities = ['All', 'Kolhapur', 'Pune', 'Mumbai', 'Goa'];
  const categories = [
    'All',
    'Music',
    'Food',
    'Sports',
    'Art',
    'Technology',
    'Workshop',
    'Networking',
    'Entertainment'
  ];
  const priceRanges = ['All', 'Free', 'Under ₹500', '₹500–₹1,000', '₹1,000+'];
  const dates = ['Any date', 'Today', 'Tomorrow', 'This Weekend'];

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2 className="filter-heading">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            className="filter-clear-all"
            onClick={onClearFilters}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="filter-grid">
        {/* City Filter */}
        <div className="filter-group">
          <label htmlFor="filter-city" className="filter-label">
            📍 Location
          </label>
          <select
            id="filter-city"
            className="filter-select"
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === 'All' ? 'All Locations' : city}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="filter-category" className="filter-label">
            🏷️ Category
          </label>
          <select
            id="filter-category"
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="filter-group">
          <label htmlFor="filter-price" className="filter-label">
            💰 Price
          </label>
          <select
            id="filter-price"
            className="filter-select"
            value={selectedPrice}
            onChange={(e) => onPriceChange(e.target.value)}
          >
            {priceRanges.map((price) => (
              <option key={price} value={price}>
                {price === 'All' ? 'All Prices' : price}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="filter-group">
          <label htmlFor="filter-date" className="filter-label">
            🗓️ Date
          </label>
          <select
            id="filter-date"
            className="filter-select"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick category pill row for intuitive one-click filtering */}
      <div className="filter-pills-row">
        <span className="pills-label">Quick filter:</span>
        <div className="pills-container">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
