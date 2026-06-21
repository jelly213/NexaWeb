import { motion } from 'framer-motion';
import { Code2, ShoppingCart, Globe, Layers, ImageIcon, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const platformIcons = [Code2, ShoppingCart, Globe, Layers];
const platformGradients = [
  'from-blue-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-orange-600 to-amber-600',
  'from-violet-600 to-purple-600',
];

export default function TechStack() {
  const { t, tPlatformItems, tPortfolioItems } = useLanguage();
  const { c } = useTheme();

  const platforms = tPlatformItems();
  const portfolioItems = tPortfolioItems();

  return (
    <section id="tech-stack" className="py-24" style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }}>
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="font-mono text-sm mb-4" style={{ color: c.blue }}>
            <span style={{ color: c.slash, marginRight: 4 }}>//</span>
            {t('stack.badge').toLowerCase().replace(/\s+/g, '_')}
          </div>
          <h2
            className="font-bold text-[32px] sm:text-[38px] mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', color: c.textHead }}
          >
            {t('stack.title')}{' '}
            <span style={{ color: c.blue }}>{t('stack.titleAccent')}</span>
          </h2>
          <p className="font-mono text-sm max-w-xl" style={{ color: c.muted }}>
            {t('stack.sub')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px] mb-16">
          {platforms.map((platform, i) => {
            const Icon = platformIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-[6px] p-6 transition-colors"
                style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderSoft}` }}
              >
                <div className={`w-11 h-11 rounded-[4px] bg-gradient-to-br ${platformGradients[i]} flex items-center justify-center mb-4`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span
                  className="inline-block font-mono text-xs font-bold px-2 py-0.5 mb-3"
                  style={{ border: `1px solid ${c.borderSoft}`, color: c.dim }}
                >
                  {platform.badge}
                </span>
                <h3
                  className="font-bold mb-2 text-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.textHead }}
                >
                  {platform.name}
                </h3>
                <p className="font-mono text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  {platform.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-6">
            <h3
              className="font-bold text-xl mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.textHead }}
            >
              {t('stack.portfolio.title')}
            </h3>
            <p className="font-mono text-[13px]" style={{ color: c.dim }}>{t('stack.portfolio.sub')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[18px]">
            {portfolioItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-[6px] overflow-hidden transition-colors"
                style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderSoft}` }}
              >
                <div className="relative aspect-video flex flex-col items-center justify-center gap-2 overflow-hidden" style={{ backgroundColor: c.bgTrack }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 object-cover w-full h-full"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <>
                      <ImageIcon size={28} className="relative z-10" style={{ color: c.dim }} />
                      <span className="font-mono text-xs relative z-10" style={{ color: c.dim }}>Coming Soon</span>
                    </>
                  )}
                  {item.link && (
                    <a
                      href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors"
                    >
                      <Eye size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  <div
                    className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse z-30"
                    style={{ backgroundColor: c.green }}
                  />
                </div>
                <div className="p-4">
                  <p className="font-mono text-xs mb-1" style={{ color: c.blue }}>{item.category}</p>
                  <h4
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.textHead }}
                  >
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
