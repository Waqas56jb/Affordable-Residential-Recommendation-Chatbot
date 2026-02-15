export const APP_CONFIG = {
  appName: 'Student Stay',
  tagline: 'Best student housing near universities in UK & Qatar',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
} as const
