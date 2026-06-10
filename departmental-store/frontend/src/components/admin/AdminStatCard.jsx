import { motion } from 'framer-motion';

const styles = {
  primary: {
    card: 'border-primary-100 bg-gradient-to-br from-primary-50 to-white',
    icon: 'bg-primary-100 text-primary-600',
    value: 'text-slate-900',
  },
  gold: {
    card: 'border-gold-200/60 bg-gradient-to-br from-amber-50 to-white',
    icon: 'bg-amber-100 text-gold-600',
    value: 'text-slate-900',
  },
  blue: {
    card: 'border-blue-100 bg-gradient-to-br from-blue-50 to-white',
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-slate-900',
  },
  purple: {
    card: 'border-purple-100 bg-gradient-to-br from-purple-50 to-white',
    icon: 'bg-purple-100 text-purple-600',
    value: 'text-slate-900',
  },
  red: {
    card: 'border-red-100 bg-gradient-to-br from-red-50 to-white',
    icon: 'bg-red-100 text-red-600',
    value: 'text-slate-900',
  },
};

export const AdminStatCard = ({ title, value, icon: Icon, color = 'primary', delay = 0, trend }) => {
  const s = styles[color] || styles.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`admin-stat border ${s.card}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`admin-display mt-2 text-3xl font-bold ${s.value}`}>{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-slate-500">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className={`rounded-xl p-3 ${s.icon}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
