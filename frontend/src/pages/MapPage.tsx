import { useState, useCallback, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { HiSearch, HiLocationMarker, HiX } from 'react-icons/hi'
import * as mapService from '@/services/map'
import type { GeocodeResult, RouteResult } from '@/services/map'
import 'leaflet/dist/leaflet.css'

const UK_CENTER: [number, number] = [54.5, -2.5]
const DEFAULT_ZOOM = 6
const ROUTE_ZOOM = 12
const SUGGESTION_DEBOUNCE_MS = 280
const MIN_QUERY_LENGTH = 2

const iconStart = new L.DivIcon({
  html: `<div style="
    width:28px;height:28px;
    background:linear-gradient(135deg,#2563eb 0%,#3b82f6 100%);
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 2px 10px rgba(37,99,235,0.5);
  "></div>`,
  className: 'custom-marker-start',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const iconDestination = new L.DivIcon({
  html: `<div style="
    width:32px;height:32px;
    background:linear-gradient(180deg,#dc2626 0%,#b91c1c 100%);
    border:3px solid #fff;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 2px 8px rgba(0,0,0,0.25);
  "></div>`,
  className: 'custom-marker-dest',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
})

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length < 2) return
    const bounds = L.latLngBounds(positions)
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
  }, [map, positions])
  return null
}

function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 })
  }, [map, center[0], center[1], zoom])
  return null
}

function RecenterButton({
  center,
  zoom,
}: {
  center: [number, number]
  zoom: number
}) {
  const map = useMap()
  return (
    <button
      type="button"
      onClick={() => map.flyTo(center, zoom, { duration: 1 })}
      className="absolute bottom-4 right-4 z-[1000] flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition"
      title="Recenter map"
    >
      <HiLocationMarker className="w-5 h-5" />
    </button>
  )
}

