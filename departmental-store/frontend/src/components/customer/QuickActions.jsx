import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const QuickActions = ({ items }) => (
  <div className="customer-card p-5">
    <h3 className="customer-display font-semibold text-slate-900">Quick Actions</h3>
    <div className="mt-4 space-y-2">
      {items.map(({ to, label, icon: Icon, badge }) => (
        <Link key={to} to={to} className="customer-quick-action">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="flex-1 font-medium">{label}</span>
          {badge != null && badge > 0 && (
            <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {badge}
            </span>
          )}
          <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </Link>
      ))}
    </div>
  </div>
);
