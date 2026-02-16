/**
 * Map API client. All calls go to backend /api/map (real-time OSM/Nominatim/Overpass/OSRM).
 */

const BASE = '/api/map'

export interface GeocodeResult {
  lat: number
  lon: number
  display_name: string
  place_id: number
  type?: string
  boundingbox?: string[]
}

export interface ReverseResult {
  success: boolean
  placeName: string
  display_name?: string
  address?: Record<string, string>
}

export interface PoiResult {
  lat: number
  lon: number
  name: string
  type: string
  tags?: Record<string, string>
}

export interface RouteResult {
  success: boolean
  distance_metres: number
  duration_seconds: number
  distance_text?: string
  duration_text?: string
  straight_line_metres?: number
  geometry?: [number, number][] // [lat, lon][] for Leaflet
}

export async function geocode(query: string, limit = 10, countrycodes?: string): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  if (countrycodes) params.set('countrycodes', countrycodes)
  const res = await fetch(`${BASE}/geocode?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Geocode failed')
  return data.results ?? []
}

export async function reverseGeocode(lat: number, lon: number): Promise<ReverseResult> {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon) })
  const res = await fetch(`${BASE}/reverse?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Reverse geocode failed')
  return data
}

export async function getPois(
  lat: number,
  lon: number,
  radius = 2000,
  types?: string
): Promise<PoiResult[]> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    radius: String(radius),
  })
  if (types) params.set('types', types)
  const res = await fetch(`${BASE}/pois?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'POIs fetch failed')
  return data.results ?? []
}

export async function getRoute(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<RouteResult | null> {
  const params = new URLSearchParams({
    fromLat: String(fromLat),
    fromLon: String(fromLon),
    toLat: String(toLat),
    toLon: String(toLon),
  })
  const res = await fetch(`${BASE}/route?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Route failed')
  if (!data.success || data.distance_metres == null) return null
  return data
}

/** Route with street path geometry (for drawing on map). */
export async function getRouteWithGeometry(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<RouteResult | null> {
  const params = new URLSearchParams({
    fromLat: String(fromLat),
    fromLon: String(fromLon),
    toLat: String(toLat),
    toLon: String(toLon),
  })
  const res = await fetch(`${BASE}/route/geometry?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Route failed')
  if (!data.success || data.distance_metres == null) return null
  return data
}

export async function getDistance(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<{ distance_metres: number; distance_text?: string }> {
  const params = new URLSearchParams({
    fromLat: String(fromLat),
    fromLon: String(fromLon),
    toLat: String(toLat),
    toLon: String(toLon),
  })
  const res = await fetch(`${BASE}/distance?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Distance failed')
  return { distance_metres: data.distance_metres, distance_text: data.distance_text }
}
