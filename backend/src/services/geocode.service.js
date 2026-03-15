/**
 * Reverse geocode: latitude, longitude → place name for use with destination lookup.
 * Uses OpenStreetMap Nominatim (no API key required).
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'

/**
 * Get a place name from coordinates (e.g. "London, United Kingdom").
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{ placeName: string, displayName?: string }>}
 */
export async function reverseGeocode(latitude, longitude) {
  const lat = Number(latitude)
  const lon = Number(longitude)
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    throw new Error('Valid latitude and longitude are required')
  }
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'json',
  })
  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { 'User-Agent': 'StudentStay-Backend/1.0' },
  })
  if (!res.ok) {
    throw new Error(`Geocode failed: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  const address = data?.address || {}
  const city = address.city || address.town || address.village || address.municipality || address.county
  const country = address.country
  const placeName = city && country ? `${city}, ${country}` : data?.display_name || `${lat},${lon}`
  return {
    placeName,
    displayName: data?.display_name,
  }
}
