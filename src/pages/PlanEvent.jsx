import { useState } from 'react';
import { Link } from 'react-router-dom';
import { events } from '../data/events';

function PlanEvent() {
  const [budget, setBudget] = useState('₹1,000');
  const [time, setTime] = useState('4 hours');
  const [withWhom, setWithWhom] = useState('Friends');
  const [mood, setMood] = useState('Fun');
  const [city, setCity] = useState('Kolhapur');
  const [plan, setPlan] = useState(null);

  const budgetOptions = ['₹500', '₹1,000', '₹2,000', '₹3,000+'];
  const timeOptions = ['2 hours', '4 hours', '6 hours'];
  const withOptions = ['Alone', 'Partner', 'Friends', 'Family'];
  const moodOptions = [
    'Relaxed',
    'Fun',
    'Foodie',
    'Social',
    'Creative',
    'Adventure'
  ];
  const cityOptions = ['All', 'Kolhapur', 'Pune', 'Mumbai', 'Goa'];

  const getBudgetLimit = (budgetString) => {
    switch (budgetString) {
      case '₹500':
        return 500;
      case '₹1,000':
        return 1000;
      case '₹2,000':
        return 2000;
      case '₹3,000+':
        return 4000;
      default:
        return 1000;
    }
  };

  const getTargetStops = (timeString) => {
    switch (timeString) {
      case '2 hours':
        return 2;
      case '4 hours':
        return 3;
      case '6 hours':
        return 3;
      default:
        return 3;
    }
  };

  // Complementary local side-stops to ensure realistic, charming itineraries
  const sideStops = [
    {
      title: 'Heritage Street Food & Chai Stop',
      category: 'Food',
      location: 'Local Bazaar Square',
      price: 150,
      icon: '☕',
      timeSlot: '5:00 PM',
      duration: '1 hr',
      note: 'Warm up with cutting chai and hot regional savories'
    },
    {
      title: 'Scenic Lake Promenade Stroll',
      category: 'Relaxation',
      location: 'Promenade Waterfront',
      price: 0,
      icon: '🌅',
      timeSlot: '6:15 PM',
      duration: '45 mins',
      note: 'Catch the sunset colors reflecting across the water'
    },
    {
      title: 'Artisan Gelato & Dessert Walk',
      category: 'Food',
      location: 'Old Town Sweet Corner',
      price: 180,
      icon: '🍦',
      timeSlot: '9:30 PM',
      duration: '45 mins',
      note: 'End the night with handcrafted kulfi and artisan treats'
    }
  ];

  // Pure JavaScript deterministic planning algorithm
  const generatePlan = () => {
    const budgetLimit = getBudgetLimit(budget);
    const targetStops = getTargetStops(time);

    // 1. Candidate events in the city (or all) matching mood or category
    let candidates = events.filter((e) => {
      const cityMatch = city === 'All' || e.city.toLowerCase() === city.toLowerCase();
      const moodMatch = e.mood.includes(mood);
      return cityMatch && moodMatch && e.price <= budgetLimit;
    });

    // If too few candidates matching mood, fallback to any event in city within budget
    if (candidates.length < 2) {
      candidates = events.filter((e) => {
        const cityMatch = city === 'All' || e.city.toLowerCase() === city.toLowerCase();
        return cityMatch && e.price <= budgetLimit;
      });
    }

    // If still empty (e.g. high price), take any event within budget
    if (candidates.length === 0) {
      candidates = events.filter((e) => e.price <= budgetLimit);
    }

    // Shuffle slightly using a deterministic random sort for "Try Again" variety
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());

    const selectedStops = [];
    let currentCost = 0;

    // Time schedule slots based on targetStops
    const scheduleHours =
      targetStops === 2
        ? ['6:00 PM', '7:45 PM']
        : ['5:00 PM', '6:30 PM', '8:30 PM'];

    // Select primary event
    for (let i = 0; i < shuffled.length; i++) {
      const ev = shuffled[i];
      if (currentCost + ev.price <= budgetLimit && selectedStops.length < targetStops) {
        selectedStops.push({
          eventId: ev.id,
          title: ev.title,
          category: ev.category,
          location: ev.location,
          city: ev.city,
          price: ev.price,
          timeSlot: scheduleHours[selectedStops.length] || ev.time,
          icon: ev.category === 'Food' ? '🍔' : ev.category === 'Music' ? '🎵' : ev.category === 'Art' ? '🎨' : '🎟️',
          isCustom: false
        });
        currentCost += ev.price;
      }
    }

    // If we have room for another stop and remaining budget, pad with charming local stops
    if (selectedStops.length < targetStops) {
      for (const side of sideStops) {
        if (currentCost + side.price <= budgetLimit && selectedStops.length < targetStops) {
          selectedStops.push({
            ...side,
            timeSlot: scheduleHours[selectedStops.length]
          });
          currentCost += side.price;
        }
      }
    }

    setPlan({
      stops: selectedStops,
      totalCost: currentCost,
      budgetLimit,
      budget,
      time,
      withWhom,
      mood,
      city
    });
  };

  const handleReset = () => {
    setPlan(null);
  };

  return (
    <div className="page-plan">
      <div className="plan-container">
        {/* Header */}
        <header className="plan-header text-center">
          <div className="plan-pill-tag">✨ LocalLoop Smart Assistant</div>
          <h1 className="page-title">Plan My Evening</h1>
          <p className="page-subtitle">
            Customize your perfect evening out based on your budget, company, and mood.
          </p>
        </header>

        {!plan ? (
          /* Input Form */
          <div className="plan-card-form">
            {/* City Selection */}
            <div className="form-group">
              <label className="plan-form-label">
                📍 Destination City
              </label>
              <div className="options-pill-group">
                {cityOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`option-btn ${city === c ? 'active' : ''}`}
                    onClick={() => setCity(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="form-group">
              <label className="plan-form-label">
                💰 Budget
              </label>
              <div className="options-pill-group">
                {budgetOptions.map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`option-btn ${budget === b ? 'active' : ''}`}
                    onClick={() => setBudget(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="form-group">
              <label className="plan-form-label">
                ⏱️ Time Available
              </label>
              <div className="options-pill-group">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`option-btn ${time === t ? 'active' : ''}`}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* With Whom */}
            <div className="form-group">
              <label className="plan-form-label">
                👥 Who are you with?
              </label>
              <div className="options-pill-group">
                {withOptions.map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={`option-btn ${withWhom === w ? 'active' : ''}`}
                    onClick={() => setWithWhom(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="form-group">
              <label className="plan-form-label">
                🎭 What's the mood?
              </label>
              <div className="options-pill-group">
                {moodOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`option-btn ${mood === m ? 'active' : ''}`}
                    onClick={() => setMood(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="plan-form-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                onClick={generatePlan}
              >
                🚀 Create My Plan
              </button>
            </div>
          </div>
        ) : (
          /* Generated Itinerary Display */
          <div className="plan-result-card">
            <div className="plan-result-header">
              <div>
                <span className="itinerary-badge">Customized Itinerary</span>
                <h2 className="itinerary-title">YOUR EVENING</h2>
                <p className="itinerary-meta">
                  {plan.city === 'All' ? 'Local Region' : plan.city} • {plan.time} • With {plan.withWhom} • {plan.mood} vibe
                </p>
              </div>
              <div className="itinerary-total-badge">
                <span className="total-label">Total Cost</span>
                <span className="total-amount">₹{plan.totalCost}</span>
              </div>
            </div>

            {/* Timeline Stops */}
            <div className="itinerary-timeline">
              {plan.stops.map((stop, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-time-col">
                    <span className="timeline-dot"></span>
                    <span className="timeline-time">{stop.timeSlot}</span>
                  </div>

                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <div className="timeline-card-title-wrap">
                        <span className="stop-icon">{stop.icon}</span>
                        <div>
                          <h3 className="stop-title">{stop.title}</h3>
                          <span className="stop-location">📍 {stop.location}</span>
                        </div>
                      </div>
                      <div className="stop-price">
                        {stop.price === 0 ? 'Free' : `₹${stop.price}`}
                      </div>
                    </div>

                    {stop.note && (
                      <p className="stop-note">{stop.note}</p>
                    )}

                    {stop.eventId && (
                      <div className="stop-actions">
                        <Link
                          to={`/event/${stop.eventId}`}
                          className="btn btn-outline btn-sm"
                        >
                          View Event Details →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Footer */}
            <div className="itinerary-footer">
              <div className="itinerary-summary-info">
                <span>Budget allocated: <strong>{plan.budget}</strong></span>
                <span>Total planned spend: <strong>₹{plan.totalCost}</strong></span>
                <span>
                  Remaining buffer: <strong>₹{Math.max(0, plan.budgetLimit - plan.totalCost)}</strong>
                </span>
              </div>

              <div className="itinerary-button-group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={generatePlan}
                >
                  🔄 Try Again (New Itinerary)
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleReset}
                >
                  ⚙️ Change Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlanEvent;
