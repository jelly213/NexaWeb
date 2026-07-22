import { useState, useEffect, useRef } from 'react';
import { m, useInView, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { DollarSign, FileText, Rocket, type LucideIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const icons = [DollarSign, FileText, Rocket];

// Each step's ignition window along the beam's 0→1 progress. The beam head crosses
// card i's zone roughly a third of the way apart; numbers ignite as it arrives.
const IGNITE: [number, number][] = [[0.02, 0.2], [0.36, 0.54], [0.7, 0.88]];

export default function HowItWorks() {
  const { t, language } = useLanguage();
  const { c } = useTheme();

  // One scroll-scrubbed beam traces the 3-step pipeline. User-driven motion, so it
  // runs under prefers-reduced-motion too (house policy — see lessons 2026-07-21).
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 0.85', 'end 0.35'] });
  const beam = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const beamHeadLeft = useTransform(beam, v => `${v * 100}%`);

  const [marginCount, setMarginCount] = useState(0);
  const marginRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(marginRef, { once: false, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;
    setMarginCount(0);
    const duration = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const raw = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setMarginCount(Math.round(eased * 4000));
      if (raw < 1) requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => requestAnimationFrame(tick), 300);
    return () => clearTimeout(delay);
  }, [isInView]);

  const displayMargin = marginCount >= 4000
    ? t('hiw.margin.value')
    : language === 'EN'
      ? `$${marginCount.toLocaleString('en-US')}+`
      : `${marginCount.toLocaleString('fr-FR')}$+`;

  const steps = [
    { num: t('hiw.step1.num'), title: t('hiw.step1.title'), desc: t('hiw.step1.desc') },
    { num: t('hiw.step2.num'), title: t('hiw.step2.title'), desc: t('hiw.step2.desc') },
    { num: t('hiw.step3.num'), title: t('hiw.step3.title'), desc: t('hiw.step3.desc') },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-24" style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="font-mono text-sm mb-4" style={{ color: c.blue }}>
            <span style={{ color: c.slash, marginRight: 4 }}>//</span>
            {t('hiw.badge').toLowerCase().replace(/\s+/g, '_')}
          </div>
          <h2
            className="font-bold text-[32px] sm:text-[38px]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: c.textHead }}
          >
            {t('hiw.title')}{' '}
            <span style={{ color: c.blue }}>{t('hiw.titleAccent')}</span>
          </h2>
        </m.div>

        <div ref={stepsRef} className="relative grid lg:grid-cols-3 gap-[18px] mb-10">
          {/* Track + beam sit at z-0: the solid card surfaces (z-10) mask them, so the
              line only shows in the gaps — same trick as the old static connectors. */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-10 inset-x-0 h-px z-0"
            style={{ backgroundColor: c.borderSoft }}
          />
          <m.div
            aria-hidden="true"
            className="hidden lg:block absolute top-10 inset-x-0 h-px z-0 origin-left"
            style={{ backgroundColor: c.blue, boxShadow: `0 0 10px ${c.blue}`, scaleX: beam }}
          />
          <m.div
            aria-hidden="true"
            className="hidden lg:block absolute w-1.5 h-1.5 rounded-full z-0"
            style={{
              top: 'calc(2.5rem + 0.5px)',
              left: beamHeadLeft,
              x: '-50%',
              y: '-50%',
              backgroundColor: c.blue,
              boxShadow: `0 0 14px 3px ${c.blue}66`,
            }}
          />
          {steps.map((step, i) => (
            <StepCard key={i} step={step} icon={icons[i]} index={i} beam={beam} />
          ))}
        </div>

        {/* Profit callout — counts up on scroll-in, resets every 30s */}
        <div
          ref={marginRef}
          className="rounded-[6px] px-5 py-8 sm:px-8 sm:py-10 text-center"
          style={{ border: `1px solid ${c.borderSoft}` }}
        >
          <p className="font-mono text-xs sm:text-sm mb-2" style={{ color: c.muted }}>{t('hiw.margin.label')}</p>
          <p
            className="text-[2rem] sm:text-5xl lg:text-6xl font-bold mb-3 tabular-nums leading-tight break-all sm:break-normal"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.green }}
          >
            {displayMargin}
          </p>
          <p className="font-mono text-xs sm:text-sm" style={{ color: c.dimmer }}>{t('hiw.margin.note')}</p>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, icon: Icon, index, beam }: {
  step: { num: string; title: string; desc: string };
  icon: LucideIcon;
  index: number;
  beam: MotionValue<number>;
}) {
  const { c } = useTheme();
  // The ghost number ignites to brand blue as the beam head crosses this card's zone.
  const numColor = useTransform(beam, IGNITE[index], [c.borderSoft, c.blue]);

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      className="relative"
    >
      <div
        className="rounded-[6px] p-7 h-full relative z-10 transition-colors duration-300"
        style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderSoft}` }}
      >
        <div className="flex items-center justify-between mb-6">
          <div
            className="w-11 h-11 rounded-[4px] flex items-center justify-center"
            style={{ backgroundColor: c.blue }}
          >
            <Icon size={18} style={{ color: c.textOnBlue }} />
          </div>
          <m.span
            className="font-mono text-4xl font-bold select-none"
            style={{ color: numColor }}
          >
            {step.num}
          </m.span>
        </div>
        <h3
          className="font-bold text-base mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.textHead }}
        >
          {step.title}
        </h3>
        <p className="font-mono text-[13px] leading-relaxed" style={{ color: c.muted }}>
          {step.desc}
        </p>
      </div>
    </m.div>
  );
}
