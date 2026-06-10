import { Card } from '../../components/ui/Card';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
          { icon: Mail, label: 'Email', value: 'hello@haribasket.com' },
          { icon: MapPin, label: 'Address', value: 'Main Market, Your City' },
        ].map((c, i) => (
          <Card key={c.label} delay={i * 0.1}>
            <c.icon className="h-6 w-6 text-primary-600" />
            <p className="mt-3 text-sm text-slate-600">{c.label}</p>
            <p className="mt-1 font-medium text-slate-900">{c.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
