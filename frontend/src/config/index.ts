const DEFAULT_API_BASE = 'https://affordable-residential-recommendati-zeta.vercel.app/api'

export const APP_CONFIG = {
  appName: 'Student Stay',
  tagline: 'Best student housing near universities in UK & Qatar',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE,
} as const
