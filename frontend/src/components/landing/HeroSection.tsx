import { motion } from 'framer-motion'
import { HiAcademicCap, HiShieldCheck, HiArrowDown } from 'react-icons/hi'
import { LANDING_IMAGES } from '@/constants/images'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-200">
      {/* HD hero background - full viewport */}
      <div className="absolute inset-0">
        <img
          src={LANDING_IMAGES.hero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-white/55" aria-hidden />
      </div>
      {/* Chart line - subtle */}
      <svg
        className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none opacity-30"
        viewBox="0 0 1200 200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M0 160 Q150 140 280 120 T560 80 T840 50 T1200 20" stroke="#44D7B6" strokeWidth="2" fill="none" />
        {[0, 200, 400, 600, 800, 1000, 1200].map((x, i) => (
          <circle key={i} cx={x} cy={Math.max(20, 160 - (x / 1200) * 140)} r="4" fill="#0d9488" opacity="0.9" />
        ))}
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold mb-5"
          >
            <HiAcademicCap className="w-5 h-5 text-primary-400" />
            For students in UK & Qatar
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black leading-tight mb-4 [text-shadow:0_1px_2px_rgba(255,255,255,0.9)]">
            Find the best place to live{' '}
            <span className="text-primary-700">near your university</span>
          </h1>
          <p className="text-base sm:text-lg text-black max-w-2xl mx-auto mb-6 font-medium [text-shadow:0_1px_2px_rgba(255,255,255,0.8)]">
            Affordable, crime-free housing with halal food, cheap transport, and quality facilities — tailored for students in the UK and Qatar.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-black font-semibold text-sm sm:text-base [text-shadow:0_1px_2px_rgba(255,255,255,0.8)] mb-8">
            <span className="flex items-center gap-2">
              <HiShieldCheck className="w-5 h-5 text-primary-600" /> Safe areas
            </span>
            <span>Low cost</span>
            <span>Near universities</span>
            <span>Halal & quality food</span>
          </div>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 min-w-[180px] bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg border-2 border-primary-800 hover:bg-primary-800 hover:scale-[1.02] active:scale-100 transition-all duration-200"
          >
            Get started
            <HiArrowDown className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
