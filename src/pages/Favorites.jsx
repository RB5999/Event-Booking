import EventGrid from '../components/EventGrid';
import EmptyState from '../components/EmptyState';
import { events } from '../data/events';

function Favorites({ favorites, onToggleFavorite }) {
  // Filter events whose id is in favorites array
  const favoriteEvents = events.filter((event) => favorites.includes(event.id));

  return (
    <div className="page-favorites">
      <div className="favorites-container">
        <header className="favorites-header">
          <div>
            <h1 className="page-title">Saved Events</h1>
            <p className="page-subtitle">
              Your personalized collection of events you are interested in attending
            </p>
          </div>
          {favoriteEvents.length > 0 && (
            <div className="favorites-count-badge">
              {favoriteEvents.length} {favoriteEvents.length === 1 ? 'Event Saved' : 'Events Saved'}
            </div>
          )}
        </header>

        {favoriteEvents.length > 0 ? (
          <EventGrid
            events={favoriteEvents}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        ) : (
          <EmptyState
            icon="❤️"
            title="No favorites yet"
            message="You haven't saved any events yet. Click the heart icon on any event to keep track of experiences you love."
            actionText="Explore Events"
            actionLink="/events"
          />
        )}
      </div>
    </div>
  );
}

export default Favorites;
