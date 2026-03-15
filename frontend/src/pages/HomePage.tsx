import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMap, HiLocationMarker, HiSearch, HiAcademicCap, HiArrowRight, HiShieldCheck } from 'react-icons/hi'
import { APP_CONFIG } from '@/config'
import { LANDING_IMAGES } from '@/constants/images'

// String paths to avoid circular dependency (HomePage is imported by routes)
const MODULES = [
  {
    to: '/',
    title: 'Explore UK & Qatar',
    description: 'Features, universities, safety, transport and everything you need to choose where to live.',
    icon: HiAcademicCap,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    shadow: 'shadow-emerald-500/25',
    delay: 0.1,
  },
  {
    to: '/map',
    title: 'Live Map',
    description: 'OpenStreetMap – search anywhere, see your location, POIs, supermarkets and measure distances in real time.',
    icon: HiMap,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
    shadow: 'shadow-violet-500/25',
    delay: 0.2,
  },
  {
    to: '/find-hotels',
    title: 'Find Hotels',
    description: 'Best hotel recommendations in UK & Qatar with map location finder. Search, compare and book.',
    icon: HiLocationMarker,
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    shadow: 'shadow-amber-500/25',
    delay: 0.3,
  },
  {
    to: '/check-crime',
    title: 'Check Crime',
    description: 'Real-time UK street-level crime. Search by location and month, view KPIs and heat map.',
    icon: HiShieldCheck,
    gradient: 'from-rose-500 via-red-500 to-amber-600',
    shadow: 'shadow-rose-500/25',
    delay: 0.4,
  },
]

export function HomePage() {
  return (
    <div className="min-h-screen bg-white" style={{ backgroundColor: '#ffffff' }}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(20,184,166,0.25),transparent)]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(139,92,246,0.08),transparent)]" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <img src={LANDING_IMAGES.logo} alt="" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold" style={{ color: '#0f172a' }}>{APP_CONFIG.appName}</span>
          </Link>
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(20,184,166,0.2)', color: '#0f766e' }}>
              <HiSearch className="w-4 h-4" />
              UK & Qatar · Student housing & travel
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>
              Find the best place to stay
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl" style={{ color: '#475569' }}>
              Explore cities, live maps and hotel recommendations – all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Three modules */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {MODULES.map((mod) => {
            const Icon = mod.icon
            return (
              <motion.div
                key={mod.to}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={mod.to}
                  className="group block h-full rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-lg hover:shadow-xl hover:border-slate-300/80 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`h-2 bg-gradient-to-r ${mod.gradient}`} />
                  <div className="p-6 sm:p-8">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.gradient} text-white shadow-lg ${mod.shadow} mb-5`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-teal-700 transition-colors" style={{ color: '#0f172a' }}>
                      {mod.title}
                    </h2>
                    <p className="mb-6 leading-relaxed" style={{ color: '#475569' }}>
                      {mod.description}
                    </p>
                    <span className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all" style={{ color: '#0d9488' }}>
                      Open
                      <HiArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <p className="mt-12 text-center text-sm" style={{ color: '#64748b' }}>
          Choose a module above to get started · No sign-up required to explore
        </p>
      </section>

      {/* CTA strip */}
      <section className="border-t border-gray-200" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-95 transition-opacity"
            style={{ backgroundColor: '#14b8a6' }}
          >
            Get started
            <HiArrowRight className="w-5 h-5" />
          </a>
          <Link
            to="/"
            className="inline-flex items-center hover:text-teal-600 font-medium transition-colors"
            style={{ color: '#475569' }}
          >
            Or explore features first →
          </Link>
        </div>
      </section>
    </div>
  )
}
