import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo2.png';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.stack'), href: '#tech-stack' },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <a
            href="#"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
             <img src={logo} alt="NexaWeb Logo" className='rounded'/>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              NexaWeb<span className="text-blue-400">.Dev</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Language Toggle + CTA */}
          <div className="flex items-center gap-3">

            {/* FR / EN Pill Toggle */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-full p-0.5 text-xs font-bold tracking-wide"
            >
              <span
                className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                  language === 'EN'
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </span>
              <span
                className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                  language === 'FR'
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FR
              </span>
            </button>

            {/* Desktop CTA */}
            <a
              href="#final-cta"
              onClick={e => { e.preventDefault(); handleNavClick('#final-cta'); }}
              className="hidden lg:inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            >
              {t('nav.cta')}
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-slate-950/98 backdrop-blur-md border-b border-slate-800"
          >
            <div className="px-4 py-5 space-y-2">
              {links.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
                  className="block px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#final-cta"
                onClick={e => { e.preventDefault(); handleNavClick('#final-cta'); }}
                className="block w-full text-center px-4 py-3 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors mt-2"
              >
                {t('nav.cta')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
