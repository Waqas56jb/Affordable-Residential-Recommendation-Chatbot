import { useRoutes } from 'react-router-dom'
import { routeConfig } from './routes'

export function AppRoutes() {
  return useRoutes(routeConfig)
}

export { ROUTES } from './routes'
