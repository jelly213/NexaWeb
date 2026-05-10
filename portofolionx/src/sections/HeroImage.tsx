import { motion } from 'framer-motion';
import { Globe, Zap, CheckCircle2, TrendingUp } from 'lucide-react';

const scoreMetrics = [
  { label: 'Performance', score: 96 },
  { label: 'SEO', score: 100 },
  { label: 'Accessibility', score: 98 },
];

export default function HeroImage() {
  const circumference = 2 * Math.PI * 40;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      className="relative flex items-center justify-center lg:justify-end"
    >
      <div className="relative w-full max-w-md">

        {/* Main Dashboard Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/40">

          {/* Card Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                <Zap size={15} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Core Web Vitals</p>
                <p className="text-slate-500 text-xs">Mobile Performance Report</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Score + Metrics */}
          <div className="flex items-center gap-6 mb-6">

            {/* Circular Progress */}
            <div className="relative shrink-0 w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <motion.circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - 0.96) }}
                  transition={{ delay: 0.9, duration: 1.6, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="text-2xl font-extrabold text-white"
                >
                  96
                </motion.span>
              </div>
            </div>

            {/* Metric Bars */}
            <div className="space-y-3 flex-1">
              {scoreMetrics.map(({ label, score }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-semibold">{score}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 1.1, duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bilingual Row */}
          <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl mb-3">
            <Globe size={15} className="text-blue-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold">Native Bilingual Architecture</p>
              <p className="text-slate-500 text-xs truncate">
                domain.com/<span className="text-blue-400">en</span>/ · domain.com/<span className="text-blue-400">fr</span>/
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs rounded-md font-bold">EN</span>
              <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs rounded-md font-bold">FR</span>
            </div>
          </div>

          {/* Delivery Row */}
          <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl">
            <TrendingUp size={15} className="text-cyan-400 shrink-0" />
            <div className="flex-1">
              <p className="text-white text-xs font-semibold">White-Label Delivery</p>
              <p className="text-slate-500 text-xs">48-hour guaranteed turnaround</p>
            </div>
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
          </div>
        </div>

        {/* Floating Margin Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
          className="absolute -bottom-15 -left-4 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-xl"
        >
          <p className="text-xs text-slate-400 mb-0.5">Avg. agency margin</p>
          <p className="text-lg font-extrabold text-emerald-400 leading-tight">$1,500–$4K+</p>
          <p className="text-xs text-slate-600">per project</p>
        </motion.div>

        {/* Floating Zap Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.4, type: 'spring' }}
          className="absolute -top-4 -right-4 w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/30"
        >
          <Zap size={18} className="text-white fill-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}
