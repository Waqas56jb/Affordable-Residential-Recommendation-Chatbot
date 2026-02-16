import { APP_CONFIG } from '@/config'

export function AuthFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="flex-shrink-0 border-t border-gray-200 bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-black">
        <p>© {year} {APP_CONFIG.appName}. All rights reserved.</p>
      </div>
    </footer>
  )
}
