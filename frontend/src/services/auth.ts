import { APP_CONFIG } from '@/config'

const BASE = `${APP_CONFIG.apiBaseUrl}/auth`

export interface AuthUser {
  id: string
  email: string
  name: string
  created_at?: string
}

export interface LoginResponse {
  success: boolean
  user: AuthUser
}

export interface SignupResponse {
  success: boolean
  user: AuthUser
}

export interface ForgotPasswordResponse {
  success: boolean
  exists: boolean
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

type AuthFetchOptions = Omit<RequestInit, 'body'> & { body?: Record<string, unknown> }

async function authFetch<T>(path: string, options: AuthFetchOptions = {}): Promise<T> {
  const { body, ...rest } = options
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    ...rest,
    method: rest.method ?? 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers as HeadersInit),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = (data && typeof data.error === 'string') ? data.error : `Request failed: ${res.status}`
    throw new Error(message)
  }
  return data as T
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return authFetch<LoginResponse>('/login', { body: { email, password } })
}

export async function signup(name: string, email: string, password: string): Promise<SignupResponse> {
  return authFetch<SignupResponse>('/signup', { body: { name, email, password } })
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  return authFetch<ForgotPasswordResponse>('/forgot-password', { body: { email } })
}

export async function resetPassword(email: string, newPassword: string): Promise<ResetPasswordResponse> {
  return authFetch<ResetPasswordResponse>('/reset-password', { body: { email, newPassword } })
}

/** Persists across browser sessions so returning users stay logged in. Cleared only on explicit logout. */
const AUTH_USER_KEY = 'auth_user'

export function setAuthUser(user: AuthUser | null): void {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_USER_KEY)
  }
}

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

/** Use to guard navigation: returns true if user is persisted (e.g. returning visitor). */
export function isAuthenticated(): boolean {
  return getAuthUser() != null
}

/** Store intended path after login so URL stays clean (no ?redirect= in address bar). */
const REDIRECT_AFTER_LOGIN_KEY = 'auth_redirect_after_login'

export function setRedirectAfterLogin(path: string | null): void {
  if (path) {
    sessionStorage.setItem(REDIRECT_AFTER_LOGIN_KEY, path)
  } else {
    sessionStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY)
  }
}

export function getRedirectAfterLogin(): string | null {
  return sessionStorage.getItem(REDIRECT_AFTER_LOGIN_KEY)
}
