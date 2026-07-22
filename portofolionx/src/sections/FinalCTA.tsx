import { useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { openCalendly } from '../lib/calendly';

// Fee/delivery brackets mirror the public tier ladder, so the calculator quietly teaches
// the tiers while it computes: the resale price a partner drags to decides which tier
// they'd actually be buying.
const TIER_BRACKETS = [
  { max: 2500, name: 'Lead-Gen Sprinter', fee: 1000, delivery: { EN: '48h', FR: '48 h' } },
  { max: 4500, name: 'Authority CMS', fee: 1500, delivery: { EN: '72h', FR: '72 h' } },
  { max: Infinity, name: 'Digital Storefront', fee: 2000, delivery: { EN: '5 days', FR: '5 jours' } },
] as const;

export default function FinalCTA() {
  const { t, language } = useLanguage();
  const { c } = useTheme();
  const reduceMotion = useReducedMotion();
  const [resale, setResale] = useState(3500);

  const tier = TIER_BRACKETS.find(b => resale < b.max) ?? TIER_BRACKETS[2];
  const margin = resale - tier.fee;
  const fmt = (n: number) =>
    language === 'EN' ? `$${n.toLocaleString('en-US')}` : `${n.toLocaleString('fr-FR')}$`;

  const riskItems = [t('cta.risk1'), t('cta.risk2'), t('cta.risk3'), t('cta.risk4')];

  // Dotted leaders between label and value, locale-safe.
  const Leader = () => (
    <span
      aria-hidden="true"
      className="flex-1 mx-2 border-b border-dotted"
      style={{ borderColor: c.borderSoft, transform: 'translateY(-4px)' }}
    />
  );

  return (
    <section id="final-cta" className="py-28" style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }}>
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">

          {/* Left: the pitch */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="font-mono text-sm" style={{ color: c.green }}>
              <span style={{ color: c.slash, marginRight: 4 }}>//</span>
              {t('cta.badge').toLowerCase().replace(/\s+/g, '_')}
            </div>

            <h2
              className="font-bold text-[38px] sm:text-[48px] leading-[1.1]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: c.textHead }}
            >
              {t('cta.title')}
              <br />
              <span style={{ color: c.blue }}>{t('cta.titleAccent')}</span>
            </h2>

            <p className="font-mono text-[14px] max-w-xl leading-[1.7]" style={{ color: c.muted }}>
              {t('cta.sub')}
            </p>

            <m.button
              onClick={() => openCalendly('final', language)}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 font-mono font-bold text-sm"
              style={{ backgroundColor: c.blue, color: c.textOnBlue }}
            >
              {t('cta.btn')}
              <ArrowRight size={16} />
            </m.button>

            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              {riskItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 font-mono text-[13px]" style={{ color: c.muted }}>
                  <span className="font-bold" style={{ color: c.green }}>+</span>
                  {item}
                </div>
              ))}
            </div>
          </m.div>

          {/* Right: the margin terminal — bookends the hero's pagespeed terminal. */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <div
              className="w-full min-w-0 max-w-[520px] rounded-[6px] overflow-hidden"
              style={{ border: `1px solid ${c.borderSoft}`, backgroundColor: c.bgCard }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-[7px] px-3.5 py-3"
                style={{ borderBottom: `1px solid ${c.border}`, backgroundColor: c.bgTermBar }}
              >
                <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
                <span className="ml-2.5 font-mono text-[12px]" style={{ color: c.dimmer }}>
                  {t('cta.term.window')}
                </span>
              </div>

              {/* Body */}
              <div className="px-[18px] py-5 font-mono text-[13px] leading-[1.9]">
                <div className="tabular-nums">
                  <span style={{ color: c.blue }}>$</span>{' '}
                  <span style={{ color: c.textHead }}>{t('cta.term.cmd')} {resale}</span>
                </div>

                {/* Slider */}
                <div className="mt-3.5">
                  <label htmlFor="resale-slider" className="block text-[12px] mb-1.5" style={{ color: c.dim }}>
                    {t('cta.term.slider')}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="resale-slider"
                      type="range"
                      min={1500}
                      max={7500}
                      step={250}
                      value={resale}
                      onChange={e => setResale(Number(e.target.value))}
                      aria-valuetext={fmt(resale)}
                      className="flex-1 h-2 cursor-pointer"
                      style={{ accentColor: c.blue }}
                    />
                    <span className="w-[64px] text-right font-bold tabular-nums" style={{ color: c.textHead }}>
                      {fmt(resale)}
                    </span>
                  </div>
                </div>

                {/* Computed output */}
                <div className="mt-4 space-y-1" aria-live="polite">
                  <div className="flex items-baseline text-[12px]">
                    <span style={{ color: c.dim }}>{t('cta.term.fee')} · {tier.name}</span>
                    <Leader />
                    <span className="tabular-nums" style={{ color: c.red }}>-{fmt(tier.fee)}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="font-bold" style={{ color: c.textHead }}>{t('cta.term.margin')}</span>
                    <Leader />
                    <span className="font-bold tabular-nums text-[15px]" style={{ color: c.green }}>
                      {fmt(margin)} ✓
                    </span>
                  </div>
                  <div className="flex items-baseline text-[12px]">
                    <span style={{ color: c.dim }}>{t('cta.term.delivery')}</span>
                    <Leader />
                    <span style={{ color: c.textHead }}>{tier.delivery[language]}</span>
                  </div>
                  <div className="flex items-baseline text-[12px]">
                    <span style={{ color: c.dim }}>
                      <span style={{ color: c.green }}>✓</span> {t('cta.term.guarantee')}
                    </span>
                    <Leader />
                    <span style={{ color: c.dim }}>{t('cta.term.inWriting')}</span>
                  </div>
                </div>

                {/* Prompt line = the CTA */}
                <button
                  onClick={() => openCalendly('final', language)}
                  className="group/prompt mt-4 -mx-2 px-2 py-1.5 w-[calc(100%+16px)] text-left rounded-[4px] transition-colors cursor-pointer hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2"
                  style={{ outlineColor: c.blue }}
                >
                  <span style={{ color: c.blue }}>$</span>{' '}
                  <span className="font-bold" style={{ color: c.textHead }}>book_a_call()</span>{' '}
                  {reduceMotion ? (
                    <span style={{ color: c.textHead }}>▊</span>
                  ) : (
                    <m.span
                      aria-hidden="true"
                      animate={{ opacity: [1, 1, 0, 0] }}
                      transition={{ duration: 1.1, times: [0, 0.5, 0.5, 1], repeat: Infinity }}
                      style={{ color: c.textHead }}
                    >
                      ▊
                    </m.span>
                  )}
                  <ArrowRight
                    size={13}
                    className="inline-block ml-2 opacity-0 group-hover/prompt:opacity-100 transition-opacity"
                    style={{ color: c.blue }}
                  />
                </button>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
