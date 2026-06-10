import { Card } from '../../components/ui/Card';

const faqs = [
  { q: 'What areas do you deliver to?', a: 'We currently deliver within our local service area. Contact us to check availability.' },
  { q: 'What are your delivery hours?', a: 'Orders placed before 10 AM are delivered the same day between 2–8 PM.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), UPI, and Card payments.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they enter the Packing stage.' },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((f, i) => (
          <Card key={f.q} delay={i * 0.05}>
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
