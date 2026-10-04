import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <span className="brand-icon-wrap">
                <svg
                  className="brand-logo-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                  <path d="M8 12a4 4 0 0 1 8 0" strokeDasharray="2 2" />
                </svg>
              </span>
              <span className="brand-text">
                Local<span className="brand-highlight">Loop</span>
              </span>
            </Link>
            <p className="footer-tagline">
              "Discover what's happening around you."
            </p>
            <p className="footer-about">
              Curated local experiences, live music, culinary tours, workshops, and sports across Maharashtra and Goa.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-link-list">
              <li><Link to="/">Discover</Link></li>
              <li><Link to="/events">All Events</Link></li>
              <li><Link to="/plan">Plan My Evening</Link></li>
              <li><Link to="/favorites">My Favorites</Link></li>
              <li><Link to="/admin">🛡️ Admin Portal</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Featured Cities</h4>
            <ul className="footer-link-list">
              <li><Link to="/events?city=Kolhapur">Kolhapur</Link></li>
              <li><Link to="/events?city=Pune">Pune</Link></li>
              <li><Link to="/events?city=Mumbai">Mumbai</Link></li>
              <li><Link to="/events?city=Goa">Goa</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-link-list">
              <li><Link to="/events?category=Music">Music & Concerts</Link></li>
              <li><Link to="/events?category=Food">Food & Drinks</Link></li>
              <li><Link to="/events?category=Art">Art & Exhibitions</Link></li>
              <li><Link to="/events?category=Technology">Tech & Hackathons</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LocalLoop. Built for local discovery with React & Vite.</p>
          <div className="footer-badges">
            <span className="footer-city-badge">📍 Maharashtra & Goa</span>
            <span className="footer-status-badge">⚡ Realtime Discovery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
