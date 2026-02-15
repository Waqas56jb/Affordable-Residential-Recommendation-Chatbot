import type { RouteObject } from 'react-router-dom'
import { MainLayout } from '@/layouts'
import { HomePage } from '@/pages'

export const ROUTES = {
  HOME: '/',
} as const

export const routeConfig: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]
