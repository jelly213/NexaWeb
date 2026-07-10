import { m } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { openCalendly } from '../lib/calendly';

export default function Pricing() {
  const { t, language, tPricingTiers } = useLanguage();
  const { c } = useTheme();
  const tiers = tPricingTiers();

  return (
    <section id="pricing" className="py-14 sm:py-24" style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="font-mono text-sm mb-4" style={{ color: c.blue }}>
            <span style={{ color: c.slash, marginRight: 4 }}>//</span>
            {t('pricing.badge').toLowerCase().replace(/\s+/g, '_')}
          </div>
          <h2
            className="font-bold text-[32px] sm:text-[38px] leading-[1.1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: c.textHead }}
          >
            {t('pricing.title')}{' '}
            <span style={{ color: c.green }}>{t('pricing.titleAccent')}</span>
          </h2>
          <p className="font-mono text-[14px] max-w-2xl leading-[1.7] mt-4" style={{ color: c.muted }}>
            {t('pricing.sub')}
          </p>
        </m.div>

        <div className="grid lg:grid-cols-3 gap-[18px] items-stretch">
          {tiers.map((tier, i) => (
            <m.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="rounded-[6px] p-7 h-full flex flex-col relative"
              style={{
                backgroundColor: tier.featured ? c.bgCard : c.bg,
                border: `1px solid ${tier.featured ? c.blue : c.borderSoft}`,
              }}
            >
              {tier.featured && (
                <span
                  className="absolute -top-3 left-7 px-2.5 py-1 font-mono text-[11px] font-bold rounded-[3px]"
                  style={{ backgroundColor: c.blue, color: c.textOnBlue }}
                >
                  {t('pricing.popular')}
                </span>
              )}

              <h3
                className="font-bold text-base mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.textHead }}
              >
                {tier.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="font-bold text-[34px] tabular-nums"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.textHead }}
                >
                  {tier.price}
                </span>
                <span className="font-mono text-xs" style={{ color: c.slash }}>{t('pricing.per')}</span>
              </div>
              <p className="font-mono text-[12px] mb-5" style={{ color: c.green }}>{tier.delivery}</p>

              <p className="font-mono text-[13px] leading-relaxed mb-6" style={{ color: c.muted }}>
                {tier.desc}
              </p>

              <ul className="space-y-2.5 mb-7">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 font-mono text-[13px]" style={{ color: c.muted }}>
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color: c.green }} />
                    {f}
                  </li>
                ))}
              </ul>

              <m.button
                onClick={() => openCalendly('final', language)}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 font-mono font-bold text-[13px] rounded-[4px] w-full"
                style={
                  tier.featured
                    ? { backgroundColor: c.blue, color: c.textOnBlue }
                    : { backgroundColor: 'transparent', color: c.text, border: `1px solid ${c.borderSoft}` }
                }
              >
                {t('nav.cta')}
                <ArrowRight size={14} />
              </m.button>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
