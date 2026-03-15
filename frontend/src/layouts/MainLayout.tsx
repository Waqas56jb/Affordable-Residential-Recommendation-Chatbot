import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { Header, Footer } from '@/components/layout'
import { ChatWidget } from '@/components/chat'
import { getAuthUser, setRedirectAfterLogin } from '@/services/auth'
import { ROUTES, isProtectedPath } from '@/constants/routes'

export function MainLayout() {
  const location = useLocation()
  const user = getAuthUser()

  if (isProtectedPath(location.pathname) && !user) {
    setRedirectAfterLogin(location.pathname + location.search)
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Header />
      <main className="flex-1 bg-white min-w-0 w-full">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
