import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { ProductImage } from './ProductImage';
import { Button } from '../ui/Button';

export const ProductCard = ({ product, index = 0, shopLink, badge }) => {
  const ctaLink = shopLink || '/register';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="landing-card group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50">
        <ProductImage
          src={product.image}
          alt={product.name}
          seed={index}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 landing-pill bg-white/90 backdrop-blur-sm">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {badge}
          </span>
        )}
        {product.isTodaySpecial && !badge && (
          <span className="absolute left-3 top-3 landing-pill bg-white/90 backdrop-blur-sm">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Today&apos;s Pick
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
          {product.category?.name || 'Fresh Produce'}
        </p>
        <h3 className="mt-1 font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
        <div className="mt-auto pt-3">
          <p className="text-xl font-bold text-slate-900">{formatCurrency(product.price)}</p>
          {product.unit && (
            <p className="text-xs text-slate-500">per {product.unit}</p>
          )}
        </div>
      </div>

      <Link to={ctaLink} className="mt-4 block">
        <Button className="w-full" variant={shopLink ? 'primary' : 'gold'}>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {shopLink ? 'Add to Cart' : 'Shop Now'}
          <ArrowRight className="h-4 w-4 opacity-70" aria-hidden="true" />
        </Button>
      </Link>
    </motion.article>
  );
};

export const ProductCardSkeleton = () => (
  <div className="landing-card animate-pulse">
    <div className="aspect-square rounded-xl bg-slate-100" />
    <div className="mt-4 h-3 w-16 rounded bg-slate-100" />
    <div className="mt-2 h-5 w-3/4 rounded bg-slate-100" />
    <div className="mt-4 h-6 w-20 rounded bg-slate-100" />
    <div className="mt-4 h-10 rounded-xl bg-slate-100" />
  </div>
);
