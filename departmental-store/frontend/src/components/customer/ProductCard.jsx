import { motion } from 'framer-motion';
import { Plus, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { getSellingPrice, getListPrice, hasProductOffer } from '../../utils/productPrice';

export const ProductCard = ({
  product,
  onAddToCart,
  loading = false,
  delay = 0,
  compact = false,
}) => {
  const outOfStock = product.stock === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="customer-product-card group flex flex-col"
    >
      <div className="customer-product-media relative overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-50 via-emerald-50 to-slate-50">
            <ShoppingBag className="h-10 w-10 text-primary-200" aria-hidden="true" />
          </div>
        )}
        {product.isTodaySpecial && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            Today&apos;s pick
          </span>
        )}
        {hasProductOffer(product) && (
          <span className="absolute right-3 top-3 rounded-full bg-primary-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
            Offer
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-4' : 'p-5'}`}>
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-primary-600">
          {product.category?.name || 'Fresh'}
        </div>
        <h3 className="customer-display line-clamp-2 font-semibold text-slate-900">{product.name}</h3>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">{formatCurrency(getSellingPrice(product))}</span>
          {hasProductOffer(product) && (
            <span className="text-sm text-slate-400 line-through">{formatCurrency(getListPrice(product))}</span>
          )}
          {product.unit && <span className="text-xs text-slate-500">/ {product.unit}</span>}
        </div>

        <p className={`mt-2 text-xs ${outOfStock ? 'font-medium text-red-500' : 'text-slate-500'}`}>
          {outOfStock ? 'Out of stock' : `${product.stock} available`}
        </p>

        {onAddToCart && (
          <Button
            className="mt-4 w-full"
            variant={outOfStock ? 'ghost' : 'primary'}
            onClick={() => onAddToCart(product.id)}
            disabled={outOfStock}
            loading={loading}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add to Cart
          </Button>
        )}
      </div>
    </motion.article>
  );
};
