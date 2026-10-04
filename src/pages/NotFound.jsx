import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page-not-found">
      <div className="not-found-card">
        <span className="not-found-badge">404 Error</span>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          Oops! The page or event link you are trying to visit doesn't exist or may have been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            🏠 Return to Discover
          </Link>
          <Link to="/events" className="btn btn-outline">
            🎟️ Browse All Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
