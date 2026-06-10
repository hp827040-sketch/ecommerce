import { Card } from '../../components/ui/Card';
import { Package, Bike, Home } from 'lucide-react';

const steps = [
  { icon: Package, title: 'Place Order', desc: 'Browse products and add to cart. Checkout with your delivery details.' },
  { icon: Bike, title: 'We Pack & Deliver', desc: 'Our team packs your order fresh and delivers it to your address.' },
  { icon: Home, title: 'Enjoy at Home', desc: 'Receive fresh vegetables and groceries at your doorstep. Pay on delivery.' },
];

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <h1 className="text-3xl font-bold">How Delivery Works</h1>
      <div className="mt-8 space-y-6">
        {steps.map((s, i) => (
          <Card key={s.title} delay={i * 0.1}>
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary-100 p-3">
                <s.icon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
