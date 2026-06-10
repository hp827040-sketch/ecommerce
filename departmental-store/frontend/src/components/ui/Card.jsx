import { motion } from 'framer-motion';

export const Card = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const StatCard = ({ title, value, icon: Icon, color = 'primary', delay = 0 }) => {
  const colors = {
    primary: 'from-primary-600/20 to-primary-500/5 text-primary-400',
    gold: 'from-gold-600/20 to-gold-500/5 text-gold-400',
    blue: 'from-blue-600/20 to-blue-500/5 text-blue-400',
    purple: 'from-purple-600/20 to-purple-500/5 text-purple-400',
  };

  return (
    <Card delay={delay} className={`bg-gradient-to-br ${colors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-xl bg-white/5 p-3">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
};
