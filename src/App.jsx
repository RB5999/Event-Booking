import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MyBookingsModal from './components/MyBookingsModal';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Favorites from './pages/Favorites';
import PlanEvent from './pages/PlanEvent';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // 1. Theme State: Light / Dark with persistence

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('localloop_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('localloop_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. User Authentication State with persistence
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('localloop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('localloop_user', JSON.stringify(userData));

    // Save to recent / saved accounts list
    try {
      const recents = JSON.parse(localStorage.getItem('localloop_recent_accounts') || '[]');
      const filtered = recents.filter(
        (a) => a.email.toLowerCase() !== userData.email.toLowerCase()
      );
      const updated = [
        {
          name: userData.name,
          email: userData.email,
          lastLogin: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        },
        ...filtered
      ].slice(0, 3);
      localStorage.setItem('localloop_recent_accounts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('localloop_user');
  };

  // 3. Favorites State with persistence
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('localloop_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (eventId) => {
    setFavorites((prevFavorites) => {
      let updated;
      if (prevFavorites.includes(eventId)) {
        updated = prevFavorites.filter((id) => id !== eventId);
      } else {
        updated = [...prevFavorites, eventId];
      }

      try {
        localStorage.setItem('localloop_favorites', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update localStorage favorites:', err);
      }

      return updated;
    });
  };

  // 4. Booked Tickets State with persistence
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('localloop_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleAddBooking = (newBooking) => {
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem('localloop_bookings', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update localStorage bookings:', err);
      }
      return updated;
    });
  };

  // 5. My Bookings modal visibility
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-layout" data-theme={theme}>
        <Navbar
          favoritesCount={favorites.length}
          bookingsCount={bookings.length}
          theme={theme}
          onToggleTheme={toggleTheme}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onOpenBookings={() => setIsBookingsModalOpen(true)}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/events"
              element={
                <Events
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/event/:id"
              element={
                <EventDetails
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  user={user}
                  onAddBooking={handleAddBooking}
                  bookings={bookings}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <Favorites
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            <Route path="/plan" element={<PlanEvent />} />
            <Route path="/admin" element={<AdminDashboard bookings={bookings} theme={theme} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

        {/* My Bookings / Tickets Modal */}
        <MyBookingsModal
          isOpen={isBookingsModalOpen}
          onClose={() => setIsBookingsModalOpen(false)}
          bookings={bookings}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
