import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FinalCTA() {
  const { t } = useLanguage();

  const riskItems = [
    t('cta.risk1'),
    t('cta.risk2'),
    t('cta.risk3'),
    t('cta.risk4'),
  ];

  const email = t('footer.contact');
  const subject = encodeURIComponent('Partner Discovery Call Request');
  const mailto = `mailto:${email}?subject=${subject}`;

  return (
    <section id="final-cta" className="py-28 bg-slate-950 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[900px] h-[500px] bg-blue-600/7 rounded-full blur-3xl" />
      </div>

      {/* Subtle top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
            <ShieldCheck size={14} className="shrink-0" />
            {t('cta.badge')}
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-2">
              {t('cta.title')}
            </h2>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t('cta.titleAccent')}
            </h2>
          </div>

          {/* Sub */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('cta.sub')}
          </p>

          {/* CTA Button */}
          <motion.a
            href={mailto}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-2xl shadow-blue-500/25 text-base sm:text-lg hover:shadow-blue-500/40 transition-shadow"
          >
            {t('cta.btn')}
            <ArrowRight size={20} />
          </motion.a>

          {/* Risk-free items */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-2">
            {riskItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
