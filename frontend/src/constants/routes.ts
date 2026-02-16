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
