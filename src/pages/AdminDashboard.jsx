import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { events } from '../data/events';

function AdminDashboard({ bookings = [], theme = 'light' }) {
  const navigate = useNavigate();

  // Admin authentication state from localStorage
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('localloop_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Admin login credentials state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active dashboard tab: 'overview' | 'payments' | 'users' | 'events'
  const [activeTab, setActiveTab] = useState('overview');

  // Search & filter in tables
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Realistic seed bookings so admin has comprehensive data immediately
  const seedBookings = [
    {
      bookingId: 'LL-2026-94182',
      eventTitle: 'Rankala Sunset Live Music Night',
      category: 'Music',
      eventDate: '2026-10-04',
      eventTime: '6:30 PM',
      location: 'Rankala Lake Amphitheatre, Kolhapur',
      city: 'Kolhapur',
      ticketCount: 2,
      ticketPrice: 499,
      totalAmount: 1033,
      attendeeName: 'Rahul Patil',
      attendeeEmail: 'rahul.patil@example.com',
      attendeePhone: '+91 98220 12345',
      paymentMethod: 'UPI (GPay)',
      paymentStatus: 'Paid',
      bookingDate: '2026-10-04T10:15:00.000Z'
    },
    {
      bookingId: 'LL-2026-88319',
      eventTitle: 'Kolhapuri Spice & Misal Food Walk',
      category: 'Food',
      eventDate: '2026-10-05',
      eventTime: '9:00 AM',
      location: 'Bhavani Mandap Square, Kolhapur',
      city: 'Kolhapur',
      ticketCount: 3,
      ticketPrice: 350,
      totalAmount: 1085,
      attendeeName: 'Ananya Sharma',
      attendeeEmail: 'ananya.s@example.com',
      attendeePhone: '+91 98901 67890',
      paymentMethod: 'Credit Card (Visa)',
      paymentStatus: 'Paid',
      bookingDate: '2026-10-03T16:40:00.000Z'
    },
    {
      bookingId: 'LL-2026-72401',
      eventTitle: 'Pune Indie Beats & Electronic Festival',
      category: 'Music',
      eventDate: '2026-10-09',
      eventTime: '5:00 PM',
      location: 'Koregaon Park Open Grounds, Pune',
      city: 'Pune',
      ticketCount: 2,
      ticketPrice: 899,
      totalAmount: 1833,
      attendeeName: 'Vikram Deshmukh',
      attendeeEmail: 'vikram.d@gmail.com',
      attendeePhone: '+91 97654 32109',
      paymentMethod: 'UPI (PhonePe)',
      paymentStatus: 'Paid',
      bookingDate: '2026-10-03T11:20:00.000Z'
    },
    {
      bookingId: 'LL-2026-61944',
      eventTitle: 'Sufi & Ghazal Heritage Evening',
      category: 'Music',
      eventDate: '2026-10-10',
      eventTime: '7:30 PM',
      location: 'Royal Opera House, Mumbai',
      city: 'Mumbai',
      ticketCount: 1,
      ticketPrice: 1250,
      totalAmount: 1285,
      attendeeName: 'Priya Kulkarni',
      attendeeEmail: 'priya.kulkarni@outlook.com',
      attendeePhone: '+91 98210 98765',
      paymentMethod: 'Net Banking (HDFC)',
      paymentStatus: 'Paid',
      bookingDate: '2026-10-02T19:05:00.000Z'
    },
    {
      bookingId: 'LL-2026-55208',
      eventTitle: 'Western Ghats Sunrise Trek & Trail Run',
      category: 'Sports',
      eventDate: '2026-10-09',
      eventTime: '5:30 AM',
      location: 'Panhala Fort Foothills, Kolhapur',
      city: 'Kolhapur',
      ticketCount: 4,
      ticketPrice: 250,
      totalAmount: 1035,
      attendeeName: 'Aditya Shinde',
      attendeeEmail: 'aditya.shinde@gmail.com',
      attendeePhone: '+91 99234 56789',
      paymentMethod: 'Pay at Venue Desk',
      paymentStatus: 'Pending (At Venue)',
      bookingDate: '2026-10-02T14:15:00.000Z'
    }
  ];

  // Combine real live bookings from localStorage + baseline seed bookings (deduplicating by bookingId)
  const allBookings = [
    ...bookings,
    ...seedBookings.filter((sb) => !bookings.some((b) => b.bookingId === sb.bookingId))
  ];

  // Derive users list from all bookings + recent accounts
  const recentAccounts = (() => {
    try {
      return JSON.parse(localStorage.getItem('localloop_recent_accounts') || '[]');
    } catch {
      return [];
    }
  })();

  const usersMap = new Map();
  // Add seed users
  const seedUsers = [
    { name: 'Rahul Patil', email: 'rahul.patil@example.com', role: 'Attendee', joined: 'Oct 2026' },
    { name: 'Ananya Sharma', email: 'ananya.s@example.com', role: 'Explorer', joined: 'Sep 2026' },
    { name: 'Vikram Deshmukh', email: 'vikram.d@gmail.com', role: 'VIP Member', joined: 'Oct 2026' },
    { name: 'Priya Kulkarni', email: 'priya.kulkarni@outlook.com', role: 'Attendee', joined: 'Sep 2026' },
    { name: 'Aditya Shinde', email: 'aditya.shinde@gmail.com', role: 'Attendee', joined: 'Oct 2026' }
  ];

  seedUsers.forEach((u) => usersMap.set(u.email.toLowerCase(), u));
  recentAccounts.forEach((u) => {
    usersMap.set(u.email.toLowerCase(), {
      name: u.name,
      email: u.email,
      role: 'Attendee',
      joined: u.lastLogin || 'Oct 2026'
    });
  });

  const allUsers = Array.from(usersMap.values()).map((user) => {
    const userBookings = allBookings.filter(
      (b) => b.attendeeEmail.toLowerCase() === user.email.toLowerCase()
    );
    const tickets = userBookings.reduce((sum, b) => sum + (b.ticketCount || 1), 0);
    const spent = userBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return {
      ...user,
      tickets,
      spent,
      lastActive: userBookings[0] ? userBookings[0].eventDate : 'Active recently'
    };
  });

  // Calculate Metrics
  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalTickets = allBookings.reduce((sum, b) => sum + (b.ticketCount || 1), 0);
  const activeEventsCount = events.length;

  // Handle Admin Login
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = adminEmail.trim().toLowerCase();
    const trimmedPass = adminPassword.trim();

    // Standard admin check or demo credentials
    if (
      (trimmedEmail === 'admin@localloop.com' && trimmedPass === 'admin123') ||
      (trimmedEmail === 'admin' && trimmedPass === 'admin') ||
      (trimmedEmail.includes('admin') && trimmedPass.length >= 4)
    ) {
      const adminObj = {
        name: 'Super Admin',
        email: 'admin@localloop.com',
        role: 'Master Administrator',
        loginTime: new Date().toLocaleTimeString()
      };
      setAdminUser(adminObj);
      localStorage.setItem('localloop_admin', JSON.stringify(adminObj));
    } else {
      setLoginError('Invalid admin credentials. Please use admin@localloop.com / admin123 or 1-Click login.');
    }
  };

  const handleQuickAdminLogin = () => {
    const adminObj = {
      name: 'Super Admin',
      email: 'admin@localloop.com',
      role: 'Master Administrator',
      loginTime: new Date().toLocaleTimeString()
    };
    setAdminUser(adminObj);
    localStorage.setItem('localloop_admin', JSON.stringify(adminObj));
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('localloop_admin');
  };

  // Filter Bookings Table
  const filteredBookings = allBookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      b.bookingId.toLowerCase().includes(term) ||
      b.attendeeName.toLowerCase().includes(term) ||
      b.attendeeEmail.toLowerCase().includes(term) ||
      b.eventTitle.toLowerCase().includes(term) ||
      b.city.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Paid' && b.paymentStatus === 'Paid') ||
      (statusFilter === 'Pending' && b.paymentStatus.includes('Pending'));

    return matchesSearch && matchesStatus;
  });

  // Filter Users Table
  const filteredUsers = allUsers.filter((u) => {
    const term = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  // If Not Authenticated as Admin -> Show Admin Login Screen
  if (!adminUser) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo-wrap">
              <Logo theme={theme} height={42} />
            </div>
            <span className="admin-portal-badge">🛡️ Administrator Gateway</span>
            <h1 className="admin-login-title">Admin Management Portal</h1>
            <p className="admin-login-desc">
              Sign in with administrative privileges to manage platform bookings, attendee profiles, and financial transactions.
            </p>
          </div>

          {loginError && <div className="auth-error-alert">{loginError}</div>}

          {/* Quick 1-Click Admin Access */}
          <div className="admin-demo-access-box">
            <span className="demo-login-title">⚡ Quick Admin Access:</span>
            <button
              type="button"
              className="btn btn-outline btn-block demo-btn admin-quick-btn"
              onClick={handleQuickAdminLogin}
            >
              🛡️ 1-Click Sign In as Super Admin
            </button>
            <div className="admin-creds-hint">
              Default credentials: <code>admin@localloop.com</code> / <code>admin123</code>
            </div>
          </div>

          <div className="auth-divider">
            <span>or sign in manually</span>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="admin-login-form">
            <div className="form-group">
              <label className="auth-input-label">Admin Email or Username</label>
              <input
                type="text"
                className="auth-input"
                placeholder="admin@localloop.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="auth-input-label">Security Password</label>
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block admin-submit-btn">
              Unlock Dashboard →
            </button>
          </form>

          <div className="admin-login-footer">
            <Link to="/" className="admin-back-link">
              ← Return to LocalLoop Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Authenticated Admin Dashboard ---
  return (
    <div className="admin-dashboard-page">
      {/* Top Admin Navigation Header */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-brand-area">
            <Link to="/" title="Go to public homepage">
              <Logo theme={theme} height={32} />
            </Link>
            <span className="admin-badge-tag">ADMIN CONSOLE</span>
          </div>

          <div className="admin-user-info">
            <div className="admin-avatar-pill">
              <span className="admin-avatar-icon">👑</span>
              <div>
                <strong>{adminUser.name}</strong>
                <small>{adminUser.role}</small>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm admin-logout-btn"
              onClick={handleAdminLogout}
            >
              🚪 Exit Admin
            </button>
          </div>
        </div>
      </header>

      <div className="admin-dashboard-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav className="admin-nav-tabs">
            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('overview');
                setSearchTerm('');
              }}
            >
              📊 Performance Overview
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('payments');
                setSearchTerm('');
              }}
            >
              💳 Payments & Bookings
              <span className="tab-counter-badge">{allBookings.length}</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('users');
                setSearchTerm('');
              }}
            >
              👥 Registered Attendees
              <span className="tab-counter-badge">{allUsers.length}</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('events');
                setSearchTerm('');
              }}
            >
              🎪 Platform Events
              <span className="tab-counter-badge">{activeEventsCount}</span>
            </button>
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-quick-links">
              <Link to="/events" className="admin-side-link">
                🎟️ Browse Public Events
              </Link>
              <Link to="/plan" className="admin-side-link">
                ✨ Evening Planner
              </Link>
              <Link to="/" className="admin-side-link">
                🏠 LocalLoop Homepage
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content Area */}
        <main className="admin-main-viewport">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="admin-tab-pane">
              <div className="admin-pane-header">
                <div>
                  <h1 className="admin-pane-title">Platform Performance & Metrics</h1>
                  <p className="admin-pane-desc">
                    Real-time transaction volumes, user acquisition, and live event activity.
                  </p>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="admin-kpi-grid">
                <div className="kpi-card kpi-revenue">
                  <div className="kpi-header">
                    <span className="kpi-title">Gross Revenue</span>
                    <span className="kpi-icon">💰</span>
                  </div>
                  <div className="kpi-value">₹{totalRevenue.toLocaleString()}</div>
                  <div className="kpi-trend positive">
                    <span>↑ +18.4%</span> this week
                  </div>
                </div>

                <div className="kpi-card kpi-tickets">
                  <div className="kpi-header">
                    <span className="kpi-title">Tickets Issued</span>
                    <span className="kpi-icon">🎟️</span>
                  </div>
                  <div className="kpi-value">{totalTickets} Passes</div>
                  <div className="kpi-trend positive">
                    <span>↑ 100%</span> delivery rate
                  </div>
                </div>

                <div className="kpi-card kpi-users">
                  <div className="kpi-header">
                    <span className="kpi-title">Active Users</span>
                    <span className="kpi-icon">👥</span>
                  </div>
                  <div className="kpi-value">{allUsers.length} Members</div>
                  <div className="kpi-trend">Across 4 regional hubs</div>
                </div>

                <div className="kpi-card kpi-events">
                  <div className="kpi-header">
                    <span className="kpi-title">Active Events</span>
                    <span className="kpi-icon">🎪</span>
                  </div>
                  <div className="kpi-value">{activeEventsCount} Live Events</div>
                  <div className="kpi-trend">Kolhapur, Pune, Mumbai, Goa</div>
                </div>
              </div>

              {/* Two Column Section: Recent Transactions & City Distribution */}
              <div className="admin-split-grid">
                {/* Recent Bookings Feed */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2 className="admin-card-title">Recent Transactions</h2>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveTab('payments')}
                    >
                      View All →
                    </button>
                  </div>

                  <div className="admin-recent-list">
                    {allBookings.slice(0, 5).map((booking) => (
                      <div key={booking.bookingId} className="recent-tx-row">
                        <div className="tx-icon">🎟️</div>
                        <div className="tx-info">
                          <strong>{booking.attendeeName}</strong>
                          <small>{booking.eventTitle} ({booking.city})</small>
                        </div>
                        <div className="tx-financials">
                          <span className="tx-amount">
                            {booking.totalAmount === 0 ? 'Free' : `₹${booking.totalAmount}`}
                          </span>
                          <span className="tx-badge">{booking.paymentMethod}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional City Distribution */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2 className="admin-card-title">Regional Footprint</h2>
                    <span className="badge-pill">4 Cities Active</span>
                  </div>

                  <div className="city-metrics-list">
                    <div className="city-metric-row">
                      <div className="city-metric-meta">
                        <strong>📍 Kolhapur (Flagship Hub)</strong>
                        <span>Rankala Lake, Panhala, Bhavani Mandap</span>
                      </div>
                      <span className="city-metric-val">8 Events</span>
                    </div>

                    <div className="city-metric-row">
                      <div className="city-metric-meta">
                        <strong>📍 Pune (Cultural & Tech Hub)</strong>
                        <span>Koregaon Park, Deccan, FC Road, Hinjawadi</span>
                      </div>
                      <span className="city-metric-val">7 Events</span>
                    </div>

                    <div className="city-metric-row">
                      <div className="city-metric-meta">
                        <strong>📍 Mumbai (Metro Showcase)</strong>
                        <span>Bandra, Marine Drive, Royal Opera, BKC</span>
                      </div>
                      <span className="city-metric-val">5 Events</span>
                    </div>

                    <div className="city-metric-row">
                      <div className="city-metric-meta">
                        <strong>📍 Goa (Coastal & Arts)</strong>
                        <span>Vagator, Fontainhas, Anjuna, Assagao</span>
                      </div>
                      <span className="city-metric-val">4 Events</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENTS & BOOKINGS */}
          {activeTab === 'payments' && (
            <div className="admin-tab-pane">
              <div className="admin-pane-header">
                <div>
                  <h1 className="admin-pane-title">All Payments & Bookings</h1>
                  <p className="admin-pane-desc">
                    Comprehensive ledger of all event registrations, payment gateways, and attendee tickets.
                  </p>
                </div>

                <div className="admin-table-filters">
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search by ID, name, email or event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <select
                    className="admin-filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Payment Statuses</option>
                    <option value="Paid">Confirmed (Paid)</option>
                    <option value="Pending">Pending (Venue Payment)</option>
                  </select>
                </div>
              </div>

              {/* Payments Table */}
              <div className="admin-table-card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking Ref</th>
                        <th>Attendee Name</th>
                        <th>Event & City</th>
                        <th>Passes</th>
                        <th>Amount</th>
                        <th>Payment Mode</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => (
                          <tr key={b.bookingId}>
                            <td>
                              <span className="ref-code">{b.bookingId}</span>
                            </td>
                            <td>
                              <strong>{b.attendeeName}</strong>
                              <small className="cell-subtext">{b.attendeeEmail}</small>
                            </td>
                            <td>
                              <span className="table-event-name">{b.eventTitle}</span>
                              <small className="cell-subtext">📍 {b.city} • {b.eventDate}</small>
                            </td>
                            <td>
                              <strong>{b.ticketCount}x</strong>
                            </td>
                            <td>
                              <strong className="table-price">
                                {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}
                              </strong>
                            </td>
                            <td>
                              <span className="table-pay-mode">{b.paymentMethod || 'UPI'}</span>
                            </td>
                            <td>
                              <span
                                className={`table-status-pill ${
                                  b.paymentStatus === 'Paid' ? 'status-paid' : 'status-pending'
                                }`}
                              >
                                {b.paymentStatus || 'Paid'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            No matching payment records found for your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTERED ATTENDEES */}
          {activeTab === 'users' && (
            <div className="admin-tab-pane">
              <div className="admin-pane-header">
                <div>
                  <h1 className="admin-pane-title">Registered Users & Community</h1>
                  <p className="admin-pane-desc">
                    Directory of registered LocalLoop attendees, event explorers, and community members.
                  </p>
                </div>

                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search attendee by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Users Table */}
              <div className="admin-table-card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User Profile</th>
                        <th>Email Address</th>
                        <th>Role</th>
                        <th>Tickets Purchased</th>
                        <th>Total Spend</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                          <tr key={u.email}>
                            <td>
                              <div className="table-user-cell">
                                <span className="user-initial-badge">
                                  {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                                <div>
                                  <strong>{u.name}</strong>
                                  <small className="cell-subtext">Joined {u.joined}</small>
                                </div>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className="role-tag">{u.role}</span>
                            </td>
                            <td>
                              <strong>{u.tickets} passes</strong>
                            </td>
                            <td>
                              <strong className="table-price">₹{u.spent}</strong>
                            </td>
                            <td>
                              <span className="table-status-pill status-paid">Active</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            No attendees found matching your query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLATFORM EVENTS OVERVIEW */}
          {activeTab === 'events' && (
            <div className="admin-tab-pane">
              <div className="admin-pane-header">
                <div>
                  <h1 className="admin-pane-title">Platform Events Catalog</h1>
                  <p className="admin-pane-desc">
                    Live events actively discoverable and bookable across Maharashtra & Goa.
                  </p>
                </div>
              </div>

              <div className="admin-table-card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Event Title</th>
                        <th>Category</th>
                        <th>City / Venue</th>
                        <th>Date & Time</th>
                        <th>Admission</th>
                        <th>Attendees</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((ev) => (
                        <tr key={ev.id}>
                          <td>#{ev.id}</td>
                          <td>
                            <strong>{ev.title}</strong>
                            <small className="cell-subtext">{ev.organizer}</small>
                          </td>
                          <td>
                            <span className="category-pill-sm">{ev.category}</span>
                          </td>
                          <td>
                            <strong>{ev.city}</strong>
                            <small className="cell-subtext">{ev.location}</small>
                          </td>
                          <td>{ev.date} • {ev.time}</td>
                          <td>
                            <strong className="table-price">
                              {ev.price === 0 ? 'Free' : `₹${ev.price}`}
                            </strong>
                          </td>
                          <td>{ev.attendees}+ RSVPs</td>
                          <td>
                            <Link
                              to={`/event/${ev.id}`}
                              className="btn btn-outline btn-sm"
                              target="_blank"
                            >
                              Preview ↗
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
