import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const SectionHeader = ({ eyebrow, title, description, actionLabel, actionTo }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
  >
    <div className="max-w-2xl">
      {eyebrow && <span className="landing-pill">{eyebrow}</span>}
      <h2 className="landing-display mt-3 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
      )}
    </div>
    {actionLabel && actionTo && (
      <Link
        to={actionTo}
        className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 transition hover:text-primary-700"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    )}
  </motion.div>
);
