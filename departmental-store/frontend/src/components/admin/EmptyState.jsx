export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="admin-card flex flex-col items-center px-6 py-16 text-center">
    {Icon && (
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Icon className="h-7 w-7 text-slate-400" aria-hidden="true" />
      </div>
    )}
    <h3 className="admin-display text-lg font-semibold text-slate-900">{title}</h3>
    {description && (
      <p className="mt-2 max-w-sm text-sm text-slate-600">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
