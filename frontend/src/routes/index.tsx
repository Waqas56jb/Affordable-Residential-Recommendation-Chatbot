import { useRoutes, Navigate } from 'react-router-dom'
import { routeConfig } from './routes'

export function AppRoutes() {
  const element = useRoutes(routeConfig)
  if (element == null) {
    return <Navigate to="/" replace />
  }
  return element
}

export { ROUTES } from '@/constants/routes'
