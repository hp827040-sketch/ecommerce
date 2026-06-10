import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { PageHeader } from '../../components/customer/PageHeader';
import { EmptyState } from '../../components/customer/EmptyState';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ClipboardList, Package, MapPin } from 'lucide-react';

export default function CustomerOrders() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll(),
  });

  const orders = data?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-16 animate-pulse rounded-2xl bg-white" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Orders"
        description="Track deliveries and review your order history."
        action={
          orders.length > 0 ? (
            <Link to="/customer/products">
              <Button variant="ghost">Order Again</Button>
            </Link>
          ) : null
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Place your first order and track its delivery status here."
          actionLabel="Start Shopping"
          actionTo="/customer/products"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="customer-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Package className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <StatusBadge status={order.status} />
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(order.total)}</p>
                </div>
              </div>

              <div className="space-y-2 px-5 py-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {item.product?.name}
                      <span className="text-slate-400"> × {item.quantity}</span>
                    </span>
                    <span className="font-medium text-slate-800">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>

              {order.address && (
                <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3 text-xs text-slate-500">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  <span>Deliver to: {order.address}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
