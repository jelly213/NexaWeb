import { motion } from 'framer-motion';
import { X, Check, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Problem() {
  const { t, tProblemLeft, tProblemRight } = useLanguage();

  const leftItems = tProblemLeft();
  const rightItems = tProblemRight();

  return (
    <section id="problem" className="py-24 bg-[#070D1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-6">
            <AlertTriangle size={14} className="shrink-0" />
            {t('problem.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2">
            {t('problem.title')}
          </h2>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {t('problem.titleAccent')}
          </h2>
        </motion.div>

        {/* Comparison Columns */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left: Pain Points */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/60 border border-red-500/15 rounded-2xl p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <X size={14} className="text-red-400" />
              </div>
              <h3 className="text-base font-bold text-red-400">{t('problem.left.title')}</h3>
            </div>
            <ul className="space-y-4">
              {leftItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0">
                    <X size={11} className="text-red-400" />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/60 border border-blue-500/15 rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/4 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check size={14} className="text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-blue-400">{t('problem.right.title')}</h3>
            </div>
            <ul className="space-y-4 relative z-10">
              {rightItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-emerald-400" />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
