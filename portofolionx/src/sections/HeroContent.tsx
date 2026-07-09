import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { openCalendly } from '../lib/calendly';

export default function HeroContent() {
  const { t, language } = useLanguage();
  const { c } = useTheme();

  const statItems = [
    { val: t('hero.stat1.value'), lbl: t('hero.stat1.label') },
    { val: t('hero.stat2.value'), lbl: t('hero.stat2.label') },
    { val: t('hero.stat3.value'), lbl: t('hero.stat3.label') },
    { val: t('hero.stat4.value'), lbl: t('hero.stat4.label') },
  ];

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <m.div
      initial={{ y: 24 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="flex flex-col px-8 lg:px-12 pt-14 pb-0"
    >
      <div className="space-y-6 max-w-xl">

        {/* Eyebrow */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-mono text-[12px]"
          style={{ color: c.green }}
        >
          <span style={{ color: c.blue, marginRight: 4 }}>$</span>
          {t('hero.badge')}
        </m.div>

        {/* Headline — no opacity:0 so Lighthouse registers LCP immediately */}
        <m.h1
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-bold text-[48px] sm:text-[52px] lg:text-[56px] leading-[1.06]"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: c.textHead }}
        >
          {t('hero.headline1')}{' '}
          <span style={{ color: c.blue }}>{t('hero.headline2')}</span>
        </m.h1>

        {/* Sub */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-mono text-[14px] leading-[1.7]"
          style={{ color: c.muted }}
        >
          <span style={{ color: c.comment }}>{'/* The dev team your clients never meet. */'}</span>
          <br />
          {t('hero.sub')}
        </m.p>

        {/* CTAs */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <m.button
            type="button"
            onClick={() => openCalendly('hero', language)}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-[22px] py-[13px] font-mono font-bold text-[13px]"
            style={{ backgroundColor: c.blue, color: c.textOnBlue }}
          >
            {t('hero.cta1')}
            <ArrowRight size={15} />
          </m.button>
          <m.a
            href="#how-it-works"
            onClick={e => { e.preventDefault(); handleScroll('#how-it-works'); }}
            whileHover={{ opacity: 0.8 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-[22px] py-[13px] font-mono text-[13px]"
            style={{ border: `1px solid ${c.borderSoft}`, color: c.text }}
          >
            <span style={{ color: c.blue }}>$</span>
            {t('hero.cta2')}
          </m.a>
        </m.div>
      </div>

      {/* Stats strip */}
      <div
        className="mt-11 flex overflow-hidden"
        style={{ border: `1px solid ${c.border}` }}
      >
        {statItems.map(({ val, lbl }, i) => (
          <m.div
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
          </m.div>
        ))}
      </div>
    </m.div>
  );
}
