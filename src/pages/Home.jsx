import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryBar from '../components/CategoryBar';
import EventGrid from '../components/EventGrid';
import { events } from '../data/events';

function Home({ favorites, onToggleFavorite }) {
  const navigate = useNavigate();

  // Trending Near You: 6 curated event cards
  const trendingEvents = events.slice(0, 6);

  // This Weekend: 4 event cards (e.g., events 6 to 10 or specifically weekend events)
  const weekendEvents = events
    .filter((e) => e.mood.includes('Fun') || e.mood.includes('Adventure') || e.mood.includes('Relaxed'))
    .slice(6, 10);

  return (
    <div className="page-home">
      {/* Hero Section */}
      <Hero />

      {/* Category Bar */}
      <CategoryBar />

      {/* Main Content Area */}
      <div className="home-sections-wrap">
        {/* Trending Near You */}
        <section className="section-block" aria-labelledby="trending-heading">
          <div className="section-header">
            <div>
              <div className="section-tag">🔥 Happening Soon</div>
              <h2 id="trending-heading" className="section-title">
                Trending Near You
              </h2>
              <p className="section-description">
                Popular events drawing crowds across Kolhapur and nearby cities
              </p>
            </div>
            <Link to="/events" className="btn btn-outline btn-sm view-all-link">
              View All ({events.length}) →
            </Link>
          </div>

          <EventGrid
            events={trendingEvents}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </section>

        {/* Plan My Evening CTA Banner */}
        <section className="plan-cta-section" aria-labelledby="cta-heading">
          <div className="plan-cta-card">
            <div className="plan-cta-content">
              <span className="plan-cta-sparkle">✨ LocalLoop Smart Planner</span>
              <h2 id="cta-heading" className="plan-cta-title">
                Don't know what to do tonight? Let's plan your evening.
              </h2>
              <p className="plan-cta-desc">
                Tell us your budget, your squad, and your vibe. We will stitch together a customized multi-stop itinerary with exact timings and costs!
              </p>
              <div className="plan-cta-actions">
                <button
                  type="button"
                  onClick={() => navigate('/plan')}
                  className="btn btn-primary btn-lg cta-glow-btn"
                >
                  🚀 Build My Evening Itinerary
                </button>
                <div className="plan-cta-features">
                  <span>⏱️ 2 to 6 hours</span>
                  <span>💰 Flexible budgets</span>
                  <span>🎯 Instant suggestions</span>
                </div>
              </div>
            </div>
            <div className="plan-cta-visual" aria-hidden="true">
              <div className="mock-plan-preview">
                <div className="mock-plan-time">5:30 PM</div>
                <div className="mock-plan-item">
                  <span className="mock-icon">☕</span>
                  <div>
                    <strong>Rankala Lakeside Cafe</strong>
                    <small>₹200 • Chill vibes</small>
                  </div>
                </div>
                <div className="mock-plan-divider"></div>
                <div className="mock-plan-time">7:00 PM</div>
                <div className="mock-plan-item">
                  <span className="mock-icon">🎵</span>
                  <div>
                    <strong>Sunset Acoustic Live</strong>
                    <small>₹499 • Lake Amphitheatre</small>
                  </div>
                </div>
                <div className="mock-plan-total">
                  <span>Total Planned:</span>
                  <strong>₹699</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* This Weekend */}
        <section className="section-block" aria-labelledby="weekend-heading">
          <div className="section-header">
            <div>
              <div className="section-tag">🗓️ Weekend Picks</div>
              <h2 id="weekend-heading" className="section-title">
                This Weekend
              </h2>
              <p className="section-description">
                Handpicked activities, outdoor adventures, and workshops for your days off
              </p>
            </div>
            <Link to="/events?date=This+Weekend" className="btn btn-outline btn-sm view-all-link">
              See All Weekend →
            </Link>
          </div>

          <EventGrid
            events={weekendEvents}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </section>
      </div>
    </div>
  );
}

export default Home;
