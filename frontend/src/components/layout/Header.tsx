import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiArrowRight, HiLogout } from 'react-icons/hi'
import { APP_CONFIG } from '@/config'
import { LANDING_IMAGES } from '@/constants/images'
import { getAuthUser, setAuthUser } from '@/services/auth'

// Use string paths to avoid circular dependency (Header <- layout <- routes)
const navLinks = [
  { to: '/', label: 'Home', isRoute: true },
  { to: '/explore', label: 'Explore', isRoute: true },
  { to: '/map', label: 'Map', isRoute: true },
  { to: '/find-hotels', label: 'Find Hotels', isRoute: true },
  { to: '/check-crime', label: 'Check Crime', isRoute: true },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const user = getAuthUser()

  const handleLogout = () => {
    setAuthUser(null)
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-[1001] border-b border-gray-200 shadow-sm safe-area-inset-top" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0 group">
            <span className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/25 ring-2 ring-white ring-offset-2 ring-offset-white transition group-hover:shadow-teal-500/40 group-hover:scale-105 flex-shrink-0">
              <img src={LANDING_IMAGES.logo} alt="" className="w-5 h-5 sm:w-7 sm:h-7 object-contain drop-shadow-sm" />
            </span>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate hidden sm:inline">
              {APP_CONFIG.appName}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
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
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-600 truncate max-w-[100px] md:max-w-[120px] px-2 py-1 rounded-lg bg-slate-100/80" title={user.email}>
                  {user.name}
                </span>
                <motion.button
                  type="button"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 border border-teal-400/30 touch-manipulation min-h-[44px]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <HiLogout className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 flex-shrink-0" />
                  <span className="relative z-10 hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-md border-2 border-teal-600 hover:opacity-90 transition-all duration-300 min-h-[44px] touch-manipulation"
                style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
              >
                <span className="hidden sm:inline">Get started</span>
                <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#ffffff' }} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
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
              {user ? (
                <motion.button
                  type="button"
                  onClick={() => handleLogout()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 font-bold rounded-2xl mt-4 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl transition-all"
                >
                  <HiLogout className="w-5 h-5" />
                  Logout
                </motion.button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 font-bold rounded-xl border-2 border-teal-600 hover:opacity-90 mt-4"
                  style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
                >
                  Get started
                  <HiArrowRight className="w-4 h-4" style={{ color: '#ffffff' }} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
