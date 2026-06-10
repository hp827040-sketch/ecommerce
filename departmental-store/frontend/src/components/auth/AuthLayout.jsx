import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Leaf, Shield, Truck, Star } from 'lucide-react';

const highlights = [
  { icon: Leaf, text: 'Farm-fresh produce, handpicked daily' },
  { icon: Truck, text: 'Same-day delivery on orders before 10 AM' },
  { icon: Shield, text: 'Quality checked before every delivery' },
];

export const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="landing-theme relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/70 via-white to-slate-50"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />

      <Link
        to="/"
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/90 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-primary-200 hover:bg-white hover:text-primary-700 lg:left-8 lg:top-8"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to Home
      </Link>

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px]">
        <aside className="hidden flex-col justify-between px-12 py-16 lg:flex xl:px-16">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 transition hover:opacity-90">
              <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-gold-500 p-2.5 shadow-lg shadow-primary-500/25">
                <Leaf className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="landing-display text-2xl font-bold text-slate-900">
                Fresh<span className="text-gold-600">Basket</span>
              </span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-16 max-w-md"
            >
              <span className="landing-pill">
                <Star className="h-3 w-3 fill-gold-500 text-gold-500" aria-hidden="true" />
                Trusted by 5,000+ households
              </span>
              <h2 className="landing-display mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 xl:text-5xl">
                Groceries you trust,{' '}
                <span className="landing-gradient-text">delivered fresh</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Join your neighbourhood store for premium vegetables and daily essentials — order in minutes, enjoy same-day delivery.
              </p>
            </motion.div>

            <ul className="mt-12 space-y-4">
              {highlights.map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium">{text}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <blockquote className="max-w-sm rounded-2xl border border-slate-200/80 bg-white/70 p-5 text-sm text-slate-600 shadow-sm backdrop-blur-sm">
            <p className="leading-relaxed">
              &ldquo;Vegetables arrive crisp every single morning. FreshBasket is our family&apos;s daily ritual now.&rdquo;
            </p>
            <footer className="mt-3 text-xs font-semibold text-slate-900">— Priya Sharma, Koramangala</footer>
          </blockquote>
        </aside>

        <main className="flex items-center justify-center px-4 py-20 lg:px-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="landing-glass-strong rounded-3xl p-8 shadow-xl sm:p-10">
              <div className="mb-8 text-center lg:text-left">
                <Link to="/" className="mb-6 inline-flex items-center gap-2.5 transition hover:opacity-90 lg:hidden">
                  <div className="rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 p-2 shadow-md shadow-primary-500/20">
                    <Leaf className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <span className="landing-display text-xl font-bold text-slate-900">
                    Fresh<span className="text-gold-600">Basket</span>
                  </span>
                </Link>
                <h1 className="landing-display text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
                {subtitle && <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>}
              </div>

              {children && <div className="[&_label]:text-slate-700">{children}</div>}

              {footer && (
                <div className="mt-8 border-t border-slate-200/80 pt-6 text-center text-sm text-slate-500">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export const AuthError = ({ message }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
};
