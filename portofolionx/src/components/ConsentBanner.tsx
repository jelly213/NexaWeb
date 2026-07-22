import { m } from 'motion/react';
import { useConsent } from '../context/ConsentContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Law 25 requires that refusing be exactly as easy as accepting. Both buttons therefore share
 * the same size, padding and font weight — a filled Accept beside a grey text link is a dark
 * pattern and is not lawful here.
 *
 * `position: fixed` keeps this out of normal flow and animates on transform only, so it
 * contributes zero layout shift.
 */
export default function ConsentBanner() {
  const { showBanner, accept, refuse } = useConsent();
  const { t } = useLanguage();
  const { c } = useTheme();

  if (!showBanner) return null;

  const buttonBase = 'px-6 py-2.5 font-mono text-[13px] font-bold transition-opacity hover:opacity-90';

  return (
    <m.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      role="dialog"
      aria-label={t('consent.aria')}
      className="fixed bottom-0 left-0 right-0 z-[60]"
      style={{ backgroundColor: c.bgCard, borderTop: `1px solid ${c.border}` }}
    >
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12 py-5 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
        <p className="font-mono text-[13px] leading-[1.7] flex-1" style={{ color: c.muted }}>
          {t('consent.text')}
        </p>

        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={refuse}
            className={buttonBase}
            style={{ border: `1px solid ${c.borderSoft}`, backgroundColor: 'transparent', color: c.text }}
          >
            {t('consent.refuse')}
          </button>
          <button
            type="button"
            onClick={accept}
            className={buttonBase}
            style={{ border: `1px solid ${c.blue}`, backgroundColor: c.blue, color: c.textOnBlue }}
          >
            {t('consent.accept')}
          </button>
        </div>
      </div>
    </m.div>
  );
}
