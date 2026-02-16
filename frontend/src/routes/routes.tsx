import type { RouteObject } from 'react-router-dom'
import { MainLayout, AuthLayout } from '@/layouts'
import { HomePage, ExplorePage, LoginPage, SignupPage, ForgotPasswordPage, DashboardPage, MapPage, FindHotelsPage, CheckCrimePage } from '@/pages'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ROUTES } from '@/constants/routes'

export { ROUTES }

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'dashboard', element: <ErrorBoundary><DashboardPage /></ErrorBoundary> },
      { path: 'map', element: <ErrorBoundary><MapPage /></ErrorBoundary> },
      { path: 'find-hotels', element: <ErrorBoundary><FindHotelsPage /></ErrorBoundary> },
      { path: 'check-crime', element: <ErrorBoundary><CheckCrimePage /></ErrorBoundary> },
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
