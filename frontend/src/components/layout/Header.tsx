import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiArrowRight } from 'react-icons/hi'
import { APP_CONFIG } from '@/config'
import { LANDING_IMAGES } from '@/constants/images'

// Use string paths to avoid circular dependency (Header <- layout <- routes)
const navLinks = [
  { to: '/', label: 'Home', isRoute: true },
  { to: '/explore#features', label: 'Explore', isRoute: true },
  { to: '/map', label: 'Map', isRoute: true },
  { to: '/find-hotels', label: 'Find Hotels', isRoute: true },
  { to: '/check-crime', label: 'Check Crime', isRoute: true },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={LANDING_IMAGES.logo} alt={APP_CONFIG.appName} className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-gray-900 sm:inline" style={{ color: '#111827' }}>
              {APP_CONFIG.appName}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              (link as { isRoute?: boolean }).isRoute ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-medium transition-colors relative py-1 border-b-2 border-transparent hover:border-teal-500"
                  style={{ color: '#111827' }}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.to}
                  href={link.to}
                  className="font-medium transition-colors relative py-1 border-b-2 border-transparent hover:border-teal-500"
                  style={{ color: '#111827' }}
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-sm font-bold rounded-xl shadow-md border-2 border-teal-600 hover:opacity-90 transition-all duration-300"
              style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
            >
              <span className="hidden sm:inline">Get started</span>
              <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#ffffff' }} />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
              style={{ color: '#111827' }}
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
            className="lg:hidden border-t border-gray-200"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) =>
                (link as { isRoute?: boolean }).isRoute ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-medium rounded-lg hover:bg-gray-100 px-3"
                    style={{ color: '#111827' }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-medium rounded-lg hover:bg-gray-100 px-3"
                    style={{ color: '#111827' }}
                  >
                    {link.label}
                  </a>
                )
              )}
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-3 font-bold rounded-xl border-2 border-teal-600 hover:opacity-90 mt-4"
                style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
              >
                Get started
                <HiArrowRight className="w-4 h-4" style={{ color: '#ffffff' }} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
