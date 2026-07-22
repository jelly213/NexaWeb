import { useState } from 'react';
import { m } from 'motion/react';
import { Code2, ShoppingCart, Globe, Layers, ImageIcon, Eye } from 'lucide-react';
import { useLanguage, type PortfolioItem, type PortfolioPlatform } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

// Index-aligned with platformItems in LanguageContext: Shopify leads.
const platformIcons = [ShoppingCart, Code2, Globe, Layers];
const platformGradients = [
  'from-emerald-600 to-teal-600',
  'from-blue-600 to-indigo-600',
  'from-orange-600 to-amber-600',
  'from-violet-600 to-purple-600',
];

// Filter chips let a prospect self-select by platform (masterclass pattern). 'All' default:
// the client group is entirely Shopify anyway, so the Shopify-led story survives the default
// view while the premium demos stay visible without a tap.
const FILTER_PLATFORMS: PortfolioPlatform[] = ['Shopify', 'Scroll Story', 'React / Next.js', 'WordPress', 'Webflow'];

export default function TechStack() {
  const { t, tPlatformItems, tPortfolioItems } = useLanguage();
  const { c } = useTheme();
  const [filter, setFilter] = useState<PortfolioPlatform | 'all'>('all');

  const platforms = tPlatformItems();
  const portfolioItems = tPortfolioItems().filter(i => filter === 'all' || i.platform === filter);

  return (
    <section id="tech-stack" className="py-24" style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }}>
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12">

        <m.div
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
        </m.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px] mb-16">
          {platforms.map((platform, i) => {
            const Icon = platformIcons[i];
            return (
              <m.div
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
              </m.div>
            );
          })}
        </div>

        {/* Platform filter — prospects self-select the stack they're shopping for. */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label={t('stack.filter.all')}>
          {(['all', ...FILTER_PLATFORMS] as const).map(p => {
            const active = filter === p;
            return (
              <button
                key={p}
                onClick={() => setFilter(p)}
                aria-pressed={active}
                className="font-mono text-xs px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer"
                style={{
                  border: `1px solid ${active ? c.blue : c.borderSoft}`,
                  color: active ? c.blue : c.muted,
                  backgroundColor: active ? `${c.blue}14` : 'transparent',
                }}
              >
                {p === 'all' ? t('stack.filter.all') : p}
              </button>
            );
          })}
        </div>

        {/* Client work and demo builds are labelled separately on purpose. Several of these were
            never sold to a client, and a prospect who clicks through to a *.pages.dev URL under
            a "recent deliveries" heading has every reason to distrust the rest of the page. */}
        <PortfolioGroup
          title={t('stack.clientwork.title')}
          sub={t('stack.clientwork.sub')}
          items={portfolioItems.filter(i => i.kind === 'client')}
          wide
        />

        {/* Also 3-col: six demos land as two full rows instead of a ragged 4+2. */}
        <div className="mt-14">
          <PortfolioGroup
            title={t('stack.demo.title')}
            sub={t('stack.demo.sub')}
            items={portfolioItems.filter(i => i.kind === 'demo')}
            wide
          />
        </div>
      </div>
    </section>
  );
}

function PortfolioGroup({ title, sub, items, wide }: { title: string; sub: string; items: PortfolioItem[]; wide?: boolean }) {
  const { c } = useTheme();
  const { t } = useLanguage();
  if (items.length === 0) return null;

  return (
    <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="mb-6">
        <h3
          className="font-bold text-xl mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.textHead }}
        >
          {title}
        </h3>
        <p className="font-mono text-[13px]" style={{ color: c.dim }}>{sub}</p>
      </div>

      <div className={`grid md:grid-cols-2 ${wide ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-[18px]`}>
        {items.map((item, i) => (
          <m.div
            key={item.link}
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
                  alt={`${item.title} — ${item.category}`}
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
                  aria-label={`View ${item.title}`}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors"
                >
                  <Eye size={22} aria-hidden="true" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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
              {item.study && (
                <dl className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: c.borderSoft }}>
                  {([
                    ['study.problem', item.study.problem],
                    ['study.built', item.study.built],
                    ['study.result', item.study.result],
                  ] as const).map(([labelKey, text]) => (
                    <div key={labelKey}>
                      <dt className="font-mono text-[10px] uppercase tracking-wider mb-0.5" style={{ color: c.dim }}>
                        {t(labelKey)}
                      </dt>
                      <dd className="text-[12px] leading-relaxed" style={{ color: c.muted }}>{text}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </m.div>
        ))}
      </div>
    </m.div>
  );
}
