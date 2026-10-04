import EventCard from './EventCard';

function EventGrid({ events, favorites = [], onToggleFavorite }) {
  return (
    <div className="event-grid">
      {events.map((event) => {
        const isFavorite = favorites.includes(event.id);
        return (
          <EventCard
            key={event.id}
            event={event}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </div>
  );
}

export default EventGrid;
