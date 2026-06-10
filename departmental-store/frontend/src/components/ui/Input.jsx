import { useState, useRef, useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

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

export const Select = forwardRef(function Select(
  {
    label,
    error,
    options = [],
    className = '',
    value,
    defaultValue,
    onChange,
    onBlur,
    name,
    disabled = false,
    placeholder = 'Select an option',
    required = false,
  },
  ref
) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [menuStyle, setMenuStyle] = useState(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const selected = options.find((opt) => String(opt.value) === String(currentValue));

  const closeMenu = () => {
    setOpen(false);
    setMenuStyle(null);
    onBlur?.({ target: { name, value: currentValue } });
  };

  const getScrollParent = (node) => {
    let parent = node?.parentElement;
    while (parent) {
      const { overflow, overflowY } = window.getComputedStyle(parent);
      if (/(auto|scroll|overlay)/.test(`${overflow}${overflowY}`)) return parent;
      parent = parent.parentElement;
    }
    return null;
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const maxHeight = 224;
    const listHeight = Math.min(options.length * 44 + 8, maxHeight);
    const openUp = spaceBelow < 120 && spaceAbove > spaceBelow;
    const available = openUp ? spaceAbove : spaceBelow;
    const height = Math.min(listHeight, Math.max(available, 120));

    setMenuStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      top: openUp ? rect.top - height - 6 : rect.bottom + 6,
      maxHeight: height,
      zIndex: 9999,
    });
  };

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(updatePosition);
    const scrollParent = getScrollParent(triggerRef.current);
    const onScrollOrResize = () => requestAnimationFrame(updatePosition);

    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    scrollParent?.addEventListener('scroll', onScrollOrResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      scrollParent?.removeEventListener('scroll', onScrollOrResize);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (
        triggerRef.current?.contains(event.target)
        || listRef.current?.contains(event.target)
      ) {
        return;
      }
      closeMenu();
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, currentValue, name]);

  const handleSelect = (optValue) => {
    if (!isControlled) setInternalValue(optValue);
    onChange?.({ target: { name, value: optValue } });
    setOpen(false);
    onBlur?.({ target: { name, value: optValue } });
  };

  const dropdown = open && menuStyle && createPortal(
    <ul
      ref={listRef}
      role="listbox"
      style={menuStyle}
      className="select-dropdown overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-300/30"
    >
      {options.map((opt) => {
        const isSelected = String(opt.value) === String(currentValue);
        return (
          <li key={String(opt.value)} role="option" aria-selected={isSelected}>
            <button
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition ${
                isSelected
                  ? 'bg-primary-50 font-medium text-primary-800'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{opt.label}</span>
              {isSelected && <Check className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />}
            </button>
          </li>
        );
      })}
    </ul>,
    document.body
  );

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400"> *</span>}
        </label>
      )}
      <input
        type="hidden"
        name={name}
        value={currentValue ?? ''}
        ref={ref}
        required={required}
        readOnly
      />
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        className={`input-field select-trigger flex w-full items-center justify-between gap-2 text-left ${
          error ? 'border-red-500/50' : ''
        } ${open ? 'border-primary-500 ring-2 ring-primary-500/20' : ''} ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${selected ? '' : 'text-slate-400'}`}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {dropdown}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
});
