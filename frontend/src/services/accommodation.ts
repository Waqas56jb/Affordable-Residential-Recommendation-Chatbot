import { APP_CONFIG } from '@/config'
import type {
  DestinationLookupResponse,
  HotelSearchResponse,
  SearchParams,
} from '@/types/accommodation'

const BASE = `${APP_CONFIG.apiBaseUrl}/accommodation`

async function backendFetch<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const search = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') search.set(k, String(v))
    })
  }
  const url = `${BASE}${path}${search.toString() ? `?${search}` : ''}`
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) {
    const text = await res.text()
    let message = `Request failed: ${res.status} ${res.statusText}`
    try {
      const j = JSON.parse(text)
      if (j.message) message = j.message
    } catch {
      if (text) message = text
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

/** Check if the backend accommodation API is configured (backend has STAYAPI_API_KEY). */
export async function getAccommodationStatus(): Promise<{ configured: boolean }> {
  try {
    const res = await fetch(`${BASE}/status`)
    const data = await res.json()
    return { configured: Boolean(data?.configured) }
  } catch {
    return { configured: false }
  }
}

/** Resolve location name (e.g. "London", "Doha") to destination ID via backend. */
export async function lookupDestination(
  query: string
): Promise<DestinationLookupResponse> {
  if (!query.trim()) {
    return { success: false, query: '', message: 'Query is required' }
  }
  return backendFetch<DestinationLookupResponse>('/destinations/lookup', {
    query: query.trim(),
  })
}

/** Search hotels via backend (destination ID + dates). */
export async function searchHotels(
  params: SearchParams
): Promise<HotelSearchResponse> {
  const q: Record<string, string | number> = {
    dest_id: params.dest_id,
    dest_type: params.dest_type ?? 'CITY',
    checkin: params.checkin,
    checkout: params.checkout,
    adults: params.adults ?? 2,
    rooms: params.rooms ?? 1,
    children: params.children ?? 0,
    rows_per_page: params.rows_per_page ?? 20,
    offset: params.offset ?? 0,
    currency: params.currency ?? 'GBP',
  }
  return backendFetch<HotelSearchResponse>('/search', q)
}
