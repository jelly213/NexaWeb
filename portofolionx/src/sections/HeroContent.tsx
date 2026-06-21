import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function HeroContent() {
  const { t, language } = useLanguage();
  const { c, restartKey } = useTheme();

  const [nums, setNums] = useState({ n48: 0, nK: 0, n90: 0 });

  useEffect(() => {
    setNums({ n48: 0, nK: 0, n90: 0 });
    const duration = 1300;
    const start = performance.now();
    const tick = (now: number) => {
      const raw = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setNums({
        n48: Math.round(eased * 48),
        nK: Math.round(eased * 1000),
        n90: Math.round(eased * 90),
      });
      if (raw < 1) requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => requestAnimationFrame(tick), 700);
    return () => clearTimeout(delay);
  }, [restartKey]);

  const disp48 = `${nums.n48}h`;
  const dispK = language === 'EN'
    ? (nums.nK >= 1000 ? '$1K' : `$${nums.nK}`)
    : (nums.nK >= 1000 ? '1K$' : `${nums.nK}$`);
  const disp90 = `${nums.n90}+`;
  const dispFREN = t('hero.stat4.value');

  const statItems = [
    { val: disp48, lbl: t('hero.stat1.label') },
    { val: dispK,  lbl: t('hero.stat2.label') },
    { val: disp90, lbl: t('hero.stat3.label') },
    { val: dispFREN, lbl: t('hero.stat4.label') },
  ];

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="flex flex-col px-8 lg:px-12 pt-14 pb-0"
    >
      <div className="space-y-6 max-w-xl">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-mono text-[12px]"
          style={{ color: c.green }}
        >
          <span style={{ color: c.blue, marginRight: 4 }}>$</span>
          {t('hero.badge')}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-bold text-[48px] sm:text-[52px] lg:text-[56px] leading-[1.06]"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: c.textHead }}
        >
          {t('hero.headline1')}{' '}
          <span style={{ color: c.blue }}>{t('hero.headline2')}</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-mono text-[14px] leading-[1.7]"
          style={{ color: c.muted }}
        >
          <span style={{ color: c.comment }}>{'/* The dev team your clients never meet. */'}</span>
          <br />
          {t('hero.sub')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.a
            href="#final-cta"
            onClick={e => { e.preventDefault(); handleScroll('#final-cta'); }}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-[22px] py-[13px] font-mono font-bold text-[13px]"
            style={{ backgroundColor: c.blue, color: c.textOnBlue }}
          >
            {t('hero.cta1')}
            <ArrowRight size={15} />
          </motion.a>
          <motion.a
            href="#how-it-works"
            onClick={e => { e.preventDefault(); handleScroll('#how-it-works'); }}
            whileHover={{ opacity: 0.8 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-[22px] py-[13px] font-mono text-[13px]"
            style={{ border: `1px solid ${c.borderSoft}`, color: c.text }}
          >
            <span style={{ color: c.blue }}>$</span>
            {t('hero.cta2')}
          </motion.a>
        </motion.div>
      </div>

      {/* Stats strip — each box staggers in, numbers count up */}
      <div
        className="mt-11 flex overflow-hidden"
        style={{ border: `1px solid ${c.border}` }}
      >
        {statItems.map(({ val, lbl }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 + i * 0.1, ease: 'easeOut' }}
            className="flex-1 px-[18px] py-4"
            style={{ borderRight: i < statItems.length - 1 ? `1px solid ${c.border}` : 'none' }}
          >
            <div
              className="font-bold text-[26px] tabular-nums leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.textHead }}
            >
              {val}
            </div>
            <div className="font-mono text-[11px] mt-1.5" style={{ color: c.dimmer }}>{lbl}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
