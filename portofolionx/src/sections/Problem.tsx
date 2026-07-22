import { m } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Problem() {
  const { t, tProblemLeft, tProblemRight } = useLanguage();
  const { c } = useTheme();

  const leftItems = tProblemLeft();
  const rightItems = tProblemRight();

  return (
    <section
      id="problem"
      className="px-8 lg:px-12 py-14"
      style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Section keyword */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-sm mb-5"
          style={{ color: c.red }}
        >
          <span style={{ color: c.slash, marginRight: 4 }}>//</span>
          {t('problem.badge').toLowerCase().replace(/\s+/g, '_')}
        </m.div>

        {/* Headline */}
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="font-bold text-[32px] sm:text-[38px] leading-[1.12] mb-10 max-w-3xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: c.textHead }}
        >
          {t('problem.title')}{' '}
          <span style={{ color: c.blue }}>{t('problem.titleAccent')}</span>
        </m.h2>

        {/* Comparison blocks */}
        <div className="grid lg:grid-cols-2 gap-[18px]">

          {/* Bad */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="rounded-[6px] overflow-hidden"
            style={{ border: `1px solid ${c.borderSoft}` }}
          >
            <div
              className="flex items-center gap-2 px-[18px] py-3.5 font-mono text-[13px] font-bold"
              style={{ borderBottom: `1px solid ${c.border}`, color: c.red }}
            >
              <span>✗</span> {t('problem.left.title')}
            </div>
            <div className="px-[18px] pb-3.5">
              {leftItems.map((item, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + i * 0.06 }}
                  className="font-mono text-[13px] leading-[1.65] py-2.5 flex gap-2.5"
                  style={{
                    color: c.text,
                    borderBottom: i < leftItems.length - 1 ? `1px solid ${c.borderItem}` : 'none',
                  }}
                >
                  <span className="shrink-0 font-bold" style={{ color: c.red }}>-</span>
                  {item}
                </m.div>
              ))}
            </div>
          </m.div>

          {/* Good */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="rounded-[6px] overflow-hidden"
            style={{ border: `1px solid ${c.borderSoft}` }}
          >
            <div
              className="flex items-center gap-2 px-[18px] py-3.5 font-mono text-[13px] font-bold"
              style={{ borderBottom: `1px solid ${c.border}`, color: c.green }}
            >
              <span>✓</span> {t('problem.right.title')}
            </div>
            <div className="px-[18px] pb-3.5">
              {rightItems.map((item, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.22 + i * 0.06 }}
                  className="font-mono text-[13px] leading-[1.65] py-2.5 flex gap-2.5"
                  style={{
                    color: c.text,
                    borderBottom: i < rightItems.length - 1 ? `1px solid ${c.borderItem}` : 'none',
                  }}
                >
                  <span className="shrink-0 font-bold" style={{ color: c.green }}>+</span>
                  {item}
                </m.div>
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
