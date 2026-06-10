export const PageHeader = ({ title, description, action }) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h2 className="customer-display text-2xl font-bold text-slate-900">{title}</h2>
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600">{description}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
