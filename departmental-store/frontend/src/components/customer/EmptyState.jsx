import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const EmptyState = ({ icon: Icon, title, description, actionLabel, actionTo }) => (
  <div className="customer-empty">
    {Icon && <Icon className="mb-4 h-12 w-12 text-slate-300" aria-hidden="true" />}
    <p className="text-lg font-semibold text-slate-800">{title}</p>
    {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
    {actionLabel && actionTo && (
      <Link to={actionTo} className="mt-6 inline-block">
        <Button>{actionLabel}</Button>
      </Link>
    )}
  </div>
);
