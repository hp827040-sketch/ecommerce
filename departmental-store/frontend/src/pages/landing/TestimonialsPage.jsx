import { Card } from '../../components/ui/Card';
import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Priya Sharma', text: 'Fresh vegetables every morning. HariBasket has become our go-to store.', rating: 5 },
  { name: 'Rajesh Kumar', text: 'Great quality and fast delivery. The customer panel is very easy to use.', rating: 5 },
  { name: 'Anita Patel', text: 'Love the today\'s specials section. Always something fresh and seasonal.', rating: 5 },
];

export default function TestimonialsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <h1 className="text-3xl font-bold">What Our Customers Say</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Card key={t.name} delay={i * 0.1}>
            <div className="flex gap-1">
              {[...Array(t.rating)].map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600">"{t.text}"</p>
            <p className="mt-4 text-sm font-semibold text-gold-600">— {t.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
