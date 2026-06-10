export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>}
      <input className={`input-field ${error ? 'border-red-500/50' : ''}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export const Textarea = ({ label, error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>}
      <textarea className={`input-field min-h-[100px] resize-y ${error ? 'border-red-500/50' : ''}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export const Select = ({ label, error, options = [], className = '', ...props }) => {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>}
      <select className={`input-field ${error ? 'border-red-500/50' : ''}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};
