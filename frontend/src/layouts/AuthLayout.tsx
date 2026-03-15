import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiHome } from 'react-icons/hi'
import { APP_CONFIG } from '@/config'
import { LANDING_IMAGES } from '@/constants/images'
import { AuthFooter } from '@/components/layout'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex-shrink-0 border-b border-primary-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={LANDING_IMAGES.logo} alt={APP_CONFIG.appName} className="w-9 h-9 object-contain" />
            <span className="text-lg font-bold text-primary-800">{APP_CONFIG.appName}</span>
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/"
              className="group relative inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-bold rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 border border-teal-400/30 min-h-[44px]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <HiHome className="w-5 h-5 relative z-10 flex-shrink-0" />
              <span className="relative z-10">Back to home</span>
            </Link>
          </motion.div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <AuthFooter />
    </div>
  )
}
