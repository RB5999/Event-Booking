import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    if (selectedCity && selectedCity !== 'All') {
      params.set('city', selectedCity);
    }
    navigate(`/events?${params.toString()}`);
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay-glow"></div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>Your Hyperlocal Cultural Compass</span>
          </div>

          <h1 className="hero-title">
            Discover What's Happening Around You
          </h1>

          <p className="hero-description">
            Find concerts, food festivals, workshops, sports, meetups and more happening near you.
          </p>

          {/* Search and Location Form */}
          <form className="hero-search-card" onSubmit={handleSearchSubmit}>
            <div className="hero-search-field">
              <span className="hero-field-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder="What do you want to experience?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hero-input"
                aria-label="Event search"
              />
            </div>

            <div className="hero-search-divider" aria-hidden="true"></div>

            <div className="hero-search-field hero-city-field">
              <span className="hero-field-icon" aria-hidden="true">📍</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="hero-city-select"
                aria-label="Select City"
              >
                <option value="All">All Cities</option>
                <option value="Kolhapur">Kolhapur</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Goa">Goa</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary hero-submit-btn">
              Search Events
            </button>
          </form>

          <div className="hero-actions">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="btn btn-primary btn-lg"
            >
              Explore Events
            </button>
            <button
              type="button"
              onClick={() => navigate('/plan')}
              className="btn btn-ghost btn-lg"
            >
              ✨ Plan My Evening
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="stat-number">24+</span>
              <span className="stat-label">Handpicked Events</span>
            </div>
            <div className="hero-stat-separator"></div>
            <div className="hero-stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Regional Hubs</span>
            </div>
            <div className="hero-stat-separator"></div>
            <div className="hero-stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Verified Organizers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
