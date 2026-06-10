import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/admin/PageHeader';
import { Button } from '../../components/ui/Button';
import { FileText, ArrowRight, Download } from 'lucide-react';

export default function AdminInvoices() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Generate and manage PDF invoices for delivered orders."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
            <FileText className="h-6 w-6 text-primary-600" aria-hidden="true" />
          </div>
          <h3 className="admin-display mt-4 text-lg font-semibold text-slate-900">Generate Invoices</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Invoices are created from delivered orders via the API. Navigate to Orders,
            mark an order as delivered, then generate its invoice.
          </p>
          <Link to="/admin/orders" className="mt-5 inline-block">
            <Button variant="ghost">
              Go to Orders
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        <div className="admin-card border-dashed p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <Download className="h-6 w-6 text-slate-500" aria-hidden="true" />
          </div>
          <h3 className="admin-display mt-4 text-lg font-semibold text-slate-900">API Endpoint</h3>
          <p className="mt-2 text-sm text-slate-600">
            Use the following endpoint to generate a PDF invoice:
          </p>
          <code className="mt-4 block rounded-xl bg-slate-900 px-4 py-3 text-sm text-primary-300">
            POST /api/invoices/generate/:orderId
          </code>
          <p className="mt-3 text-xs text-slate-500">
            Requires admin authentication. Order must be in DELIVERED status.
          </p>
        </div>
      </div>
    </div>
  );
}
