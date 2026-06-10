import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/formatters';
import { ClipboardList, Package } from 'lucide-react';

export default function CustomerOrders() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll(),
  });

  const orders = data?.data || [];

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="customer-page-title">My Orders</h2>
        <p className="customer-page-subtitle">Track your deliveries and order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="customer-empty">
          <ClipboardList className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-lg font-medium text-slate-700">No orders yet</p>
          <p className="mt-1 text-sm text-slate-500">Place your first order and track it here.</p>
          <Link to="/customer/products" className="mt-6 inline-block">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <Card key={order.id} delay={i * 0.05}>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <p className="text-lg font-bold text-primary-600">{formatCurrency(order.total)}</p>
              </div>
              <div className="mt-4 space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.product?.name} × {item.quantity}</span>
                    <span className="font-medium text-slate-800">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
              {order.address && (
                <p className="mt-3 text-xs text-slate-500">Deliver to: {order.address}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
