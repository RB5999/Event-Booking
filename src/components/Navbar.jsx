import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import AuthModal from './AuthModal';

function Navbar({
  favoritesCount = 0,
  bookingsCount = 0,
  theme = 'light',
  onToggleTheme,
  user,
  onLogin,
  onLogout,
  onOpenBookings
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleOpenAuth = () => {
    closeMobileMenu();
    setShowAuthModal(true);
  };

  const handleUserLogout = () => {
    setShowUserDropdown(false);
    closeMobileMenu();
    onLogout();
  };

  const handleBookingsClick = () => {
    setShowUserDropdown(false);
    closeMobileMenu();
    onOpenBookings();
  };

  // Truncate user display name cleanly
  const getDisplayName = () => {
    if (!user || !user.name) return 'User';
    const firstWord = user.name.split(' ')[0] || user.name;
    return firstWord.length > 10 ? `${firstWord.slice(0, 9)}…` : firstWord;
  };

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-container">
          {/* Brand Logo & Location */}
          <div className="navbar-left">
            <Link to="/" className="navbar-brand-link" onClick={closeMobileMenu} aria-label="LocalLoop Home">
              <span className="brand-icon-wrap" aria-hidden="true">
                <svg className="brand-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
                </svg>
              </span>
              <span className="navbar-brand-text">
                Local<span className="brand-highlight">Loop</span>
              </span>
            </Link>

            <div className="location-pill" title="Current Region">
              <span className="location-pin" aria-hidden="true">📍</span>
              <span className="location-name">Kolhapur</span>
            </div>
          </div>

          {/* Desktop Navigation Links (Clean, No-Wrap, Centered) */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Discover
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Events
            </NavLink>
            <NavLink
              to="/plan"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Plan My Evening
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Favorites
              {favoritesCount > 0 && (
                <span className="nav-badge" aria-label={`${favoritesCount} favorites`}>
                  {favoritesCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Navbar Right Actions */}
          <div className="nav-actions">
            {/* Quick Admin Portal Link */}
            <Link
              to="/admin"
              className="nav-admin-badge"
              title="Admin Console"
              aria-label="Admin Console"
            >
              <span className="admin-badge-icon" aria-hidden="true">🛡️</span>
              <span className="admin-badge-text">Admin</span>
            </Link>

            {/* Compact Theme Toggle Button (Icon-only on desktop) */}
            <ThemeToggle
              theme={theme}
              onToggleTheme={onToggleTheme}
              className="navbar-theme-toggle"
              showLabel={false}
            />

            {/* My Bookings Ticket Button (Compact) */}
            {bookingsCount > 0 && (
              <button
                type="button"
                className="nav-tickets-btn"
                onClick={onOpenBookings}
                title="View your booked tickets"
                aria-label={`View your ${bookingsCount} booked tickets`}
              >
                <span className="ticket-icon">🎟️</span>
                <span className="tickets-badge">{bookingsCount}</span>
              </button>
            )}

            {/* Auth / User Profile */}
            {user ? (
              <div className="user-profile-menu-wrap">
                <button
                  type="button"
                  className="user-profile-btn"
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                  aria-expanded={showUserDropdown}
                  aria-label="User profile menu"
                >
                  <span className="user-avatar-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span className="user-name-text">{getDisplayName()}</span>
                  <span className="dropdown-caret" aria-hidden="true">▾</span>
                </button>

                {showUserDropdown && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-header">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                      type="button"
                      className="dropdown-item-btn"
                      onClick={handleBookingsClick}
                    >
                      🎟️ My Booked Tickets ({bookingsCount})
                    </button>
                    <NavLink
                      to="/favorites"
                      className="dropdown-item-btn"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      ❤️ Saved Favorites ({favoritesCount})
                    </NavLink>
                    <NavLink
                      to="/admin"
                      className="dropdown-item-btn"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      🛡️ Admin Console
                    </NavLink>
                    <div className="dropdown-divider"></div>
                    <button
                      type="button"
                      className="dropdown-item-btn logout-item"
                      onClick={handleUserLogout}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm login-btn"
                onClick={handleOpenAuth}
              >
                Log In
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`hamburger-bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-location-banner">
            <span>📍 Active Region: <strong>Kolhapur, MH</strong></span>
            <ThemeToggle
              theme={theme}
              onToggleTheme={onToggleTheme}
              className="mobile-theme-toggle"
              showLabel={true}
            />
          </div>

          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              🏠 Discover
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              🎟️ Events
            </NavLink>
            <NavLink
              to="/plan"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              ✨ Plan My Evening
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              ❤️ Favorites {favoritesCount > 0 ? `(${favoritesCount})` : ''}
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              🛡️ Admin Dashboard
            </NavLink>
            {bookingsCount > 0 && (
              <button
                type="button"
                className="mobile-nav-link text-left"
                onClick={handleBookingsClick}
              >
                🎟️ My Booked Tickets ({bookingsCount})
              </button>
            )}
          </nav>

          <div className="mobile-nav-footer">
            {user ? (
              <div className="mobile-user-status">
                <div className="mobile-user-info">
                  <span className="user-avatar-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-block mt-2"
                  onClick={handleUserLogout}
                >
                  🚪 Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleOpenAuth}
              >
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={onLogin}
      />
    </>
  );
}

export default Navbar;
