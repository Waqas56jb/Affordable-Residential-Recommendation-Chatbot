import { Navigate, useLocation } from 'react-router-dom'
import { getAuthUser, setRedirectAfterLogin } from '@/services/auth'
import { ROUTES } from '@/constants/routes'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Secures routes: only renders children when user is logged in.
 * Stores intended path in sessionStorage (clean URL: no query params) and redirects to /login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const user = getAuthUser()

  if (!user) {
    const returnPath = location.pathname + location.search
    setRedirectAfterLogin(returnPath)
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}