export function MapPage() {
  const [start, setStart] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const [destination, setDestination] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const [startQuery, setStartQuery] = useState('')
  const [destQuery, setDestQuery] = useState('')
  const [startSuggestions, setStartSuggestions] = useState<GeocodeResult[]>([])
  const [destSuggestions, setDestSuggestions] = useState<GeocodeResult[]>([])
  const [startSuggestionsOpen, setStartSuggestionsOpen] = useState(false)
  const [destSuggestionsOpen, setDestSuggestionsOpen] = useState(false)
  const [startSearching, setStartSearching] = useState(false)
  const [destSearching, setDestSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const startInputRef = useRef<HTMLInputElement>(null)
  const destInputRef = useRef<HTMLInputElement>(null)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const mapCardRef = useRef<HTMLDivElement>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(UK_CENTER)
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM)
  const startDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const destDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startPosition = start ? { lat: start.lat, lon: start.lon } : null
  const destPosition = destination ? { lat: destination.lat, lon: destination.lon } : null

  const fetchStartSuggestions = useCallback((q: string) => {
    const trimmed = q.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setStartSuggestions([])
      setStartSearching(false)
      return
    }
    setStartSearching(true)
    mapService
      .geocode(trimmed, 8)
      .then(setStartSuggestions)
      .catch(() => setStartSuggestions([]))
      .finally(() => setStartSearching(false))
  }, [])

  const fetchDestSuggestions = useCallback((q: string) => {
    const trimmed = q.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setDestSuggestions([])
      setDestSearching(false)
      return
    }
    setDestSearching(true)
    mapService
      .geocode(trimmed, 8)
      .then(setDestSuggestions)
      .catch(() => setDestSuggestions([]))
      .finally(() => setDestSearching(false))
  }, [])

  useEffect(() => {
    if (startDebounce.current) clearTimeout(startDebounce.current)
    const q = startQuery.trim()
    if (q.length < MIN_QUERY_LENGTH) {
      setStartSuggestions([])
      setStartSearching(false)
      return
    }
    startDebounce.current = setTimeout(() => fetchStartSuggestions(q), SUGGESTION_DEBOUNCE_MS)
    return () => {
      if (startDebounce.current) clearTimeout(startDebounce.current)
    }
  }, [startQuery, fetchStartSuggestions])

  useEffect(() => {
    if (destDebounce.current) clearTimeout(destDebounce.current)
    const q = destQuery.trim()
    if (q.length < MIN_QUERY_LENGTH) {
      setDestSuggestions([])
      setDestSearching(false)
      return
    }
    destDebounce.current = setTimeout(() => fetchDestSuggestions(q), SUGGESTION_DEBOUNCE_MS)
    return () => {
      if (destDebounce.current) clearTimeout(destDebounce.current)
    }
  }, [destQuery, fetchDestSuggestions])

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setLocating(true)
    setStartSuggestions([])
    setStartSuggestionsOpen(false)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setMapCenter([lat, lon])
        setMapZoom(ROUTE_ZOOM)
        setStart({ lat, lon, name: 'Current location (GPS)' })
        setStartQuery('Current location (GPS)')
        try {
          const rev = await mapService.reverseGeocode(lat, lon)
          const displayName = rev.placeName?.trim() || `Current location (${lat.toFixed(5)}, ${lon.toFixed(5)})`
          setStart((prev) => (prev ? { ...prev, name: displayName } : null))
          setStartQuery(displayName)
        } catch {
          const coordsName = `Current location (${lat.toFixed(5)}, ${lon.toFixed(5)})`
          setStartQuery(coordsName)
          setStart((prev) => (prev ? { ...prev, name: coordsName } : null))
        }
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }, [])

  const pickStart = useCallback((r: GeocodeResult) => {
    setStart({ lat: r.lat, lon: r.lon, name: r.display_name })
    setStartQuery(r.display_name)
    setStartSuggestions([])
    setStartSuggestionsOpen(false)
    setMapCenter([r.lat, r.lon])
    setMapZoom(ROUTE_ZOOM)
    startInputRef.current?.blur()
  }, [])

  const pickDestination = useCallback((r: GeocodeResult) => {
    setDestination({ lat: r.lat, lon: r.lon, name: r.display_name })
    setDestQuery(r.display_name)
    setDestSuggestions([])
    setDestSuggestionsOpen(false)
    setMapCenter([r.lat, r.lon])
    setMapZoom(ROUTE_ZOOM)
    destInputRef.current?.blur()
  }, [])

  const clearRoute = useCallback(() => {
    setDestination(null)
    setDestQuery('')
    setRoute(null)
    setRouteGeometry(null)
  }, [])

  useEffect(() => {
    if (!startPosition || !destPosition) {
      setRoute(null)
      setRouteGeometry(null)
      setRouteLoading(false)
      return
    }
    let cancelled = false
    setRouteLoading(true)
    mapService
      .getRouteWithGeometry(
        startPosition.lat,
        startPosition.lon,
        destPosition.lat,
        destPosition.lon
      )
      .then((res) => {
        if (!cancelled && res) {
          setRoute(res)
          setRouteGeometry(res.geometry ?? null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRoute(null)
          setRouteGeometry(null)
        }
      })
      .finally(() => {
        if (!cancelled) setRouteLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [startPosition?.lat, startPosition?.lon, destPosition?.lat, destPosition?.lon])

  const scrollToMap = useCallback(() => {
    mapCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const routePositions = [
    ...(startPosition ? [[startPosition.lat, startPosition.lon] as [number, number]] : []),
    ...(destPosition ? [[destPosition.lat, destPosition.lon] as [number, number]] : []),
  ]
  const recenterTarget: [number, number] = startPosition
    ? [startPosition.lat, startPosition.lon]
    : destPosition
      ? [destPosition.lat, destPosition.lon]
      : mapCenter
  const recenterZoom = startPosition && destPosition ? undefined : mapZoom

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-800 mb-0.5 sm:mb-1">Directions</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Enter start and destination to see the shortest driving route.</p>

        {/* Controls card – visible above map, dropdowns not clipped */}
        <div className="relative z-20 bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible mb-4 sm:mb-6">
          <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="relative z-[1100]">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Start</label>
                <div className="flex rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-shadow">
                  <button
                    type="button"
                    onClick={useMyLocation}
                    disabled={locating}
                    className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-l-lg sm:rounded-l-xl transition-colors disabled:opacity-50 touch-manipulation min-h-[44px]"
                    title="Use my current location"
                    aria-label="Use my current location"
                  >
                    <HiLocationMarker className="w-5 h-5" />
                  </button>
                  <input
                    ref={startInputRef}
                    type="text"
                    value={startQuery}
                    onChange={(e) => setStartQuery(e.target.value)}
                    onFocus={() => setStartSuggestionsOpen(true)}
                    onBlur={() => setTimeout(() => setStartSuggestionsOpen(false), 220)}
                    placeholder="Type address or click icon for GPS"
                    className="flex-1 min-w-0 py-2.5 sm:py-3 px-2.5 sm:px-3 rounded-r-lg sm:rounded-r-xl text-slate-800 placeholder-slate-400 focus:outline-none text-sm"
                    autoComplete="off"
                  />
                </div>
                {startSuggestionsOpen && startQuery.trim().length >= MIN_QUERY_LENGTH && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl py-1 max-h-56 overflow-y-auto z-[1200]"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <button
                      type="button"
                      onClick={useMyLocation}
                      disabled={locating}
                      className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-emerald-50 text-sm font-medium text-emerald-700 border-b border-slate-100"
                    >
                      <HiLocationMarker className="w-4 h-4 flex-shrink-0" />
                      {locating ? 'Getting location…' : 'Use my current location'}
                    </button>
                    {startSearching && startSuggestions.length === 0 ? (
                      <div className="px-3 py-4 text-center text-slate-500 text-sm">Searching…</div>
                    ) : startSuggestions.length === 0 ? (
                      <div className="px-3 py-4 text-center text-slate-500 text-sm">No places found. Try a different search.</div>
                    ) : (
                      startSuggestions.map((r) => (
                        <button
                          key={r.place_id}
                          type="button"
                          onClick={() => pickStart(r)}
                          className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-sm text-slate-700 truncate"
                        >
                          {r.display_name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="relative z-[1100]">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Destination</label>
                <div className="flex rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-shadow">
                  <span className="flex items-center justify-center w-10 sm:w-11 flex-shrink-0 text-slate-400 min-h-[44px]">
                    <HiSearch className="w-5 h-5" />
                  </span>
                  <input
                    ref={destInputRef}
                    type="text"
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    onFocus={() => setDestSuggestionsOpen(true)}
                    onBlur={() => setTimeout(() => setDestSuggestionsOpen(false), 220)}
                    placeholder="Type address or place"
                    className="flex-1 min-w-0 py-2.5 sm:py-3 px-2.5 sm:px-3 rounded-r-lg sm:rounded-r-xl text-slate-800 placeholder-slate-400 focus:outline-none text-sm"
                    autoComplete="off"
                  />
                  {destination && (
                    <button
                      type="button"
                      onClick={clearRoute}
                      className="pr-3 text-slate-400 hover:text-slate-600 flex-shrink-0"
                      aria-label="Clear destination"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {destSuggestionsOpen && destQuery.trim().length >= MIN_QUERY_LENGTH && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl py-1 max-h-56 overflow-y-auto z-[1200]"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {destSearching && destSuggestions.length === 0 ? (
                      <div className="px-3 py-4 text-center text-slate-500 text-sm">Searching…</div>
                    ) : destSuggestions.length === 0 ? (
                      <div className="px-3 py-4 text-center text-slate-500 text-sm">No places found. Try a different search.</div>
                    ) : (
                      destSuggestions.map((r) => (
                        <button
                          key={r.place_id}
                          type="button"
                          onClick={() => pickDestination(r)}
                          className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-sm text-slate-700 truncate"
                        >
                          {r.display_name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Get route button – visible CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={scrollToMap}
                disabled={!startPosition || !destPosition}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {routeLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Loading route…
                  </>
                ) : route ? (
                  <>View route on map</>
                ) : (
                  <>Get route</>
                )}
              </button>
              {route && !routeLoading && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-emerald-700">
                    {route.distance_text ?? (route.distance_metres >= 1000 ? `${(route.distance_metres / 1000).toFixed(1)} km` : `${Math.round(route.distance_metres)} m`)}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-medium">
                    {route.duration_text ?? `${Math.round(route.duration_seconds / 60)} min`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map – fixed height, contained, below controls; responsive height */}
        <div ref={mapCardRef} className="relative z-10 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="relative h-[300px] sm:h-[380px] md:h-[420px] min-h-[260px]">
            <MapContainer
              center={UK_CENTER}
              zoom={DEFAULT_ZOOM}
              className="w-full h-full rounded-b-xl"
              style={{ height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {routeGeometry && routeGeometry.length >= 2 && (
                <Polyline
                  positions={routeGeometry}
                  pathOptions={{ color: '#2563eb', weight: 6, opacity: 0.95 }}
                />
              )}
              {routePositions.length >= 2 && (
                <FitBounds positions={routeGeometry && routeGeometry.length >= 2 ? routeGeometry : routePositions} />
              )}
              {routePositions.length < 2 && (mapCenter[0] !== UK_CENTER[0] || mapCenter[1] !== UK_CENTER[1]) && (
                <FlyTo center={mapCenter} zoom={mapZoom} />
              )}
              {startPosition && (
                <Marker position={[startPosition.lat, startPosition.lon]} icon={iconStart} zIndexOffset={1000} />
              )}
              {destPosition && (
                <Marker position={[destPosition.lat, destPosition.lon]} icon={iconDestination} zIndexOffset={500} />
              )}
              <RecenterButton
                center={recenterTarget}
                zoom={recenterZoom ?? (startPosition && destPosition ? ROUTE_ZOOM : mapZoom)}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
