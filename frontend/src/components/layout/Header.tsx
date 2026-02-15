import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiArrowRight } from 'react-icons/hi'
import { ROUTES } from '@/routes'
import { APP_CONFIG } from '@/config'
import { LANDING_IMAGES } from '@/constants/images'

const navLinks = [
  { to: '#features', label: 'Features' },
  { to: '#uk-qatar', label: 'UK & Qatar' },
  { to: '#how-it-works', label: 'How it works' },
  { to: '#insights', label: 'Insights' },
  { to: '#facilities', label: 'Facilities' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-primary-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0">
            <img src={LANDING_IMAGES.logo} alt={APP_CONFIG.appName} className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-black hidden sm:inline">
              {APP_CONFIG.appName}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="text-black hover:text-primary-600 font-medium transition-colors relative py-1 border-b-2 border-transparent hover:border-primary-500"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#features"
              className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-primary-700 text-white shadow-md border border-primary-800 hover:bg-primary-800 transition-all duration-300"
            >
              Get started
              <HiArrowRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-black hover:bg-primary-50 hover:text-primary-600 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-primary-100 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-black hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 px-3"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-3 font-bold rounded-xl bg-primary-700 text-white border border-primary-800 mt-4"
              >
                Get started
                <HiArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
