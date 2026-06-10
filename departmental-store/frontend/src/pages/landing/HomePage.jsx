import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Leaf,
  Truck,
  Shield,
  Clock,
  Star,
  Users,
  BadgeCheck,
  Zap,
  Gift,
  Quote,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/landing/SearchBar';
import { SectionHeader } from '../../components/landing/SectionHeader';
import { ProductCard, ProductCardSkeleton } from '../../components/landing/ProductCard';
import { ProductImage } from '../../components/landing/ProductImage';

const trustStats = [
  { icon: Users, value: '5,000+', label: 'Happy customers' },
  { icon: Star, value: '4.9', label: 'Average rating' },
  { icon: Truck, value: 'Same-day', label: 'Local delivery' },
  { icon: BadgeCheck, value: '100%', label: 'Quality checked' },
];

const features = [
  { icon: Leaf, title: 'Farm Fresh', desc: 'Handpicked produce from trusted local farms, delivered at peak freshness.' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Order before 10 AM for same-day delivery between 2–8 PM.' },
  { icon: Shield, title: 'Quality Assured', desc: 'Every item inspected before it reaches your basket.' },
  { icon: Clock, title: 'Easy Ordering', desc: 'Browse, add to cart, and checkout in under two minutes.' },
];

const reviews = [
  { name: 'Priya Sharma', location: 'Koramangala', text: 'Vegetables arrive crisp every single morning. FreshBasket is our family\'s daily ritual now.', rating: 5 },
  { name: 'Rajesh Kumar', location: 'Indiranagar', text: 'The ordering panel is effortless. Quality beats every supermarket near us.', rating: 5 },
  { name: 'Anita Patel', location: 'Whitefield', text: 'Today\'s specials are always seasonal and fairly priced. Highly recommend!', rating: 5 },
];

const categoryIcons = ['🥬', '🍎', '🥛', '🍞', '🧴', '🌶️'];

export default function HomePage() {
  const { user } = useAuth();
  const shopLink = user?.role === 'CUSTOMER' ? '/customer/products' : '/register';

  const { data: specialsData, isLoading: specialsLoading } = useQuery({
    queryKey: ['landing-specials'],
    queryFn: () => productService.getAll({ isTodaySpecial: true, status: 'ACTIVE', limit: 8 }),
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['landing-featured'],
    queryFn: () => productService.getAll({ status: 'ACTIVE', limit: 8 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['landing-categories'],
    queryFn: () => categoryService.getAll({ status: 'ACTIVE' }),
  });

  const specials = specialsData?.data?.slice(0, 4) || [];
  const featured = featuredData?.data?.slice(0, 8) || [];
  const categories = categoriesData?.data?.slice(0, 6) || [];

  const recommended = user
    ? featured.slice(0, 4)
    : specials.length > 0
      ? specials
      : featured.slice(0, 4);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative px-4 pb-16 pt-8 lg:px-8 lg:pb-24 lg:pt-12" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/80 via-white to-slate-50" />
        <div className="absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-primary-200/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-gold-400/15 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="landing-pill">
              <Zap className="h-3 w-3" aria-hidden="true" />
              Same-day delivery · Order by 10 AM
            </span>

            <h1 id="hero-heading" className="landing-display mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              Premium groceries,{' '}
              <span className="landing-gradient-text">delivered fresh</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              FreshBasket brings farm-fresh vegetables and daily essentials to your door —
              curated quality, transparent pricing, and a shopping experience you&apos;ll love.
            </p>

            <div className="mt-8 max-w-xl">
              <SearchBar large />
              <p className="mt-2 text-xs text-slate-500">
                Popular: Tomatoes, Spinach, Apples, Milk
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={shopLink}>
                <Button className="px-7 py-3 text-base">
                  {user ? 'Continue Shopping' : 'Start Shopping'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/fresh-collection">
                <Button variant="ghost" className="px-7 py-3 text-base">
                  Today&apos;s Deals
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trustStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="landing-neu px-3 py-3 text-center"
                >
                  <stat.icon className="mx-auto h-4 w-4 text-primary-600" aria-hidden="true" />
                  <p className="landing-display mt-1 text-lg font-bold text-slate-900">{stat.value}</p>
                  <p className="text-[11px] text-slate-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative hidden lg:block"
            aria-hidden="true"
          >
            <div className="landing-glass-strong landing-float relative rounded-3xl p-6">
              <div className="grid grid-cols-2 gap-4">
                {(specials.length > 0 ? specials : featured).slice(0, 4).map((p, i) => (
                  <div key={p.id} className={`overflow-hidden rounded-2xl ${i === 1 ? 'mt-8' : ''}`}>
                    <div className="aspect-square">
                      <ProductImage src={p.image} alt={p.name} seed={i} />
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-800">{p.name}</p>
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-4 -right-4 landing-glass rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-xs font-medium text-slate-500">Fresh today</p>
                <p className="landing-display text-2xl font-bold text-primary-600">
                  {specials.length || featured.length}+ items
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-slate-200/80 bg-white/60 backdrop-blur-sm" aria-label="Trust indicators">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-5 lg:px-8">
          {[
            { icon: Leaf, text: 'Farm-sourced produce' },
            { icon: Truck, text: 'Free delivery over ₹499' },
            { icon: Shield, text: 'Quality guarantee' },
            { icon: Gift, text: '10% off first order' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Icon className="h-4 w-4 text-primary-600" aria-hidden="true" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="landing-section" aria-labelledby="categories-heading">
          <SectionHeader
            eyebrow="Browse by category"
            title="Find what you need, fast"
            description="Jump straight into your favourite aisle — fewer clicks, faster checkout."
            actionLabel="View all products"
            actionTo="/fresh-collection"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/fresh-collection?category=${encodeURIComponent(cat.name)}`}
                  className="landing-card flex flex-col items-center gap-3 p-5 text-center"
                >
                  <span className="text-3xl" aria-hidden="true">{categoryIcons[i % categoryIcons.length]}</span>
                  <span className="text-sm font-semibold text-slate-800">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Today's specials */}
      <section className="bg-gradient-to-b from-white to-primary-50/40" aria-labelledby="specials-heading">
        <div className="landing-section">
          <SectionHeader
            eyebrow="Limited today"
            title="Today's fresh picks"
            description="Seasonal favourites hand-selected this morning — grab them before they're gone."
            actionLabel="See full collection"
            actionTo="/fresh-collection"
          />
          <div id="specials-heading" className="sr-only">Today's fresh picks</div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {specialsLoading
              ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
              : specials.length > 0
                ? specials.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} shopLink={shopLink} badge="Fresh Today" />
                  ))
                : featured.slice(0, 4).map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} shopLink={shopLink} />
                  ))}
          </div>
        </div>
      </section>

      {/* Offer banner */}
      <section className="landing-section pt-8" aria-labelledby="offer-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="landing-offer-strip"
        >
          <div className="landing-shimmer pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                New customer offer
              </span>
              <h2 id="offer-heading" className="landing-display mt-4 text-3xl font-bold lg:text-4xl">
                Get 10% off your first order
              </h2>
              <p className="mt-2 max-w-md text-primary-50/90">
                Sign up today and enjoy premium produce at a welcome discount. Free delivery on orders above ₹499.
              </p>
            </div>
            <Link to="/register">
              <Button variant="gold" className="px-8 py-3.5 text-base shadow-lg">
                Claim Offer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Personalized / recommended */}
      <section className="landing-section" aria-labelledby="recommended-heading">
        <SectionHeader
          eyebrow={user ? `Welcome back, ${user.name?.split(' ')[0] || 'friend'}` : 'Curated for you'}
          title={user ? 'Pick up where you left off' : 'Recommended for you'}
          description={
            user
              ? 'Your favourites and bestsellers — one tap away from your cart.'
              : 'Popular picks loved by our community. Create an account to save your preferences.'
          }
          actionLabel="Browse all"
          actionTo={shopLink}
        />
        <div id="recommended-heading" className="sr-only">Recommended products</div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredLoading
            ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            : recommended.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} shopLink={shopLink} />
              ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-slate-50/80" aria-labelledby="featured-heading">
        <div className="landing-section">
          <SectionHeader
            eyebrow="Bestsellers"
            title="Featured products"
            description="Our most-loved items — consistently fresh, fairly priced, and always in stock."
            actionLabel="Shop all"
            actionTo="/fresh-collection"
          />
          <div id="featured-heading" className="sr-only">Featured products</div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredLoading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} shopLink={shopLink} />
                ))}
          </div>
        </div>
      </section>

      {/* Why FreshBasket */}
      <section className="landing-section" aria-labelledby="features-heading">
        <SectionHeader
          eyebrow="Why choose us"
          title="A premium experience, every delivery"
          description="We combine local sourcing with modern convenience — so you spend less time shopping and more time living."
        />
        <div id="features-heading" className="sr-only">Why FreshBasket</div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="landing-glass rounded-2xl p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <f.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-gradient-to-b from-primary-50/30 to-white" aria-labelledby="reviews-heading">
        <div className="landing-section">
          <SectionHeader
            eyebrow="Customer love"
            title="Trusted by thousands nearby"
            description="Real reviews from real neighbours — see why FreshBasket is the go-to for fresh groceries."
            actionLabel="Read more reviews"
            actionTo="/testimonials"
          />
          <div id="reviews-heading" className="sr-only">Customer reviews</div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <motion.blockquote
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="landing-card relative"
              >
                <Quote className="absolute right-5 top-5 h-8 w-8 text-primary-100" aria-hidden="true" />
                <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">&ldquo;{r.text}&rdquo;</p>
                <footer className="mt-5 border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.location}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-section pb-28" aria-labelledby="cta-heading">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="landing-glass-strong rounded-3xl px-8 py-14 text-center lg:px-16"
        >
          <h2 id="cta-heading" className="landing-display text-3xl font-bold text-slate-900 lg:text-4xl">
            Ready for fresher groceries?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Join thousands of happy customers. Browse today&apos;s collection, add to cart, and get delivery by evening.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to={shopLink}>
              <Button className="px-8 py-3.5 text-base">
                {user ? 'Go to Dashboard' : 'Create Free Account'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/fresh-collection">
              <Button variant="ghost" className="px-8 py-3.5 text-base">
                Browse Products
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
