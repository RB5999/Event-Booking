import { Link } from 'react-router-dom';

function MyBookingsModal({ isOpen, onClose, bookings = [] }) {
  if (!isOpen) return null;

  const handlePrintBooking = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card bookings-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="bookings-modal-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="bookings-modal-header">
          <div className="modal-icon">🎟️</div>
          <h2 id="bookings-modal-title" className="modal-title">My Booked Tickets</h2>
          <p className="modal-desc">
            Your verified registrations and passes for upcoming experiences.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bookings-empty-state">
            <span className="empty-icon-sm">🎟️</span>
            <h3>No Bookings Yet</h3>
            <p>You haven't reserved tickets for any events yet.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <article key={booking.bookingId} className="booking-item-card">
                <div className="booking-card-top">
                  <div className="booking-ref-badge">
                    Booking ID: <strong>{booking.bookingId}</strong>
                  </div>
                  <span className="booking-status-tag">{booking.paymentStatus || 'Confirmed'}</span>
                </div>

                <h3 className="booking-event-title">{booking.eventTitle}</h3>

                <div className="booking-meta-grid">
                  <div>
                    <span className="b-meta-label">Date & Time</span>
                    <span className="b-meta-val">📅 {booking.eventDate} at {booking.eventTime}</span>
                  </div>
                  <div>
                    <span className="b-meta-label">Venue</span>
                    <span className="b-meta-val">📍 {booking.location}</span>
                  </div>
                  <div>
                    <span className="b-meta-label">Tickets</span>
                    <span className="b-meta-val">👥 {booking.ticketCount} {booking.ticketCount === 1 ? 'Pass' : 'Passes'}</span>
                  </div>
                  <div>
                    <span className="b-meta-label">Total Paid</span>
                    <span className="b-meta-val b-price">
                      {booking.totalAmount === 0 ? 'Free' : `₹${booking.totalAmount}`}
                    </span>
                  </div>
                </div>

                <div className="booking-card-footer">
                  <Link
                    to={`/event/${booking.eventId}`}
                    className="btn btn-outline btn-sm"
                    onClick={onClose}
                  >
                    View Event Details
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handlePrintBooking}
                  >
                    🖨️ Print Ticket
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookingsModal;
