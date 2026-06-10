import { ORDER_STATUS_LABELS } from '../../utils/formatters';

const STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  PACKING: 'bg-blue-50 text-blue-700 ring-blue-200',
  OUT_FOR_DELIVERY: 'bg-purple-50 text-purple-700 ring-purple-200',
  DELIVERED: 'bg-primary-50 text-primary-700 ring-primary-200',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-200',
};

export const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
      STATUS_STYLES[status] || 'bg-slate-50 text-slate-600 ring-slate-200'
    }`}
  >
    {ORDER_STATUS_LABELS[status] || status}
  </span>
);
