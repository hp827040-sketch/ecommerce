import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Menu, X, ShoppingBag, Phone, Mail, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/landing/SearchBar';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/fresh-collection', label: "Today's Fresh" },
  { to: '/delivery', label: 'Delivery' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

const footerLinks = {
  Shop: [
    { to: '/fresh-collection', label: "Today's Collection" },
    { to: '/register', label: 'Create Account' },
    { to: '/delivery', label: 'Delivery Info' },
  ],
  Company: [
    { to: '/about', label: 'About Us' },
    { to: '/testimonials', label: 'Reviews' },
    { to: '/contact', label: 'Contact' },
    { to: '/enquiry', label: 'Enquiry' },
  ],
  Support: [
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Help Center' },
  ],
};

export const LandingLayout = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const shopLink = user?.role === 'CUSTOMER' ? '/customer/products' : '/register';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="landing-theme min-h-screen">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'landing-glass-strong shadow-md' : 'bg-white/60 backdrop-blur-xl'
        } border-b border-slate-200/60`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="FreshBasket home">
            <div className="rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 p-2 shadow-md shadow-primary-500/20">
              <Leaf className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="landing-display text-xl font-bold text-slate-900">
              Fresh<span className="text-gold-600">Basket</span>
            </span>
          </Link>

          <div className="hidden flex-1 px-4 lg:block lg:max-w-md xl:max-w-lg">
            <SearchBar placeholder="Search products…" />
          </div>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to={shopLink}>
              <Button variant="gold" className="hidden sm:inline-flex">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {user ? 'Shop Now' : 'Get Started'}
              </Button>
            </Link>
            {user ? (
              <Link to={user.role === 'ADMIN' ? '/admin' : '/customer'}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
            )}
          </div>

          <button
            className="ml-auto rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:ml-0"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-slate-200 lg:hidden"
            >
              <div className="space-y-4 px-4 py-4">
                <SearchBar placeholder="Search products…" />
                <nav className="space-y-1" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                        location.pathname === link.to
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex gap-2 pt-2">
                  <Link to={shopLink} className="flex-1">
                    <Button className="w-full">{user ? 'Shop Now' : 'Get Started'}</Button>
                  </Link>
                  {!user && (
                    <Link to="/login" className="flex-1">
                      <Button variant="ghost" className="w-full">Login</Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-[4.5rem]">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 p-2">
                  <Leaf className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <span className="landing-display text-xl font-bold text-slate-900">
                  Fresh<span className="text-gold-600">Basket</span>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
                Premium fresh vegetables and daily essentials, delivered with care to your doorstep.
              </p>
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary-600" aria-hidden="true" /> +91 98765 43210</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-600" aria-hidden="true" /> hello@freshbasket.com</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-600" aria-hidden="true" /> Main Market, Your City</p>
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">{title}</h3>
                <ul className="mt-4 space-y-2">
                  {links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-sm text-slate-600 transition hover:text-primary-600">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} FreshBasket. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              Farm fresh · Same-day delivery · Quality guaranteed
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
