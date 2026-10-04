import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import CheckoutModal from '../components/CheckoutModal';
import fallbackImage from '../assets/images/fallback-event.svg';
import { events } from '../data/events';

function EventDetails({ favorites, onToggleFavorite, user, onAddBooking, bookings = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Find the event by ID
  const event = events.find((e) => String(e.id) === String(id));

  if (!event) {
    return (
      <div className="page-details">
        <div className="details-container not-found-block">
          <div className="empty-state">
            <span className="empty-state-icon">🎟️</span>
            <h2>Event Not Found</h2>
            <p>The event you are looking for does not exist or may have been removed.</p>
            <Link to="/events" className="btn btn-primary">
              ← Back to All Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(event.id);
  const existingBookingsForEvent = bookings.filter((b) => b.eventId === event.id);

  const formatDateFull = (dateStr) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbackImage;
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.location
  )}`;

  return (
    <div className="page-details">
      <div className="details-container">
        {/* Navigation Breadcrumb / Back button */}
        <div className="details-nav-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm back-btn"
          >
            ← Back
          </button>
          <div className="details-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/events">Events</Link>
            <span>/</span>
            <span className="current-crumb">{event.category}</span>
          </div>
        </div>

        {/* Existing Booking Notice Banner if user already has a ticket */}
        {existingBookingsForEvent.length > 0 && (
          <div className="booking-active-banner">
            <span className="banner-icon">🎟️</span>
            <div>
              <strong>You have tickets for this event!</strong>
              <p>
                Booking ID: {existingBookingsForEvent[0].bookingId} •{' '}
                {existingBookingsForEvent[0].ticketCount} {existingBookingsForEvent[0].ticketCount === 1 ? 'pass' : 'passes'} confirmed.
              </p>
            </div>
          </div>
        )}

        {/* Main Event Showcase */}
        <div className="details-layout">
          {/* Left Column: Media & Description */}
          <div className="details-main-col">
            <div className="details-image-hero">
              <img
                src={event.image}
                alt={event.title}
                className="details-large-image"
                onError={handleImageError}
              />
              <span className="details-category-badge">{event.category}</span>
            </div>

            <div className="details-header-mobile-only">
              <h1 className="details-title">{event.title}</h1>
            </div>

            {/* Event Description */}
            <div className="details-card">
              <h2 className="details-section-heading">About This Event</h2>
              <p className="details-description-text">{event.description}</p>
            </div>

            {/* Event Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="details-card">
                <h2 className="details-section-heading">Event Highlights</h2>
                <ul className="details-highlights-list">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="details-highlight-item">
                      <span className="highlight-check">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Organizer Card */}
            <div className="details-card organizer-card">
              <div className="organizer-avatar">🏢</div>
              <div className="organizer-info">
                <span className="organizer-label">Organized by</span>
                <h3 className="organizer-name">{event.organizer}</h3>
                <p className="organizer-note">
                  Verified Local Host • Serving the community
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Key Details, Booking Action & Location */}
          <aside className="details-sidebar-col">
            <div className="sidebar-action-card">
              <div className="sidebar-header">
                <div className="sidebar-price-wrap">
                  <span className="sidebar-price-label">Price</span>
                  <div className="sidebar-price-val">
                    {event.price === 0 ? 'Free Entry' : `₹${event.price}`}
                  </div>
                </div>
                <FavoriteButton
                  eventId={event.id}
                  isFavorite={isFavorite}
                  onToggleFavorite={onToggleFavorite}
                  className="favorite-btn-sidebar"
                />
              </div>

              <h1 className="details-title details-title-desktop">{event.title}</h1>

              <div className="sidebar-meta-list">
                <div className="meta-item">
                  <span className="meta-icon">🗓️</span>
                  <div>
                    <strong>Date</strong>
                    <p>{formatDateFull(event.date)}</p>
                  </div>
                </div>

                <div className="meta-item">
                  <span className="meta-icon">⏰</span>
                  <div>
                    <strong>Time</strong>
                    <p>{event.time} ({event.duration} hrs duration)</p>
                  </div>
                </div>

                <div className="meta-item">
                  <span className="meta-icon">👥</span>
                  <div>
                    <strong>Expected Attendees</strong>
                    <p>{event.attendees}+ people attending</p>
                  </div>
                </div>

                <div className="meta-item">
                  <span className="meta-icon">🎭</span>
                  <div>
                    <strong>Vibe & Mood</strong>
                    <p>{event.mood.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Get Tickets Button: Launches full Checkout & Payment Modal */}
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block get-tickets-btn"
                onClick={() => setShowCheckoutModal(true)}
              >
                🎟️ {event.price === 0 ? 'Register for Free' : 'Get Tickets & Pay'}
              </button>

              <p className="ticket-guarantee-note">
                🔒 Instant digital confirmation & E-ticket delivery
              </p>
            </div>

            {/* Location Card */}
            <div className="details-card location-card">
              <h2 className="location-card-title">Event Venue</h2>
              <div className="location-info">
                <span className="location-card-icon">📍</span>
                <div>
                  <h3 className="location-address">{event.location}</h3>
                  <p className="location-city-state">{event.city}, Maharashtra</p>
                </div>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-block view-map-btn"
              >
                🗺️ View on Map
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* Complete Interactive Checkout & Payment Flow */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        event={event}
        user={user}
        onBookingSuccess={onAddBooking}
      />
    </div>
  );
}

export default EventDetails;
