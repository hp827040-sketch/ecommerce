import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { cartService } from '../../services/cartService';
import { PageHeader } from '../../components/customer/PageHeader';
import { ProductCard } from '../../components/customer/ProductCard';
import { EmptyState } from '../../components/customer/EmptyState';
import { ShoppingBag } from 'lucide-react';

export default function CustomerProducts() {
  const [categoryId, setCategoryId] = useState('');
  const [addingId, setAddingId] = useState(null);
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
    onMutate: (productId) => setAddingId(productId),
    onSettled: () => setAddingId(null),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const products = data?.data || [];
  const categoryList = categories?.data || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Fresh Products"
        description="Browse vegetables, fruits, and daily essentials — add to cart in one tap."
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryId('')}
          className={`customer-category-pill ${!categoryId ? 'customer-category-pill-active' : ''}`}
        >
          All
        </button>
        {categoryList.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoryId(c.id)}
            className={`customer-category-pill ${categoryId === c.id ? 'customer-category-pill-active' : ''}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products found"
          description="Try another category or check back later for new arrivals."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              delay={i * 0.03}
              onAddToCart={(id) => addToCart.mutate(id)}
              loading={addingId === p.id && addToCart.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
