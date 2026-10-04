import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import fallbackImage from '../assets/images/fallback-event.svg';

function EventCard({ event, isFavorite, onToggleFavorite }) {
  const { id, title, category, location, city, date, time, price, image } = event;

  // Format date nicely (e.g., Sat, Oct 10)
  const formatEventDate = (dateString) => {
    try {
      const parts = dateString.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbackImage;
  };

  return (
    <article className="event-card">
      <div className="event-card-image-wrap">
        <img
          src={image}
          alt={title}
          className="event-card-image"
          onError={handleImageError}
          loading="lazy"
        />
        <span className="event-card-category">{category}</span>
        <div className="event-card-favorite">
          <FavoriteButton
            eventId={id}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
        <div className="event-card-price-badge">
          {price === 0 ? 'Free' : `₹${price}`}
        </div>
      </div>

      <div className="event-card-content">
        <div className="event-card-meta">
          <span className="event-card-date">
            📅 {formatEventDate(date)} • {time}
          </span>
        </div>

        <h3 className="event-card-title" title={title}>
          <Link to={`/event/${id}`} className="event-title-link">
            {title}
          </Link>
        </h3>

        <p className="event-card-location">
          📍 {location}
        </p>

        <div className="event-card-footer">
          <span className="event-card-city-tag">{city}</span>
          <Link to={`/event/${id}`} className="btn btn-outline btn-sm">
            View Event
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
