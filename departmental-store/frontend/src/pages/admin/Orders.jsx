import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';
import { PageHeader } from '../../components/admin/PageHeader';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { EmptyState } from '../../components/admin/EmptyState';
import { Select } from '../../components/ui/Input';
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from '../../utils/formatters';
import { ClipboardList } from 'lucide-react';

const statuses = ['PENDING', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderService.getAll(),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => orderService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const orders = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Track and update order statuses from pending to delivered."
      />

      {isLoading ? (
        <div className="admin-card h-48 animate-pulse" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Orders placed by customers will appear here."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="admin-card overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-slate-900">{order.user?.name}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {order.phone} · {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{order.address}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="admin-display text-xl font-bold text-slate-900">{formatCurrency(order.total)}</p>
                  <Select
                    className="w-48"
                    value={order.status}
                    onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                    options={statuses.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] }))}
                  />
                </div>
              </div>
              <div className="bg-slate-50/50 px-5 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Order Items</p>
                <div className="space-y-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-700">
                        {item.product?.name} <span className="text-slate-400">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
