import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { cartService } from '../../services/cartService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

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

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="customer-page-title">Your Cart</h2>
        <p className="customer-page-subtitle">
          {items.length > 0 ? `${items.length} item${items.length !== 1 ? 's' : ''} in your basket` : 'Your basket is empty'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="customer-empty">
          <ShoppingCart className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-lg font-medium text-slate-700">Your cart is empty</p>
          <p className="mt-1 text-sm text-slate-500">Add some fresh products to get started.</p>
          <Link to="/customer/products" className="mt-6 inline-block">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <Card key={item.id}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary-100 to-emerald-50" />
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                      <p className="text-sm text-primary-600">{formatCurrency(item.product.price)} each</p>
                      <p className="text-sm font-medium text-slate-700">
                        {formatCurrency(Number(item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 bg-white p-1.5 transition hover:bg-slate-50"
                      onClick={() => updateQty.mutate({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) })}
                    >
                      <Minus className="h-4 w-4 text-slate-600" />
                    </button>
                    <span className="w-8 text-center font-medium text-slate-900">{item.quantity}</span>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 bg-white p-1.5 transition hover:bg-slate-50"
                      onClick={() => updateQty.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                    >
                      <Plus className="h-4 w-4 text-slate-600" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100"
                      onClick={() => removeItem.mutate(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="h-fit lg:sticky lg:top-24">
            <h3 className="font-semibold text-slate-900">Order Summary</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items ({cart?.summary?.itemCount})</span>
                <span>{formatCurrency(cart?.summary?.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-medium text-primary-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(cart?.summary?.total)}</span>
              </div>
            </div>
            <Link to="/customer/checkout" className="mt-6 block">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}
