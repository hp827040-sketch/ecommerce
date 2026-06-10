import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { PageHeader } from '../../components/admin/PageHeader';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShoppingBag, Clock, CheckCircle, IndianRupee, Users, ArrowRight, Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboard(),
  });

  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-2xl bg-white" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Overview"
        description="Monitor orders, revenue, and store activity at a glance."
        action={
          <Link to="/admin/orders">
            <Button>
              Manage Orders
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <AdminStatCard title="Today's Orders" value={stats?.todayOrders || 0} icon={ShoppingBag} color="gold" delay={0} />
        <AdminStatCard title="Pending" value={stats?.pendingOrders || 0} icon={Clock} color="primary" delay={0.05} />
        <AdminStatCard title="Delivered" value={stats?.deliveredOrders || 0} icon={CheckCircle} color="blue" delay={0.1} />
        <AdminStatCard title="Revenue" value={formatCurrency(stats?.revenue || 0)} icon={IndianRupee} color="gold" delay={0.15} />
        <AdminStatCard title="Customers" value={stats?.totalCustomers || 0} icon={Users} color="purple" delay={0.2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="admin-table-wrap lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="admin-display font-semibold text-slate-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          {(stats?.recentOrders || []).length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">No recent orders</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentOrders || []).map((order) => (
                    <tr key={order.id}>
                      <td className="font-medium text-slate-900">{order.user?.name}</td>
                      <td className="text-slate-500">{formatDate(order.createdAt)}</td>
                      <td><StatusBadge status={order.status} /></td>
                      <td className="text-right font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="admin-card p-5">
            <h3 className="admin-display font-semibold text-slate-900">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              {[
                { to: '/admin/products', label: 'Add Product', icon: Package },
                { to: '/admin/orders', label: 'Process Orders', icon: ShoppingBag },
                { to: '/admin/enquiries', label: 'View Enquiries', icon: Users },
              ].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-700"
                >
                  <Icon className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  {label}
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-400" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="admin-card bg-gradient-to-br from-primary-600 to-primary-500 p-5 text-white">
            <p className="text-sm font-medium text-primary-100">Store Performance</p>
            <p className="admin-display mt-2 text-2xl font-bold">
              {stats?.deliveredOrders || 0} delivered
            </p>
            <p className="mt-1 text-sm text-primary-100">
              {stats?.pendingOrders || 0} orders awaiting action
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
