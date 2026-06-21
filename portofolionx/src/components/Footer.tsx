import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import type { MouseEvent } from 'react';

export default function Footer() {
  const { t } = useLanguage();
  const { c } = useTheme();

  const navLinks = [
    { label: t('footer.nav.howItWorks'), href: '#how-it-works' },
    { label: t('footer.nav.stack'), href: '#tech-stack' },
    { label: t('footer.nav.partner'), href: '#final-cta' },
  ];

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }}>
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12 py-10">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
          <div className="space-y-2">
            <span
              className="font-bold text-base"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.textHead }}
            >
              nexawebdev
            </span>
            <p className="font-mono text-xs max-w-xs leading-relaxed" style={{ color: c.dim }}>
              {t('footer.tagline')}
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 font-mono text-[13px]">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => handleNavClick(e, link.href)}
                className="transition-colors"
                style={{ color: c.dim }}
                onMouseEnter={e => (e.currentTarget.style.color = c.text)}
                onMouseLeave={e => (e.currentTarget.style.color = c.dim)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={`mailto:${t('footer.contact')}`}
            className="font-mono text-[13px] hover:opacity-80 transition-opacity"
            style={{ color: c.blue }}
          >
            {t('footer.contact')}
          </a>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderTop: `1px solid ${c.border}` }}
        >
          <p className="font-mono text-xs" style={{ color: c.slash }}>{t('footer.copyright')}</p>
          <p className="font-mono text-xs" style={{ color: c.slash }}>{t('footer.legal')}</p>
        </div>
      </div>
    </footer>
  );
}
