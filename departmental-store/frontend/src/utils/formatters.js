export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export const ORDER_STATUS_COLORS = {
  PENDING: 'bg-amber-500/20 text-amber-300',
  PACKING: 'bg-blue-500/20 text-blue-300',
  OUT_FOR_DELIVERY: 'bg-purple-500/20 text-purple-300',
  DELIVERED: 'bg-primary-500/20 text-primary-300',
  CANCELLED: 'bg-red-500/20 text-red-300',
};

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  PACKING: 'Packing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};
