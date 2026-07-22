import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { openCalendly } from '../lib/calendly';
import logo from '../assets/logo.svg';

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme, c } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'how-it-works', href: '#how-it-works' },
    { label: 'stack', href: '#tech-stack' },
    { label: 'pricing', href: '#pricing' },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <m.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-black/20' : ''}`}
      style={{ backgroundColor: c.navBg, borderBottom: `1px solid ${c.border}` }}
    >
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 h-[65px]">

        {/* Logo */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2.5"
        >
          <img src={logo} alt="" aria-hidden="true" className="w-6 h-6" width="24" height="24" />
          <span
            className="font-bold text-[18px]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em', color: c.textHead }}
          >
            nexawebdev
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
              className="font-mono text-[13px] transition-colors"
              style={{ color: c.dim }}
              onMouseEnter={e => (e.currentTarget.style.color = c.text)}
              onMouseLeave={e => (e.currentTarget.style.color = c.dim)}
            >
              <span style={{ color: c.slash, marginRight: 4 }}>//</span>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Dark/Light toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 font-mono transition-colors"
            style={{
              border: `1px solid ${c.borderSoft}`,
              backgroundColor: c.bgCard,
              color: c.dim,
            }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* EN/FR toggle */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex items-center p-0.5 text-xs font-mono font-bold"
            style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderSoft}` }}
          >
            <span
              className="px-2.5 sm:px-3 py-1.5 transition-all duration-200"
              style={{
                backgroundColor: language === 'EN' ? c.blue : 'transparent',
                color: language === 'EN' ? c.textOnBlue : c.dimmer,
              }}
            >
              EN
            </span>
            <span
              className="px-2.5 sm:px-3 py-1.5 transition-all duration-200"
              style={{
                backgroundColor: language === 'FR' ? c.blue : 'transparent',
                color: language === 'FR' ? c.textOnBlue : c.dimmer,
              }}
            >
              FR
            </span>
          </button>

          {/* Desktop CTA */}
          <button
            type="button"
            onClick={() => openCalendly('nav', language)}
            className="hidden lg:inline-flex items-center px-4 py-2 text-[13px] font-mono font-bold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: c.blue, color: c.textOnBlue }}
          >
            book_a_call()
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 transition-colors"
            style={{ color: c.dim }}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden"
            style={{ backgroundColor: c.navBg, borderBottom: `1px solid ${c.border}` }}
          >
            <div className="px-6 py-4 space-y-1 font-mono">
              {links.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
                  className="block px-3 py-3 text-sm transition-colors"
                  style={{ color: c.dim }}
                >
                  <span style={{ color: c.slash, marginRight: 4 }}>//</span>
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => { setMobileOpen(false); openCalendly('nav', language); }}
                className="block w-full text-center px-4 py-3 text-sm font-bold mt-3"
                style={{ backgroundColor: c.blue, color: c.textOnBlue }}
              >
                book_a_call()
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}
