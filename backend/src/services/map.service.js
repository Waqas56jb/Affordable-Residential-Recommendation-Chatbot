/**
 * Map service: real-time geocoding, POIs, and routing via OpenStreetMap ecosystem.
 * No API keys; uses Nominatim, Overpass, and OSRM public endpoints.
 */

const NOMINATIM_SEARCH = 'https://nominatim.openstreetmap.org/search'
const NOMINATIM_REVERSE = 'https://nominatim.openstreetmap.org/reverse'
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const OSRM_ROUTE = 'https://router.project-osrm.org/route/v1'

const USER_AGENT = 'StudentStay-Map/1.0 (https://github.com/student-stay)'

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'User-Agent': USER_AGENT, ...options.headers },
  })
  if (!res.ok) throw new Error(`Map service error: ${res.status} ${res.statusText}`)
  return res.json()
}

/** Fetch from Nominatim with English-only and high-precision behaviour. */
async function fetchNominatim(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'en',
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`Map service error: ${res.status} ${res.statusText}`)
  return res.json()
}

/**
 * Forward geocode: search place by name (anywhere in the world).
 * @param {string} query - Search string (e.g. "London", "Doha", "New York")
 * @param {{ limit?: number, countrycodes?: string }} [opts]
 * @returns {Promise<Array<{ lat: number, lon: number, display_name: string, place_id: number, type?: string }>>}
 */
export async function forwardGeocode(query, opts = {}) {
  const q = typeof query === 'string' ? query.trim() : ''
  if (!q) return []
  const params = new URLSearchParams({
    q,
    format: 'json',
    limit: String(opts.limit ?? 10),
    addressdetails: '1',
    'accept-language': 'en',
  })
  if (opts.countrycodes) params.set('countrycodes', opts.countrycodes)
  const data = await fetchNominatim(`${NOMINATIM_SEARCH}?${params}`)
  if (!Array.isArray(data)) return []
  return data.map((item) => ({
    lat: Number(item.lat),
    lon: Number(item.lon),
    display_name: item.display_name ?? '',
    place_id: item.place_id,
    type: item.type,
    boundingbox: item.boundingbox,
  }))
}

/**
 * Reverse geocode: get place name from coordinates.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{ placeName: string, display_name?: string, address?: object }>}
 */
export async function reverseGeocodeMap(lat, lon) {
  const latitude = Number(lat)
  const longitude = Number(lon)
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new Error('Valid latitude and longitude are required')
  }
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: 'json',
    'accept-language': 'en',
  })
  const data = await fetchNominatim(`${NOMINATIM_REVERSE}?${params}`)
  const address = data?.address || {}
  const city = address.city || address.town || address.village || address.municipality || address.county
  const country = address.country
  const placeName = city && country ? `${city}, ${country}` : data?.display_name || `${latitude},${longitude}`
  return {
    placeName,
    display_name: data?.display_name,
    address: data?.address,
  }
}

/**
 * Build Overpass query for POIs around a point (radius in metres).
 * types: comma-separated e.g. "supermarket,convenience,pharmacy,restaurant,cafe,school,hospital"
 * @param {number} lat
 * @param {number} lon
 * @param {number} radiusMetres
 * @param {string} [types] - e.g. "supermarket,convenience,pharmacy"
 * @returns {Promise<Array<{ lat: number, lon: number, name: string, type: string, tags?: object }>>}
 */
