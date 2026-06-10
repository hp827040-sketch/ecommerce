import { motion } from 'framer-motion';

const styles = {
  primary: {
    card: 'border-primary-100 bg-gradient-to-br from-primary-50 to-white',
    icon: 'bg-primary-100 text-primary-600',
  },
  gold: {
    card: 'border-amber-100 bg-gradient-to-br from-amber-50 to-white',
    icon: 'bg-amber-100 text-amber-600',
  },
  blue: {
    card: 'border-blue-100 bg-gradient-to-br from-blue-50 to-white',
    icon: 'bg-blue-100 text-blue-600',
  },
  purple: {
    card: 'border-purple-100 bg-gradient-to-br from-purple-50 to-white',
    icon: 'bg-purple-100 text-purple-600',
  },
};

export const CustomerStatCard = ({ title, value, icon: Icon, color = 'primary', delay = 0, hint }) => {
  const s = styles[color] || styles.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`customer-stat border ${s.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="customer-display mt-2 truncate text-2xl font-bold text-slate-900 lg:text-3xl">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        {Icon && (
          <div className={`shrink-0 rounded-xl p-3 ${s.icon}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
