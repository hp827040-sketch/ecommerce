import { Card } from '../../components/ui/Card';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <Card>
        <h1 className="text-3xl font-bold">About HariBasket</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          HariBasket is a premium local departmental store specializing in fresh vegetables,
          fruits, and daily essentials. We partner with trusted local farmers to bring you
          the freshest produce at fair prices — delivered with care to your home.
        </p>
      </Card>
    </div>
  );
}
