import type { RouteObject } from 'react-router-dom'
import { MainLayout, AuthLayout } from '@/layouts'
import { HomePage, ExplorePage, LoginPage, SignupPage, ForgotPasswordPage, DashboardPage, MapPage, FindHotelsPage, CheckCrimePage } from '@/pages'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ROUTES } from '@/constants/routes'

export { ROUTES }

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <ExplorePage /> },
      { path: 'explore', element: <HomePage /> },
      { path: 'dashboard', element: <ErrorBoundary><ProtectedRoute><DashboardPage /></ProtectedRoute></ErrorBoundary> },
      { path: 'map', element: <ErrorBoundary><ProtectedRoute><MapPage /></ProtectedRoute></ErrorBoundary> },
      { path: 'find-hotels', element: <ErrorBoundary><ProtectedRoute><FindHotelsPage /></ProtectedRoute></ErrorBoundary> },
      { path: 'check-crime', element: <ErrorBoundary><ProtectedRoute><CheckCrimePage /></ProtectedRoute></ErrorBoundary> },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/signup',
    element: <AuthLayout />,
    children: [{ index: true, element: <SignupPage /> }],
  },
  {
    path: '/forgot-password',
    element: <AuthLayout />,
    children: [{ index: true, element: <ForgotPasswordPage /> }],
  },
]
