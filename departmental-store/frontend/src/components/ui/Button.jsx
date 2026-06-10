import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  gold: 'btn-gold',
  ghost: 'btn-ghost',
};

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${variants[variant]} ${className} ${disabled || loading ? 'opacity-60 pointer-events-none' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </motion.button>
  );
};
