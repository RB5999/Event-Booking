import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import EventGrid from '../components/EventGrid';
import EmptyState from '../components/EmptyState';
import { events } from '../data/events';

function Events({ favorites, onToggleFavorite }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL parameters or defaults
  const initialSearch = searchParams.get('search') || '';
  const initialCity = searchParams.get('city') || 'All';
  const initialCategory = searchParams.get('category') || 'All';
  const initialDate = searchParams.get('date') || 'Any date';
  const initialPrice = searchParams.get('price') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState(initialPrice);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Sync state if URL searchParams change
  useEffect(() => {
    if (searchParams.get('search') !== null) {
      setSearchTerm(searchParams.get('search'));
    }
    if (searchParams.get('city') !== null) {
      setSelectedCity(searchParams.get('city'));
    }
    if (searchParams.get('category') !== null) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('date') !== null) {
      setSelectedDate(searchParams.get('date'));
    }
    if (searchParams.get('price') !== null) {
      setSelectedPrice(searchParams.get('price'));
    }
  }, [searchParams]);

  // Date helper
  const getFormattedDate = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isThisWeekend = (dateStr) => {
    const d = new Date();
    const currentDay = d.getDay(); // 0: Sun, 5: Fri, 6: Sat
    let diffToFri = 5 - currentDay;
    if (currentDay === 6) diffToFri = -1;
    if (currentDay === 0) diffToFri = -2;

    const fri = getFormattedDate(diffToFri);
    const sat = getFormattedDate(diffToFri + 1);
    const sun = getFormattedDate(diffToFri + 2);

    return dateStr === fri || dateStr === sat || dateStr === sun;
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCity !== 'All' ||
    selectedCategory !== 'All' ||
    selectedPrice !== 'All' ||
    selectedDate !== 'Any date';

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCity('All');
    setSelectedCategory('All');
    setSelectedPrice('All');
    setSelectedDate('Any date');
    setSearchParams({});
  };

  // Filter events using JavaScript array filter
  const filteredEvents = events.filter((event) => {
    // 1. Search term match (title, category, location, description)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const titleMatch = event.title.toLowerCase().includes(term);
      const categoryMatch = event.category.toLowerCase().includes(term);
      const locationMatch = event.location.toLowerCase().includes(term);
      const descMatch = event.description.toLowerCase().includes(term);

      if (!titleMatch && !categoryMatch && !locationMatch && !descMatch) {
        return false;
      }
    }

    // 2. City filter
    if (selectedCity !== 'All') {
      if (event.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
    }

    // 3. Category filter
    if (selectedCategory !== 'All') {
      if (event.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    // 4. Price filter
    if (selectedPrice !== 'All') {
      if (selectedPrice === 'Free' && event.price !== 0) return false;
      if (selectedPrice === 'Under ₹500' && (event.price === 0 || event.price >= 500)) return false;
      if (selectedPrice === '₹500–₹1,000' && (event.price < 500 || event.price > 1000)) return false;
      if (selectedPrice === '₹1,000+' && event.price <= 1000) return false;
    }

    // 5. Date filter
    if (selectedDate !== 'Any date') {
      const todayStr = getFormattedDate(0);
      const tomorrowStr = getFormattedDate(1);

      if (selectedDate === 'Today' && event.date !== todayStr) return false;
      if (selectedDate === 'Tomorrow' && event.date !== tomorrowStr) return false;
      if (selectedDate === 'This Weekend' && !isThisWeekend(event.date)) return false;
    }

    return true;
  });

  return (
    <div className="page-events">
      <div className="events-container">
        {/* Page Title & Breadcrumb Header */}
        <header className="events-header">
          <div className="events-header-text">
            <h1 className="page-title">Explore Local Events</h1>
            <p className="page-subtitle">
              Discover workshops, concerts, culinary tours, and sports near you
            </p>
          </div>
        </header>

        {/* Search Bar */}
        <div className="events-search-wrapper">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Search by title, genre, venue or keyword..."
          />
        </div>

        {/* Filter Controls Panel */}
        <FilterPanel
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPrice={selectedPrice}
          onPriceChange={setSelectedPrice}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Counter and Active Chips Bar */}
        <div className="results-status-bar">
          <div className="results-count">
            <strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event found' : 'events found'}
          </div>

          {hasActiveFilters && (
            <div className="active-filters-tags">
              {searchTerm && (
                <span className="filter-tag">
                  Keyword: "{searchTerm}"
                  <button type="button" onClick={() => setSearchTerm('')}>×</button>
                </span>
              )}
              {selectedCity !== 'All' && (
                <span className="filter-tag">
                  📍 {selectedCity}
                  <button type="button" onClick={() => setSelectedCity('All')}>×</button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="filter-tag">
                  🏷️ {selectedCategory}
                  <button type="button" onClick={() => setSelectedCategory('All')}>×</button>
                </span>
              )}
              {selectedPrice !== 'All' && (
                <span className="filter-tag">
                  💰 {selectedPrice}
                  <button type="button" onClick={() => setSelectedPrice('All')}>×</button>
                </span>
              )}
              {selectedDate !== 'Any date' && (
                <span className="filter-tag">
                  🗓️ {selectedDate}
                  <button type="button" onClick={() => setSelectedDate('Any date')}>×</button>
                </span>
              )}
              <button
                type="button"
                className="clear-all-inline-btn"
                onClick={handleClearFilters}
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Event Results Grid or Empty State */}
        {filteredEvents.length > 0 ? (
          <EventGrid
            events={filteredEvents}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        ) : (
          <EmptyState
            icon="🔎"
            title="No events found"
            message="No events match your selected criteria. Try resetting filters or searching with a different keyword."
            actionText="Clear Filters"
            onAction={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
}

export default Events;
