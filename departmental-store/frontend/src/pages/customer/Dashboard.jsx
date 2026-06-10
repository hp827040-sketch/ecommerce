import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { cartService } from '../../services/cartService';
import { CustomerStatCard } from '../../components/customer/CustomerStatCard';
import { ProductCard } from '../../components/customer/ProductCard';
import { QuickActions } from '../../components/customer/QuickActions';
import { EmptyState } from '../../components/customer/EmptyState';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from '../../utils/formatters';
import {
  Package,
  Truck,
  Sparkles,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  User,
  ArrowRight,
  Leaf,
} from 'lucide-react';

export default function CustomerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['customer-dashboard'],
    queryFn: () => customerService.getDashboard(),
  });

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.get(),
  });

  const dashboard = data?.data;
  const cartCount = cartData?.data?.summary?.itemCount || 0;
  const firstName = dashboard?.user?.name?.split(' ')[0] || 'there';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-2xl bg-white" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  const deliveryLabel = dashboard?.deliveryStatus
    ? ORDER_STATUS_LABELS[dashboard.deliveryStatus.status] || 'In progress'
    : 'None';

  return (
    <div className="space-y-8">
      <div className="customer-hero">
        <div className="customer-hero-accent" aria-hidden="true" />
        <div className="customer-hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center justify-between gap-6 pl-3">
          <div className="max-w-xl">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-primary-600">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Welcome back
            </p>
            <h2 className="customer-display text-2xl font-bold text-slate-900 lg:text-3xl">
              Hello, {firstName}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Your fresh groceries hub — browse today&apos;s picks, track orders, and reorder in seconds.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/customer/products">
                <Button>
                  Shop Fresh Picks
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              {cartCount > 0 && (
                <Link to="/customer/cart">
                  <Button variant="ghost">
                    View Cart ({cartCount})
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-emerald-50 lg:flex">
            <Leaf className="h-12 w-12 text-primary-500" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <CustomerStatCard
          title="Recent Orders"
          value={dashboard?.recentOrders?.length || 0}
          icon={Package}
          color="primary"
          hint="Last few purchases"
          delay={0}
        />
        <CustomerStatCard
          title="Today's Specials"
          value={dashboard?.todayProducts?.length || 0}
          icon={ShoppingBag}
          color="gold"
          hint="Curated for you"
          delay={0.05}
        />
        <CustomerStatCard
          title="Delivery"
          value={deliveryLabel}
          icon={Truck}
          color="blue"
          hint={dashboard?.deliveryStatus ? 'Active order' : 'All caught up'}
          delay={0.1}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {dashboard?.todayProducts?.length > 0 ? (
            <div className="customer-panel">
              <div className="customer-panel-header">
                <div>
                  <h3 className="customer-display font-semibold text-slate-900">Today&apos;s Specials</h3>
                  <p className="text-sm text-slate-500">Hand-picked fresh items at great prices</p>
                </div>
                <Link to="/customer/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  View all
                </Link>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                {dashboard.todayProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={i * 0.04} compact />
                ))}
              </div>
            </div>
          ) : (
            <div className="customer-panel p-6">
              <EmptyState
                icon={ShoppingBag}
                title="No specials today"
                description="Check back soon or browse our full catalog."
                actionLabel="Browse Products"
                actionTo="/customer/products"
              />
            </div>
          )}

          <div className="customer-panel">
            <div className="customer-panel-header">
              <h3 className="customer-display font-semibold text-slate-900">Recent Orders</h3>
              <Link to="/customer/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            {(dashboard?.recentOrders || []).length === 0 ? (
              <div className="px-5 pb-8">
                <EmptyState
                  icon={Package}
                  title="No orders yet"
                  description="Your order history will appear here once you shop."
                  actionLabel="Start Shopping"
                  actionTo="/customer/products"
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {dashboard.recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{formatDate(order.createdAt)}</p>
                      <p className="text-sm text-slate-500">{order.items?.length} items</p>
                    </div>
                    <StatusBadge status={order.status} />
                    <p className="font-semibold text-slate-900">{formatCurrency(order.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <QuickActions
            items={[
              { to: '/customer/products', label: 'Browse Products', icon: ShoppingBag },
              { to: '/customer/cart', label: 'Your Cart', icon: ShoppingCart, badge: cartCount },
              { to: '/customer/orders', label: 'Track Orders', icon: ClipboardList },
              { to: '/customer/profile', label: 'Edit Profile', icon: User },
            ]}
          />

          <div className="customer-card bg-gradient-to-br from-primary-600 to-emerald-600 p-5 text-white">
            <p className="text-sm font-medium text-primary-100">Free delivery</p>
            <p className="customer-display mt-2 text-xl font-bold">On every order</p>
            <p className="mt-2 text-sm text-primary-100">
              Fresh produce delivered to your doorstep — fast and reliable.
            </p>
            <Link
              to="/customer/products"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-primary-100"
            >
              Shop now <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
