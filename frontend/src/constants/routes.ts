/**
 * Route paths. Kept in a separate file so any module can import without circular dependency.
 */

export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  MAP: '/map',
  FIND_HOTELS: '/find-hotels',
  CHECK_CRIME: '/check-crime',
} as const

/** Paths that require authentication. Direct URL access redirects to login. */
export const PROTECTED_PATHS: string[] = [
  ROUTES.DASHBOARD,
  ROUTES.MAP,
  ROUTES.FIND_HOTELS,
  ROUTES.CHECK_CRIME,
]

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}
