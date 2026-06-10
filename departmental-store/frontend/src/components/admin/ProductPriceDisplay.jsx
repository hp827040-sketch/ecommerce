import { formatCurrency } from '../../utils/formatters';
import { getSellingPrice, getListPrice, hasProductOffer } from '../../utils/productPrice';

export const ProductPriceDisplay = ({ product, size = 'md' }) => {
  const selling = getSellingPrice(product);
  const list = getListPrice(product);
  const onOffer = hasProductOffer(product);

  const priceClass = size === 'sm' ? 'text-sm font-semibold' : 'text-base font-semibold';

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className={`${priceClass} text-slate-900`}>{formatCurrency(selling)}</span>
        {onOffer && (
          <span className="text-sm text-slate-400 line-through">{formatCurrency(list)}</span>
        )}
      </div>
      {product.unit && (
        <p className="text-xs text-slate-500">per {product.unit}</p>
      )}
    </div>
  );
};
