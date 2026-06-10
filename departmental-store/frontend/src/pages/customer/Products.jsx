import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { cartService } from '../../services/cartService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { formatCurrency } from '../../utils/formatters';
import { Plus, ShoppingBag } from 'lucide-react';

export default function CustomerProducts() {
  const [categoryId, setCategoryId] = useState('');
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll({ status: 'ACTIVE' }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => productService.getAll({ status: 'ACTIVE', ...(categoryId && { categoryId }) }),
  });

  const addToCart = useMutation({
    mutationFn: (productId) => cartService.add({ productId, quantity: 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const products = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="customer-page-title">Products</h2>
          <p className="customer-page-subtitle">Fresh vegetables & daily essentials</p>
        </div>
        <Select
          className="w-52"
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={[
            { value: '', label: 'All Categories' },
            ...(categories?.data || []).map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="customer-empty">
          <ShoppingBag className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-slate-500">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Card key={p.id} delay={i * 0.03} className="flex flex-col">
              {p.image ? (
                <img src={p.image} alt={p.name} className="aspect-video w-full rounded-xl object-cover" />
              ) : (
                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-emerald-50" />
              )}
              <div className="mt-4 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{p.name}</h3>
                    <p className="text-sm text-slate-500">{p.category?.name}</p>
                  </div>
                  {p.isTodaySpecial && (
                    <span className="shrink-0 rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-600">
                      Special
                    </span>
                  )}
                </div>
                <p className="mt-2 text-lg font-bold text-primary-600">{formatCurrency(p.price)}</p>
                <p className={`text-xs ${p.stock === 0 ? 'text-red-500' : 'text-slate-400'}`}>
                  {p.stock === 0 ? 'Out of stock' : `${p.stock} in stock`}
                </p>
                <Button
                  className="mt-4 w-full"
                  variant={p.stock === 0 ? 'ghost' : 'primary'}
                  onClick={() => addToCart.mutate(p.id)}
                  disabled={p.stock === 0}
                  loading={addToCart.isPending}
                >
                  <Plus className="h-4 w-4" /> Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
