function FavoriteButton({ eventId, isFavorite, onToggleFavorite, className = '' }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(eventId);
  };

  return (
    <button
      type="button"
      className={`favorite-btn ${isFavorite ? 'favorited' : ''} ${className}`}
      onClick={handleClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className="heart-icon"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

export default FavoriteButton;
