import { motion } from 'framer-motion';
import { DollarSign, FileText, Rocket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const icons = [DollarSign, FileText, Rocket];

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      num: t('hiw.step1.num'),
      title: t('hiw.step1.title'),
      desc: t('hiw.step1.desc'),
    },
    {
      num: t('hiw.step2.num'),
      title: t('hiw.step2.title'),
      desc: t('hiw.step2.desc'),
    },
    {
      num: t('hiw.step3.num'),
      title: t('hiw.step3.title'),
      desc: t('hiw.step3.desc'),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
            {t('hiw.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            {t('hiw.title')}{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t('hiw.titleAccent')}
            </span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-6 mb-14">
          {steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {/* Connector (desktop only) */}
                {i < 2 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%_-_1rem)] w-full h-px bg-gradient-to-r from-slate-700 to-transparent z-0" />
                )}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 h-full relative z-10 hover:border-blue-500/25 transition-colors duration-300 group">

                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="text-5xl font-extrabold text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Margin Callout Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600/8 via-cyan-600/8 to-blue-600/8 border border-blue-500/20 rounded-2xl px-8 py-10 text-center"
        >
          <p className="text-slate-400 text-sm mb-2">{t('hiw.margin.label')}</p>
          <p className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            {t('hiw.margin.value')}
          </p>
          <p className="text-slate-500 text-sm">{t('hiw.margin.note')}</p>
        </motion.div>
      </div>
    </section>
  );
}
