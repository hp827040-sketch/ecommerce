import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { SectionHeader } from '../../components/landing/SectionHeader';
import { ProductCard, ProductCardSkeleton } from '../../components/landing/ProductCard';
import { SearchBar } from '../../components/landing/SearchBar';
import { useAuth } from '../../context/AuthContext';

export default function FreshCollectionPage() {
  const [params] = useSearchParams();
  const query = params.get('q')?.toLowerCase() || '';
  const categoryFilter = params.get('category')?.toLowerCase() || '';
  const { user } = useAuth();
  const shopLink = user?.role === 'CUSTOMER' ? '/customer/products' : '/register';

  const { data: specialsData, isLoading: specialsLoading } = useQuery({
    queryKey: ['today-specials'],
    queryFn: () => productService.getAll({ isTodaySpecial: true, status: 'ACTIVE' }),
  });

  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ['fresh-collection-all'],
    queryFn: () => productService.getAll({ status: 'ACTIVE' }),
    enabled: !specialsLoading && !(specialsData?.data?.length),
  });

  const isLoading = specialsLoading || allLoading;
  const source = specialsData?.data?.length ? specialsData.data : allData?.data || [];
  const products = useMemo(() => {
    let list = [...source];
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category?.name?.toLowerCase().includes(query)
      );
    }
    if (categoryFilter) {
      list = list.filter((p) => p.category?.name?.toLowerCase().includes(categoryFilter));
    }
    return list;
  }, [source, query, categoryFilter]);

  const pageTitle = query
    ? `Results for "${params.get('q')}"`
    : categoryFilter
      ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)
      : "Today's Fresh Collection";

  return (
    <div>
      <div className="border-b border-slate-200/80 bg-gradient-to-b from-primary-50/50 to-white px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Fresh picks"
            title={pageTitle}
            description="Handpicked fresh produce available today — order before 10 AM for same-day delivery."
          />
          <div className="mt-8 max-w-xl">
            <SearchBar large placeholder="Filter products…" />
          </div>
        </div>
      </div>

      <div className="landing-section">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="landing-glass rounded-2xl py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">No products found</p>
            <p className="mt-2 text-sm text-slate-600">Try a different search or browse all categories.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} shopLink={shopLink} badge="Fresh Today" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
