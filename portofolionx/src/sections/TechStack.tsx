import { motion } from 'framer-motion';
import { Code2, ShoppingCart, Globe, Layers, ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const platformIcons = [Code2, ShoppingCart, Globe, Layers];
const platformGradients = [
  'from-blue-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-orange-600 to-amber-600',
  'from-violet-600 to-purple-600',
];
const platformShadows = [
  'shadow-blue-500/20',
  'shadow-emerald-500/20',
  'shadow-orange-500/20',
  'shadow-violet-500/20',
];

export default function TechStack() {
  const { t } = useLanguage();

  const platforms = [
    {
      name: t('stack.platform1.name'),
      desc: t('stack.platform1.desc'),
      badge: t('stack.platform1.badge'),
    },
    {
      name: t('stack.platform2.name'),
      desc: t('stack.platform2.desc'),
      badge: t('stack.platform2.badge'),
    },
    {
      name: t('stack.platform3.name'),
      desc: t('stack.platform3.desc'),
      badge: t('stack.platform3.badge'),
    },
    {
      name: t('stack.platform4.name'),
      desc: t('stack.platform4.desc'),
      badge: t('stack.platform4.badge'),
    },
  ];

  const portfolioItems = [
    {
      title: t('stack.portfolio1.title'),
      category: t('stack.portfolio1.category'),
    },
    {
      title: t('stack.portfolio2.title'),
      category: t('stack.portfolio2.category'),
    },
    {
      title: t('stack.portfolio3.title'),
      category: t('stack.portfolio3.category'),
    },
     {
      title: t('stack.portfolio4.title'),
      category: t('stack.portfolio4.category'),
    },
  ];

  return (
    <section id="tech-stack" className="py-24 bg-[#070D1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
            {t('stack.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t('stack.title')}{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t('stack.titleAccent')}
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {t('stack.sub')}
          </p>
        </motion.div>

        {/* Platform Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {platforms.map((platform, i) => {
            const Icon = platformIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformGradients[i]} flex items-center justify-center mb-4 shadow-lg ${platformShadows[i]}`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md mb-3">
                  {platform.badge}
                </span>
                <h3 className="text-white font-bold mb-2 text-sm">{platform.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{platform.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Portfolio Placeholder Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-1">
              {t('stack.portfolio.title')}
            </h3>
            <p className="text-slate-500 text-sm">{t('stack.portfolio.sub')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {portfolioItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/25 transition-colors"
              >
                {/* Image Placeholder */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center gap-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/4 to-cyan-500/4" />
                  <ImageIcon size={28} className="text-slate-600 relative z-10" />
                  <span className="text-slate-600 text-xs font-medium relative z-10">Mockup Coming Soon</span>
                  <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <p className="text-xs text-blue-400 font-medium mb-1">{item.category}</p>
                  <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
