import { useState, useEffect } from 'react';

function CheckoutModal({ isOpen, onClose, event, user, onBookingSuccess }) {
  // Steps: 'details' -> 'payment' -> 'confirmed'
  const [step, setStep] = useState('details');
  const [ticketCount, setTicketCount] = useState(1);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [error, setError] = useState('');

  // Prefill details when user is logged in or modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setTicketCount(1);
      setError('');
      setIsProcessing(false);
      setConfirmedBooking(null);
      if (user) {
        setAttendeeName(user.name || '');
        setAttendeeEmail(user.email || '');
      } else {
        setAttendeeName('');
        setAttendeeEmail('');
      }
      setAttendeePhone('+91 98220 12345');
    }
  }, [isOpen, user]);

  if (!isOpen || !event) return null;

  const isFree = event.price === 0;
  const subtotal = event.price * ticketCount;
  const convenienceFee = isFree ? 0 : 35; // Nominal service charge
  const totalAmount = subtotal + convenienceFee;

  // Handle Step 1 -> Step 2
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setError('');

    if (!attendeeName.trim()) {
      setError('Please provide the attendee name.');
      return;
    }
    if (!attendeeEmail.trim()) {
      setError('Please provide a valid email address for ticket delivery.');
      return;
    }

    // If event is Free, skip payment step and directly confirm!
    if (isFree) {
      finalizeBooking({
        paymentMethod: 'Free Registration',
        paymentStatus: 'Confirmed (Free)'
      });
      return;
    }

    setStep('payment');
  };

  // Handle Step 2 -> Complete Booking with simulated payment
  const handlePayAndConfirm = (e) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'upi' && !upiId.trim()) {
      setError('Please enter your UPI ID or choose a UPI app.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        setError('Please fill in all card details.');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate 1.4s secure gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      finalizeBooking({
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiId || 'Quick Pay'})`
            : paymentMethod === 'card'
            ? 'Credit/Debit Card'
            : paymentMethod === 'netbanking'
            ? `Net Banking (${selectedBank})`
            : 'Pay at Venue Desk',
        paymentStatus: paymentMethod === 'venue' ? 'Pending (Pay at Venue)' : 'Paid'
      });
    }, 1400);
  };

  const finalizeBooking = (paymentInfo) => {
    const bookingId = `LL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      bookingId,
      eventId: event.id,
      eventTitle: event.title,
      category: event.category,
      eventDate: event.date,
      eventTime: event.time,
      location: event.location,
      city: event.city,
      ticketCount,
      ticketPrice: event.price,
      subtotal,
      convenienceFee,
      totalAmount,
      attendeeName: attendeeName.trim(),
      attendeeEmail: attendeeEmail.trim(),
      attendeePhone: attendeePhone.trim(),
      bookingDate: new Date().toISOString(),
      ...paymentInfo
    };

    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);
    setStep('confirmed');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card checkout-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="checkout-modal-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Step 1: Ticket Selection & Contact Details */}
        {step === 'details' && (
          <div className="checkout-step-content">
            <div className="checkout-header">
              <span className="checkout-step-badge">Step 1 of 2</span>
              <h2 id="checkout-modal-title" className="checkout-title">
                Reserve Tickets
              </h2>
              <div className="checkout-event-summary">
                <span className="summary-category">{event.category}</span>
                <h3 className="summary-title">{event.title}</h3>
                <p className="summary-meta">
                  🗓️ {event.date} • ⏰ {event.time} • 📍 {event.city}
                </p>
              </div>
            </div>

            {error && <div className="auth-error-alert">{error}</div>}

            <form onSubmit={handleProceedToPayment} className="checkout-form">
              {/* Ticket Quantity */}
              <div className="ticket-counter-box">
                <div>
                  <strong className="counter-label">General Admission</strong>
                  <span className="counter-price">
                    {isFree ? 'Free Entry' : `₹${event.price} per ticket`}
                  </span>
                </div>
                <div className="qty-controls">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}
                    disabled={ticketCount <= 1}
                  >
                    –
                  </button>
                  <span className="qty-val">{ticketCount}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setTicketCount((prev) => Math.min(10, prev + 1))}
                    disabled={ticketCount >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Attendee Info */}
              <div className="form-group">
                <label className="checkout-label">Full Name</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Attendee full name"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkout-label">Email Address (for E-Ticket)</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkout-label">Mobile Phone Number</label>
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="+91 98765 43210"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                />
              </div>

              {/* Order Cost Breakdown */}
              <div className="checkout-cost-breakdown">
                <div className="cost-row">
                  <span>Tickets ({ticketCount}x)</span>
                  <span>{isFree ? 'Free' : `₹${subtotal}`}</span>
                </div>
                {!isFree && (
                  <div className="cost-row">
                    <span>Platform & Booking Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                )}
                <div className="cost-row total-row">
                  <strong>Total Amount</strong>
                  <strong className="total-highlight">
                    {isFree ? 'Free' : `₹${totalAmount}`}
                  </strong>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block checkout-submit-btn">
                {isFree ? '🎉 Confirm Free Registration' : `Proceed to Payment (₹${totalAmount}) →`}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Payment Gateway Selection */}
        {step === 'payment' && (
          <div className="checkout-step-content">
            <div className="checkout-header">
              <button
                type="button"
                className="checkout-back-link"
                onClick={() => setStep('details')}
              >
                ← Back to Ticket Details
              </button>
              <span className="checkout-step-badge">Step 2 of 2</span>
              <h2 className="checkout-title">Select Payment Method</h2>
              <div className="payment-amount-banner">
                <span>Total Payable:</span>
                <strong>₹{totalAmount}</strong>
              </div>
            </div>

            {error && <div className="auth-error-alert">{error}</div>}

            <form onSubmit={handlePayAndConfirm} className="checkout-form">
              {/* Payment Tabs / Radio Options */}
              <div className="payment-options-grid">
                <label
                  className={`payment-option-card ${paymentMethod === 'upi' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <div className="option-info">
                    <span className="option-title">⚡ Instant UPI</span>
                    <span className="option-desc">Google Pay, PhonePe, Paytm, BHIM</span>
                  </div>
                </label>

                <label
                  className={`payment-option-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="option-info">
                    <span className="option-title">💳 Credit / Debit Card</span>
                    <span className="option-desc">Visa, Mastercard, RuPay</span>
                  </div>
                </label>

                <label
                  className={`payment-option-card ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                  />
                  <div className="option-info">
                    <span className="option-title">🏦 Net Banking</span>
                    <span className="option-desc">All Indian major banks supported</span>
                  </div>
                </label>

                <label
                  className={`payment-option-card ${paymentMethod === 'venue' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="venue"
                    checked={paymentMethod === 'venue'}
                    onChange={() => setPaymentMethod('venue')}
                  />
                  <div className="option-info">
                    <span className="option-title">💵 Pay at Venue Desk</span>
                    <span className="option-desc">Pay cash/card when you arrive</span>
                  </div>
                </label>
              </div>

              {/* Dynamic Payment Inputs */}
              {paymentMethod === 'upi' && (
                <div className="payment-sub-form">
                  <div className="quick-upi-apps">
                    <button
                      type="button"
                      className="upi-chip"
                      onClick={() => setUpiId(`${attendeeEmail.split('@')[0] || 'user'}@okaxis`)}
                    >
                      Google Pay
                    </button>
                    <button
                      type="button"
                      className="upi-chip"
                      onClick={() => setUpiId(`${attendeeEmail.split('@')[0] || 'user'}@ybl`)}
                    >
                      PhonePe
                    </button>
                    <button
                      type="button"
                      className="upi-chip"
                      onClick={() => setUpiId(`${attendeeEmail.split('@')[0] || 'user'}@paytm`)}
                    >
                      Paytm
                    </button>
                  </div>
                  <div className="form-group">
                    <label className="checkout-label">UPI ID</label>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="e.g. rahul@okicici"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="payment-sub-form">
                  <div className="form-group">
                    <label className="checkout-label">Card Number</label>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="4532 •••• •••• 8910"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="card-dual-row">
                    <div className="form-group">
                      <label className="checkout-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="08/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="checkout-label">CVV</label>
                      <input
                        type="password"
                        maxLength="4"
                        className="auth-input"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="checkout-label">Name on Card</label>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Name as printed on card"
                      value={cardName || attendeeName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="payment-sub-form">
                  <div className="form-group">
                    <label className="checkout-label">Select Bank</label>
                    <select
                      className="filter-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === 'venue' && (
                <div className="payment-sub-form venue-note-box">
                  <p>
                    Your tickets will be reserved! Please present your Booking ID at the event
                    reception counter to complete payment and collect your physical wristband.
                  </p>
                </div>
              )}

              <div className="security-guarantee-row">
                <span>🔒 256-bit SSL Encrypted</span>
                <span>⚡ Instant E-Ticket Delivery</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block checkout-submit-btn"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="payment-processing-spinner">
                    ⏳ Processing Secure Payment...
                  </span>
                ) : (
                  `Pay ₹${totalAmount} & Complete Booking`
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Confirmation & E-Ticket Receipt */}
        {step === 'confirmed' && confirmedBooking && (
          <div className="checkout-step-content printable-ticket-wrap">
            <div className="booking-success-badge">
              <span className="success-icon-check">✓</span>
              <h2>Booking Confirmed!</h2>
              <p>Your tickets have been issued and sent to {confirmedBooking.attendeeEmail}.</p>
            </div>

            {/* Visual Digital E-Ticket */}
            <div className="e-ticket-card">
              <div className="e-ticket-header">
                <div className="e-ticket-brand">LocalLoop E-Ticket</div>
                <div className="e-ticket-id">ID: {confirmedBooking.bookingId}</div>
              </div>

              <div className="e-ticket-body">
                <h3 className="e-ticket-title">{confirmedBooking.eventTitle}</h3>
                <div className="e-ticket-grid">
                  <div>
                    <span className="e-ticket-label">Date & Time</span>
                    <strong>{confirmedBooking.eventDate} at {confirmedBooking.eventTime}</strong>
                  </div>
                  <div>
                    <span className="e-ticket-label">Venue</span>
                    <strong>{confirmedBooking.location}</strong>
                  </div>
                  <div>
                    <span className="e-ticket-label">Attendee</span>
                    <strong>{confirmedBooking.attendeeName} ({confirmedBooking.ticketCount} {confirmedBooking.ticketCount === 1 ? 'Ticket' : 'Tickets'})</strong>
                  </div>
                  <div>
                    <span className="e-ticket-label">Amount Paid</span>
                    <strong className="e-ticket-paid">
                      {confirmedBooking.totalAmount === 0 ? 'Free Entry' : `₹${confirmedBooking.totalAmount}`}
                    </strong>
                  </div>
                </div>

                <div className="e-ticket-qr-area">
                  <svg className="mock-qr-code" viewBox="0 0 100 100" width="80" height="80">
                    <rect width="100" height="100" fill="#FFFFFF" />
                    <rect x="10" y="10" width="25" height="25" fill="#000000" />
                    <rect x="15" y="15" width="15" height="15" fill="#FFFFFF" />
                    <rect x="18" y="18" width="9" height="9" fill="#000000" />
                    <rect x="65" y="10" width="25" height="25" fill="#000000" />
                    <rect x="70" y="15" width="15" height="15" fill="#FFFFFF" />
                    <rect x="73" y="18" width="9" height="9" fill="#000000" />
                    <rect x="10" y="65" width="25" height="25" fill="#000000" />
                    <rect x="15" y="70" width="15" height="15" fill="#FFFFFF" />
                    <rect x="18" y="73" width="9" height="9" fill="#000000" />
                    <rect x="45" y="20" width="10" height="10" fill="#000000" />
                    <rect x="40" y="45" width="20" height="15" fill="#000000" />
                    <rect x="65" y="65" width="15" height="25" fill="#000000" />
                  </svg>
                  <div className="e-ticket-scan-text">
                    <span>Scan at venue gate</span>
                    <small>Official LocalLoop Digital Pass</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="ticket-action-buttons">
              <button
                type="button"
                className="btn btn-outline btn-block"
                onClick={handlePrint}
              >
                🖨️ Print / Save E-Ticket
              </button>
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
