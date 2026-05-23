import { useLanguage } from '../context/LanguageContext';
import type { MouseEvent } from 'react'

export default function Footer() {
  const { t } = useLanguage();

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
    <footer className="bg-[#04080F] border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">

          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-extrabold text-sm">N</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                NexaWeb<span className="text-blue-400">Dev</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => handleNavClick(e, link.href)}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Contact */}
          <a
            href={`mailto:${t('footer.contact')}`}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            {t('footer.contact')}
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-600 text-xs">{t('footer.copyright')}</p>
          <p className="text-slate-700 text-xs">{t('footer.legal')}</p>
        </div>
      </div>
    </footer>
  );
}
