import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { cartService } from '../../services/cartService';
import { PageHeader } from '../../components/customer/PageHeader';
import { EmptyState } from '../../components/customer/EmptyState';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { getSellingPrice } from '../../utils/productPrice';
import { Minus, Plus, Trash2, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';

export default function CustomerCart() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.get(),
  });

  const updateQty = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.update({ productId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeItem = useMutation({
    mutationFn: (productId) => cartService.remove({ productId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const cart = data?.data;
  const items = cart?.items || [];

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white" />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Cart"
        description={
          items.length > 0
            ? `${items.length} item${items.length !== 1 ? 's' : ''} ready for checkout`
            : 'Your basket is empty — add fresh items to get started'
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Discover fresh vegetables, fruits, and daily essentials."
          actionLabel="Browse Products"
          actionTo="/customer/products"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="customer-cart-item">
                <div className="flex items-center gap-4">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-emerald-50">
                      <ShoppingCart className="h-6 w-6 text-primary-300" aria-hidden="true" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                    <p className="text-sm text-slate-500">{formatCurrency(getSellingPrice(item.product))} each</p>
                    <p className="mt-1 font-semibold text-primary-600">
                      {formatCurrency(getSellingPrice(item.product) * item.quantity)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="customer-qty-btn"
                    onClick={() =>
                      updateQty.mutate({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) })
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-slate-900">{item.quantity}</span>
                  <button
                    type="button"
                    className="customer-qty-btn"
                    onClick={() => updateQty.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100"
                    onClick={() => removeItem.mutate(item.productId)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="customer-summary-card">
            <h3 className="customer-display font-semibold text-slate-900">Order Summary</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart?.summary?.itemCount} items)</span>
                <span className="font-medium text-slate-900">{formatCurrency(cart?.summary?.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                  Delivery
                </span>
                <span className="font-semibold text-primary-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(cart?.summary?.total)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-500" aria-hidden="true" />
              Secure checkout with cash on delivery available
            </div>

            <Link to="/customer/checkout" className="mt-5 block">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
            <Link
              to="/customer/products"
              className="mt-3 block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
