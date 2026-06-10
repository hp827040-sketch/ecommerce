import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const isNavActive = (pathname, to) =>
  pathname === to || (to !== '/admin' && pathname.startsWith(to));

export const AdminLayout = ({ navGroups, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = useMemo(
    () => navGroups.flatMap((group) => group.items),
    [navGroups]
  );

  const activeItem = navItems.find((item) => isNavActive(location.pathname, item.to));

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AD';

  return (
    <div className="admin-theme flex min-h-screen">
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-40 flex w-60 flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative flex h-full flex-col">
          <div className="admin-sidebar-glow pointer-events-none absolute inset-0" aria-hidden="true" />

          {/* Brand */}
          <div className="relative shrink-0 px-4 pb-4 pt-5">
            <Link to="/" className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.04]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 shadow-lg shadow-primary-900/40 ring-1 ring-white/10 transition group-hover:bg-primary-400">
                <Leaf className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="admin-display block truncate text-base font-bold text-white">
                  Hari<span className="text-primary-400">Basket</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="relative min-h-0 flex-1 overflow-y-auto px-3 pb-3 scrollbar-hide">
            <nav className="space-y-5" aria-label="Admin navigation">
              {navGroups.map((group, groupIndex) => (
                <div key={group.label}>
                  {groupIndex > 0 && <div className="admin-nav-divider mb-4" />}
                  <p className="admin-nav-section mb-1.5 px-3">{group.label}</p>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = isNavActive(location.pathname, item.to);
                      const Icon = item.icon;
                      return (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            className={`admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="admin-nav-rail"
                                className="admin-nav-rail"
                                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                              />
                            )}
                            <Icon className="admin-nav-link-icon" aria-hidden="true" />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="relative shrink-0 border-t border-white/[0.06] p-3">
            <div className="admin-user-card flex items-center gap-3 rounded-xl px-3 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-slate-900">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                <p className="flex items-center gap-1 truncate text-[11px] text-slate-500">
                  <ShieldCheck className="h-3 w-3 shrink-0 text-primary-400" aria-hidden="true" />
                  Administrator
                </p>
              </div>
            </div>
            <div className="mt-2 flex gap-1.5">
              <Link to="/" className="admin-sidebar-action flex-1">
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Store
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-sidebar-action admin-sidebar-action-danger"
                aria-label="Logout"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-60">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                <nav className="mb-0.5 flex items-center gap-1 text-xs text-slate-500" aria-label="Breadcrumb">
                  <span>{title}</span>
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                  <span className="font-medium text-slate-700">{activeItem?.label || title}</span>
                </nav>
                <h1 className="admin-display text-lg font-bold text-slate-900 lg:text-xl">
                  {activeItem?.label || title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <Link
                to="/admin/orders"
                className="hidden rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-500 sm:inline-flex"
              >
                View Orders
              </Link>
            </div>
          </div>
        </header>

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-4 lg:p-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};
