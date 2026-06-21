import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const CALENDLY_URL = 'https://calendly.com/contact-nexawebdev/partner-discovery-call';

export default function FinalCTA() {
  const { t, language } = useLanguage();
  const { c } = useTheme();

  const openCalendly = () => {
    const locale = language === 'FR' ? 'fr' : 'en';
    (window as any).Calendly?.initPopupWidget({ url: `${CALENDLY_URL}?locale=${locale}` });
  };

  const riskItems = [t('cta.risk1'), t('cta.risk2'), t('cta.risk3'), t('cta.risk4')];

  return (
    <section id="final-cta" className="py-28" style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }}>
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="font-mono text-sm" style={{ color: c.green }}>
            <span style={{ color: c.slash, marginRight: 4 }}>//</span>
            {t('cta.badge').toLowerCase().replace(/\s+/g, '_')}
          </div>

          <div>
            <h2
              className="font-bold text-[38px] sm:text-[48px] leading-[1.1] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: c.textHead }}
            >
              {t('cta.title')}
            </h2>
            <h2
              className="font-bold text-[38px] sm:text-[48px] leading-[1.1]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: c.blue }}
            >
              {t('cta.titleAccent')}
            </h2>
          </div>

          <p className="font-mono text-[14px] max-w-2xl leading-[1.7]" style={{ color: c.muted }}>
            {t('cta.sub')}
          </p>

          <motion.button
            onClick={openCalendly}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 font-mono font-bold text-sm"
            style={{ backgroundColor: c.blue, color: c.textOnBlue }}
          >
            {t('cta.btn')}
            <ArrowRight size={16} />
          </motion.button>

          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
            {riskItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-[13px]" style={{ color: c.muted }}>
                <span className="font-bold" style={{ color: c.green }}>+</span>
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