export async function getPois(lat, lon, radiusMetres = 2000, types = 'supermarket,convenience,pharmacy,restaurant,cafe,school,hospital,bank,atm') {
  const latitude = Number(lat)
  const longitude = Number(lon)
  const radius = Math.min(Number(radiusMetres) || 2000, 10000)
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return []

  const defaultTypes = 'supermarket,convenience,pharmacy,restaurant,cafe,school,hospital,bank,atm'
  const typeList = (typeof types === 'string' && types.trim() ? types : defaultTypes).split(',').map((t) => t.trim()).filter(Boolean)
  if (typeList.length === 0) return []
  const shopQuery = typeList
    .filter((t) => ['supermarket', 'convenience', 'pharmacy'].includes(t))
    .map((t) => `node["shop"="${t}"](around:${radius},${latitude},${longitude});way["shop"="${t}"](around:${radius},${latitude},${longitude});`)
    .join('')
  const amenityQuery = typeList
    .filter((t) => !['supermarket', 'convenience', 'pharmacy'].includes(t))
    .map((t) => `node["amenity"="${t}"](around:${radius},${latitude},${longitude});way["amenity"="${t}"](around:${radius},${latitude},${longitude});`)
    .join('')

  const overpassQuery = `
    [out:json][timeout:15];
    (
      ${shopQuery}
      ${amenityQuery}
    );
    out center;
  `.replace(/\n\s+/g, ' ')

  const data = await fetchJson(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(overpassQuery)}`,
  })

  const elements = data?.elements ?? []
  const results = []
  const seen = new Set()
  for (const el of elements) {
    const lat = el.lat ?? el.center?.lat
    const lon = el.lon ?? el.center?.lon ?? el.center?.lon
    if (lat == null || lon == null) continue
    const key = `${lat.toFixed(5)},${lon.toFixed(5)}`
    if (seen.has(key)) continue
    seen.add(key)
    const tags = el.tags || {}
    const name = tags.name || tags.brand || 'Unnamed'
    const type = tags.shop || tags.amenity || 'place'
    results.push({
      lat: Number(lat),
      lon: Number(lon),
      name: String(name),
      type: String(type),
      tags,
    })
  }
  return results
}

/**
 * Get route distance and duration between two points (real-time OSRM).
 * @param {{ fromLat: number, fromLon: number, toLat: number, toLon: number }} params
 * @returns {Promise<{ distance_metres: number, duration_seconds: number, distance_text?: string, duration_text?: string } | null>}
 */
export async function getRoute(params) {
  const { fromLat, fromLon, toLat, toLon } = params
  const coords = [fromLon, fromLat, toLon, toLat].map(Number)
  if (coords.some(Number.isNaN)) return null
  const coordPair = `${coords[0].toFixed(6)},${coords[1].toFixed(6)};${coords[2].toFixed(6)},${coords[3].toFixed(6)}`
  const url = `${OSRM_ROUTE}/driving/${coordPair}?overview=false`
  try {
    const data = await fetchJson(url)
    if (data?.code !== 'Ok' || !data?.routes?.[0]) return null
    const route = data.routes[0]
    const distance_metres = route.distance ?? 0
    const duration_seconds = route.duration ?? 0
    return {
      distance_metres,
      duration_seconds,
      distance_text: distance_metres >= 1000 ? `${(distance_metres / 1000).toFixed(1)} km` : `${Math.round(distance_metres)} m`,
      duration_text: duration_seconds >= 60 ? `${Math.round(duration_seconds / 60)} min` : `${Math.round(duration_seconds)} sec`,
    }
  } catch {
    return null
  }
}

/**
 * Get route with street geometry: driving-only (hurdle-free), shortest/fastest path on road network.
 * Uses high-precision coordinates (6 decimals) for accurate pin-to-pin routing.
 * @param {{ fromLat: number, fromLon: number, toLat: number, toLon: number }} params
 * @returns {Promise<{ distance_metres: number, duration_seconds: number, distance_text?: string, duration_text?: string, geometry?: Array<[number, number]> } | null>}
 * geometry is [lat, lon][] for frontend
 */
export async function getRouteWithGeometry(params) {
  const { fromLat, fromLon, toLat, toLon } = params
  const coords = [fromLon, fromLat, toLon, toLat].map(Number)
  if (coords.some(Number.isNaN)) return null
  const coordPair = `${coords[0].toFixed(6)},${coords[1].toFixed(6)};${coords[2].toFixed(6)},${coords[3].toFixed(6)}`
  const url = `${OSRM_ROUTE}/driving/${coordPair}?overview=full&geometries=geojson`
  try {
    const data = await fetchJson(url)
    if (data?.code !== 'Ok' || !data?.routes?.[0]) return null
    const route = data.routes[0]
    const distance_metres = route.distance ?? 0
    const duration_seconds = route.duration ?? 0
    const geom = route.geometry
    let geometry = null
    if (geom?.coordinates && Array.isArray(geom.coordinates)) {
      geometry = geom.coordinates.map(([lon, lat]) => [lat, lon])
    }
    return {
      distance_metres,
      duration_seconds,
      distance_text: distance_metres >= 1000 ? `${(distance_metres / 1000).toFixed(1)} km` : `${Math.round(distance_metres)} m`,
      duration_text: duration_seconds >= 60 ? `${Math.round(duration_seconds / 60)} min` : `${Math.round(duration_seconds)} sec`,
      geometry,
    }
  } catch {
    return null
  }
}

/**
 * Straight-line distance in metres (Haversine).
 * @param {{ lat: number, lon: number }} from
 * @param {{ lat: number, lon: number }} to
 * @returns {number}
 */
export function haversineDistance(from, to) {
  const R = 6371000
  const dLat = ((to.lat - from.lat) * Math.PI) / 180
  const dLon = ((to.lon - from.lon) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) * Math.cos((to.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
