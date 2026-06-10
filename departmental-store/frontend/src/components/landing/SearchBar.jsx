import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export const SearchBar = ({ className = '', placeholder = 'Search vegetables, fruits, groceries…', large = false }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputId = useId();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/fresh-collection?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/fresh-collection');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`} role="search">
      <label htmlFor={inputId} className="sr-only">Search products</label>
      <Search
        className={`pointer-events-none absolute left-4 text-slate-400 ${large ? 'top-4 h-5 w-5' : 'top-1/2 h-4 w-4 -translate-y-1/2'}`}
        aria-hidden="true"
      />
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`landing-search ${large ? 'py-4 pl-12 text-base' : ''}`}
        autoComplete="off"
      />
    </form>
  );
};
