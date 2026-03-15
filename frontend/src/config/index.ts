const PRODUCTION_API_BASE = 'https://affordable-residential-recommendati-zeta.vercel.app/api'

/** In dev (npm run dev) use local backend via Vite proxy. In production use deployed API. Override with VITE_API_BASE_URL. */
export const APP_CONFIG = {
  appName: 'Student Stay',
  tagline: 'Best student housing near universities in UK & Qatar',
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.DEV ? '/api' : PRODUCTION_API_BASE),
} as const
