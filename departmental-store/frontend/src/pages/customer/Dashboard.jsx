import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { StatCard, Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/formatters';
import { Package, Truck, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';

export default function CustomerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['customer-dashboard'],
    queryFn: () => customerService.getDashboard(),
  });

  const dashboard = data?.data;

  if (isLoading) return <div className="customer-empty h-64 animate-pulse" />;

  return (
    <div className="space-y-8">
      <div className="customer-welcome-banner">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-white/90">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Welcome back
            </p>
            <h2 className="customer-display text-2xl font-bold lg:text-3xl">
              Hello, {dashboard?.user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="mt-1 text-sm text-white/80">Fresh groceries delivered to your door.</p>
          </div>
          <Link to="/customer/products">
            <Button variant="gold" className="shadow-lg">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard title="Recent Orders" value={dashboard?.recentOrders?.length || 0} icon={Package} delay={0} />
        <StatCard title="Today's Specials" value={dashboard?.todayProducts?.length || 0} icon={ShoppingCart} color="gold" delay={0.1} />
        <StatCard
          title="Delivery Status"
          value={dashboard?.deliveryStatus ? ORDER_STATUS_LABELS[dashboard.deliveryStatus.status] : 'No active'}
          icon={Truck}
          color="blue"
          delay={0.2}
        />
      </div>

      {dashboard?.todayProducts?.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="customer-page-title text-lg">Today&apos;s Specials</h3>
              <p className="customer-page-subtitle text-sm">Hand-picked fresh picks for you</p>
            </div>
            <Link to="/customer/products"><Button variant="ghost">View All</Button></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dashboard.todayProducts.map((p, i) => (
              <Card key={p.id} delay={i * 0.05}>
                {p.image ? (
                  <img src={p.image} alt={p.name} className="aspect-video w-full rounded-xl object-cover" />
                ) : (
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-emerald-50" />
                )}
                <h4 className="mt-3 font-semibold text-slate-900">{p.name}</h4>
                <p className="text-sm text-slate-500">{p.category?.name}</p>
                <p className="mt-2 font-bold text-primary-600">{formatCurrency(p.price)}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {dashboard?.recentOrders?.length > 0 ? (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Recent Orders</h3>
            <Link to="/customer/orders" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {dashboard.recentOrders.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{formatDate(order.createdAt)}</p>
                  <p className="text-xs text-slate-500">{order.items?.length} items</p>
                </div>
                <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <p className="font-semibold text-slate-900">{formatCurrency(order.total)}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="customer-empty border-0 bg-transparent py-8">
            <Package className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-slate-500">No orders yet. Start shopping!</p>
            <Link to="/customer/products" className="mt-4 inline-block">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
