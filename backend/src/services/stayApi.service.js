import { config, isStayApiConfigured } from '../config.js'

const { baseUrl, apiKey } = config.stayApi

/**
 * Low-level request helper for StayAPI.
 * All external accommodation API calls go through here for easy swapping later.
 * @param {string} path - API path (e.g. '/booking/destinations/lookup')
 * @param {Record<string, string | number | undefined>} [params] - Query params
 * @returns {Promise<unknown>} JSON response
 */
export async function stayApiRequest(path, params = {}) {
  if (!isStayApiConfigured()) {
    throw new Error('STAYAPI_API_KEY is not set. Add it to .env to enable accommodation search.')
  }
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const url = `${baseUrl}${path}${search.toString() ? `?${search}` : ''}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`StayAPI error: ${res.status} ${res.statusText}. ${text}`)
  }
  return res.json()
}

/**
 * Resolve a location name to a Booking.com destination ID.
 * @param {string} query - Location name (e.g. "London", "Doha")
 * @returns {Promise<import('../types.js').DestinationLookupResponse>}
 */
export async function lookupDestination(query) {
  const trimmed = typeof query === 'string' ? query.trim() : ''
  if (!trimmed) {
    return { success: false, query: '', message: 'Query is required' }
  }
  return stayApiRequest('/booking/destinations/lookup', { query: trimmed })
}

/**
 * Search hotels by destination ID and dates.
 * @param {import('../types.js').SearchParams} params
 * @returns {Promise<import('../types.js').HotelSearchResponse>}
 */
export async function searchHotels(params) {
  const {
    dest_id,
    dest_type = 'CITY',
    checkin,
    checkout,
    adults = 2,
    rooms = 1,
    children = 0,
    rows_per_page = 20,
    offset = 0,
    currency = 'GBP',
  } = params

  if (dest_id == null || !checkin || !checkout) {
    throw new Error('dest_id, checkin and checkout are required')
  }

  return stayApiRequest('/booking/search', {
    dest_id,
    dest_type,
    checkin,
    checkout,
    adults,
    rooms,
    children,
    rows_per_page,
    offset,
    currency,
  })
}

export { isStayApiConfigured }
