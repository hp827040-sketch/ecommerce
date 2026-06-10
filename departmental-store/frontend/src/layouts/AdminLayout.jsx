import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Bell,
  ShieldCheck,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const SIDEBAR_COLLAPSED_KEY = 'admin-sidebar-collapsed';

const isNavActive = (pathname, to) =>
  pathname === to || (to !== '/admin' && pathname.startsWith(to));

export const AdminLayout = ({ navGroups, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });
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

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
    } catch {
      // ignore storage errors
    }
  }, [sidebarCollapsed]);

  const toggleSidebarCollapsed = () => setSidebarCollapsed((prev) => !prev);

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
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-40 flex flex-col transition-[width,transform] duration-300 ease-out lg:translate-x-0 ${
          sidebarCollapsed ? 'w-[4.5rem]' : 'w-[17.5rem]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="relative flex h-full flex-col overflow-hidden">
          <div className="admin-sidebar-accent pointer-events-none absolute inset-y-0 left-0 w-1" aria-hidden="true" />

          {/* Brand */}
          <div
            className={`relative shrink-0 border-b border-slate-200/80 ${
              sidebarCollapsed ? 'flex justify-center px-2 py-4' : 'p-5'
            }`}
          >
            <Link
              to="/"
              className={`group ${sidebarCollapsed ? 'flex' : 'flex items-center gap-3'}`}
              title={sidebarCollapsed ? 'FreshBasket Admin' : undefined}
            >
              <div className="rounded-2xl bg-gradient-to-br from-primary-500 via-primary-400 to-emerald-400 p-2.5 shadow-lg shadow-primary-500/30 transition group-hover:scale-105">
                <Leaf className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <span className="admin-display block truncate text-lg font-bold leading-tight text-slate-900">
                    Fresh<span className="text-primary-600">Basket</span>
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <ShieldCheck className="h-3 w-3 text-primary-500" aria-hidden="true" />
                    Admin Panel
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Collapse toggle — desktop */}
          <div className={`hidden shrink-0 border-b border-slate-200/80 lg:block ${sidebarCollapsed ? 'px-2 py-2' : 'px-3 py-2'}`}>
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className="admin-sidebar-toggle w-full"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation */}
          <div
            className={`relative min-h-0 flex-1 overflow-y-auto py-4 scrollbar-hide ${
              sidebarCollapsed ? 'px-2' : 'px-3'
            }`}
          >
            <nav className={sidebarCollapsed ? 'space-y-3' : 'space-y-6'} aria-label="Admin navigation">
              {navGroups.map((group, groupIndex) => (
                <div key={group.label}>
                  {sidebarCollapsed ? (
                    groupIndex > 0 && <div className="admin-nav-group-divider" />
                  ) : (
                    <p className="admin-nav-section mb-2 px-3">{group.label}</p>
                  )}
                  <ul className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = isNavActive(location.pathname, item.to);
                      const Icon = item.icon;
                      return (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            title={sidebarCollapsed ? item.label : undefined}
                            className={`admin-nav-link group ${isActive ? 'admin-nav-link-active' : ''} ${
                              sidebarCollapsed ? 'admin-nav-link-collapsed' : ''
                            }`}
                          >
                            {isActive && !sidebarCollapsed && (
                              <motion.span
                                layoutId="admin-nav-indicator"
                                className="admin-nav-indicator"
                                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                              />
                            )}
                            <span className={`admin-nav-icon ${isActive ? 'admin-nav-icon-active' : ''}`}>
                              <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
                            </span>
                            {!sidebarCollapsed && (
                              <>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate font-medium">{item.label}</span>
                                  {item.description && (
                                    <span
                                      className={`block truncate text-[11px] ${
                                        isActive ? 'text-primary-700/80' : 'text-slate-400 group-hover:text-slate-500'
                                      }`}
                                    >
                                      {item.description}
                                    </span>
                                  )}
                                </span>
                                {isActive && (
                                  <ChevronRight className="relative z-10 h-4 w-4 shrink-0 text-primary-600/70" aria-hidden="true" />
                                )}
                              </>
                            )}
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
          <div
            className={`relative shrink-0 border-t border-slate-200/80 ${
              sidebarCollapsed ? 'p-2' : 'p-4'
            }`}
          >
            <div
              className={`admin-user-card mb-3 flex items-center rounded-2xl ${
                sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-3'
              }`}
              title={sidebarCollapsed ? user?.name : undefined}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 text-sm font-bold text-white shadow-md shadow-primary-500/25">
                {initials}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                    <ShieldCheck className="h-3 w-3 shrink-0 text-primary-500" aria-hidden="true" />
                    Administrator
                  </p>
                </div>
              )}
            </div>
            <div className={sidebarCollapsed ? 'flex flex-col gap-2' : 'grid grid-cols-2 gap-2'}>
              <Link
                to="/"
                className={`admin-sidebar-action admin-sidebar-action-primary ${
                  sidebarCollapsed ? 'admin-sidebar-action-icon' : ''
                }`}
                title="View Store"
                aria-label="View Store"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                {!sidebarCollapsed && 'Store'}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={`admin-sidebar-action admin-sidebar-action-danger ${
                  sidebarCollapsed ? 'admin-sidebar-action-icon' : ''
                }`}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                {!sidebarCollapsed && 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`flex min-h-screen flex-1 flex-col transition-[margin] duration-300 ease-out ${
          sidebarCollapsed ? 'lg:ml-[4.5rem]' : 'lg:ml-[17.5rem]'
        }`}
      >
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
              <button
                type="button"
                className="hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 lg:flex"
                onClick={toggleSidebarCollapsed}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <PanelLeft className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
                )}
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
