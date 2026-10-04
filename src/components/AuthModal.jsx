import { useState, useEffect } from 'react';

function AuthModal({ isOpen, onClose, onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [error, setError] = useState('');

  // Load saved / recent accounts whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      try {
        const saved = localStorage.getItem('localloop_recent_accounts');
        if (saved) {
          setRecentAccounts(JSON.parse(saved));
        } else {
          // If no recent accounts array exists yet, check if there's a stored user
          const currentUser = localStorage.getItem('localloop_user');
          if (currentUser) {
            const u = JSON.parse(currentUser);
            const initialList = [{
              name: u.name,
              email: u.email,
              lastLogin: 'Recent'
            }];
            localStorage.setItem('localloop_recent_accounts', JSON.stringify(initialList));
            setRecentAccounts(initialList);
          } else {
            setRecentAccounts([]);
          }
        }
      } catch {
        setRecentAccounts([]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveToRecentAccounts = (userObj) => {
    try {
      const existing = JSON.parse(localStorage.getItem('localloop_recent_accounts') || '[]');
      const filtered = existing.filter(
        (a) => a.email.toLowerCase() !== userObj.email.toLowerCase()
      );
      const updated = [
        {
          name: userObj.name,
          email: userObj.email,
          lastLogin: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        },
        ...filtered
      ].slice(0, 3); // keep up to 3 recent accounts
      localStorage.setItem('localloop_recent_accounts', JSON.stringify(updated));
      setRecentAccounts(updated);
    } catch (e) {
      console.error('Failed to save recent account:', e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const userName = isSignUp ? name.trim() : (email.split('@')[0] || 'User');
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

    const userObj = {
      name: formattedName,
      email: email.trim(),
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    if (rememberMe) {
      saveToRecentAccounts(userObj);
    }

    onLogin(userObj);
    onClose();
  };

  // 1-Click Login using Saved Account
  const handleSavedLogin = (account) => {
    const userObj = {
      name: account.name,
      email: account.email,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    saveToRecentAccounts(userObj);
    onLogin(userObj);
    onClose();
  };

  // Remove account from saved logins
  const handleRemoveSavedAccount = (emailToRemove) => {
    const updated = recentAccounts.filter(
      (a) => a.email.toLowerCase() !== emailToRemove.toLowerCase()
    );
    setRecentAccounts(updated);
    try {
      localStorage.setItem('localloop_recent_accounts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="auth-modal-header">
          <div className="modal-icon">🔐</div>
          <h2 id="auth-modal-title" className="modal-title">
            {isSignUp ? 'Create your Account' : 'Sign in to LocalLoop'}
          </h2>
          <p className="modal-desc">
            {isSignUp
              ? 'Join to easily book tickets, save events, and plan evenings.'
              : 'Log in to access your booked tickets and saved experiences.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => {
              setIsSignUp(false);
              setError('');
            }}
          >
            Log In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => {
              setIsSignUp(true);
              setError('');
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Saved / Recent Logins Section (replaces hardcoded demo accounts) */}
        {!isSignUp && recentAccounts.length > 0 && (
          <div className="saved-logins-box">
            <div className="saved-logins-header">
              <span className="saved-logins-title">🕒 Saved Logins</span>
              <span className="saved-logins-hint">Click to sign in instantly</span>
            </div>

            <div className="saved-accounts-list">
              {recentAccounts.map((acc) => (
                <div key={acc.email} className="saved-account-card">
                  <button
                    type="button"
                    className="saved-account-main-btn"
                    onClick={() => handleSavedLogin(acc)}
                    title={`Log in as ${acc.name}`}
                  >
                    <span className="saved-avatar-circle">
                      {acc.name ? acc.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <div className="saved-account-info">
                      <strong className="saved-name">{acc.name}</strong>
                      <small className="saved-email">{acc.email}</small>
                    </div>
                    <span className="saved-login-badge">Login →</span>
                  </button>

                  <button
                    type="button"
                    className="saved-account-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSavedAccount(acc.email);
                    }}
                    aria-label={`Remove saved login for ${acc.email}`}
                    title="Remove from saved logins"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="auth-divider">
              <span>or enter credentials</span>
            </div>
          </div>
        )}

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="auth-name" className="auth-input-label">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                className="auth-input"
                placeholder="e.g. Rahul Patil"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email" className="auth-input-label">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password" className="auth-input-label">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember this account checkbox */}
          <div className="remember-me-row">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="remember-checkbox"
              />
              <span>Remember this login on this device</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block auth-submit-btn">
            {isSignUp ? '✨ Create Account' : '🚀 Log In'}
          </button>
        </form>

        <div className="auth-footer-note">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => setIsSignUp(false)}
              >
                Log In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => setIsSignUp(true)}
              >
                Create one free
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
