import { Package } from 'lucide-react';

const GRADIENTS = [
  'from-primary-100 to-emerald-50',
  'from-amber-50 to-orange-50',
  'from-lime-50 to-green-50',
  'from-teal-50 to-cyan-50',
];

export const ProductImage = ({ src, alt, seed = 0, className = '' }) => {
  const gradient = GRADIENTS[seed % GRADIENTS.length];

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} ${className}`}>
      <Package className="h-10 w-10 text-primary-400/60" aria-hidden="true" />
    </div>
  );
};
