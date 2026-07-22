import { m } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function HeroImage() {
  const { t } = useLanguage();
  const { c } = useTheme();

  return (
    <m.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      className="flex items-center justify-center px-8 lg:px-10 py-14"
    >
      <div
        className="w-full min-w-0 max-w-[440px] rounded-[6px] overflow-hidden"
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
            ~/nexawebdev — pagespeed
          </span>
        </div>

        {/* Body */}
        <div className="px-[18px] py-5 font-mono text-[13px] leading-[1.9]">
          <div>
            <span style={{ color: c.blue }}>$</span>{' '}
            <span style={{ color: c.textHead }}>npx pagespeed audit --mobile</span>
          </div>
          <div style={{ color: c.comment }}>{t('term.competitor')}</div>
          <div style={{ color: c.red }}>✗ performance ......... 47</div>
          <div style={{ color: c.comment }}>{t('term.us')}</div>
          <div style={{ color: c.green }}>✓ performance ......... 98</div>

          {/* Animated bars — numbers static, bars animate via Framer Motion */}
          <div className="mt-3.5 space-y-2">
            <div className="flex items-center gap-3 text-[12px]">
              <span className="w-[110px] shrink-0" style={{ color: c.dim }}>{t('term.theirBuild')}</span>
              <div className="flex-1 h-2 overflow-hidden" style={{ backgroundColor: c.bgTrack }}>
                <m.div
                  className="h-full"
                  style={{ backgroundColor: c.barBad }}
                  initial={{ width: 0 }}
                  animate={{ width: '47%' }}
                  transition={{ delay: 0.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="w-[34px] text-right font-bold tabular-nums" style={{ color: c.barBad }}>47</span>
            </div>
            <div className="flex items-center gap-3 text-[12px]">
              <span className="w-[110px] shrink-0" style={{ color: c.dim }}>{t('term.ourBuild')}</span>
              <div className="flex-1 h-2 overflow-hidden" style={{ backgroundColor: c.bgTrack }}>
                <m.div
                  className="h-full"
                  style={{ backgroundColor: c.barGood }}
                  initial={{ width: 0 }}
                  animate={{ width: '98%' }}
                  transition={{ delay: 0.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="w-[34px] text-right font-bold tabular-nums" style={{ color: c.barGood }}>98</span>
            </div>
          </div>

          <div className="mt-2.5">
            <span style={{ color: c.green }}>✓</span>{' '}
            <span style={{ color: c.dim }}>{t('term.deployed')}</span>{' '}
            <span style={{ color: c.textHead }}>48h</span>{' '}
            <span style={{ color: c.dim }}>{t('term.bilingual')}</span>
          </div>
        </div>
      </div>
    </m.div>
  );
}
