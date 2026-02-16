import { Outlet, Link } from 'react-router-dom'
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
          <Link
            to="/"
            className="text-sm font-medium text-primary-700 hover:text-primary-600 transition"
          >
            ← Back to home
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <AuthFooter />
    </div>
  )
}
