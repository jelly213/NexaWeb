import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HeroContent() {
  const { t } = useLanguage();

  const stats = [
    { val: t('hero.stat1.value'), lbl: t('hero.stat1.label') },
    { val: t('hero.stat2.value'), lbl: t('hero.stat2.label') },
    { val: t('hero.stat3.value'), lbl: t('hero.stat3.label') },
    { val: t('hero.stat4.value'), lbl: t('hero.stat4.label') },
  ];

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs sm:text-sm font-medium"
      >
        <Zap size={13} className="fill-blue-400 shrink-0" />
        {t('hero.badge')}
      </motion.div>

      {/* Headline */}
      <div className="space-y-1">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
        >
          {t('hero.headline1')}
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
        >
          {t('hero.headline2')}
        </motion.h1>
      </div>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl"
      >
        {t('hero.sub')}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.a
          href="#final-cta"
          onClick={e => { e.preventDefault(); handleScroll('#final-cta'); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/25 text-sm"
        >
          {t('hero.cta1')}
          <ArrowRight size={16} />
        </motion.a>
        <motion.a
          href="#how-it-works"
          onClick={e => { e.preventDefault(); handleScroll('#how-it-works'); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700/50 text-sm"
        >
          {t('hero.cta2')}
        </motion.a>
      </motion.div>

      {/* Social Proof Avatars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex items-center gap-3"
      >
        <div className="flex -space-x-2">
          {[
            { bg: 'bg-blue-500', letter: 'A' },
            { bg: 'bg-violet-500', letter: 'M' },
            { bg: 'bg-cyan-600', letter: 'S' },
            { bg: 'bg-emerald-500', letter: 'J' },
          ].map(({ bg, letter }, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full ${bg} border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold`}
            >
              {letter}
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-sm">{t('hero.proof')}</p>
      </motion.div>

      {/* Stats Strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-800/60"
      >
        {stats.map(({ val, lbl }, i) => (
          <div key={i} className="text-center">
            <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {val}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{lbl}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
