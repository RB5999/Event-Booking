import { Link } from 'react-router-dom';

function EmptyState({
  icon = '🔍',
  title = 'No events found',
  message = 'Try adjusting your search or filters to find what you are looking for.',
  actionText,
  onAction,
  actionLink
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      
      {actionLink && actionText && (
        <Link to={actionLink} className="btn btn-primary empty-state-btn">
          {actionText}
        </Link>
      )}

      {!actionLink && onAction && actionText && (
        <button type="button" onClick={onAction} className="btn btn-primary empty-state-btn">
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
