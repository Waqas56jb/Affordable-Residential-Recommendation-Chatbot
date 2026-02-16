import { useState, useCallback, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiSearch,
  HiLocationMarker,
  HiX,
  HiRefresh,
  HiChevronRight,
} from 'react-icons/hi'
import * as mapService from '@/services/map'
import type { GeocodeResult, PoiResult, RouteResult } from '@/services/map'
import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER: [number, number] = [54.5, -2.5]
const DEFAULT_ZOOM = 6
const POI_RADIUS = 2500
const SEARCH_DEBOUNCE_MS = 350

// User / current location: blue pulse-style circle (GPS)
const iconUser = new L.DivIcon({
  html: `<div style="
    width:24px;height:24px;
    background:linear-gradient(135deg,#2563eb 0%,#3b82f6 100%);
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 2px 8px rgba(37,99,235,0.5),0 1px 3px rgba(0,0,0,0.3);
    animation:pulse 1.5s ease-in-out infinite;
  "></div>
  <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:0.9}}</style>`,
  className: 'custom-marker-user',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

// Destination pin: red, prominent
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

const iconPoi = new L.DivIcon({
  html: '<div style="background:#eab308;width:12px;height:12px;border-radius:2px;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>',
  className: 'custom-marker-poi',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function iconForSearchType(type?: string): L.DivIcon {
  const icons: Record<string, string> = {
    city: '🏙️',
    town: '🏘️',
    village: '🏡',
    state: '🗺️',
    country: '🌍',
    railway: '🚉',
    attraction: '⭐',
    building: '🏢',
    default: '📍',
  }
  const emoji = type ? icons[type] || icons.default : icons.default
  return new L.DivIcon({
    html: `<div style="font-size:20px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4))">${emoji}</div>`,
    className: 'custom-marker-search',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  })
}

function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 })
  }, [map, center[0], center[1], zoom])
  return null
}

function MapReady({ onReady }: { onReady: () => void }) {
  useMap()
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function RecenterButton({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  return (
    <button
      type="button"
      onClick={() => map.flyTo(center, zoom, { duration: 1 })}
      className="absolute bottom-3 right-3 z-[1000] flex items-center justify-center w-10 h-10 rounded-xl bg-white/95 border border-slate-200 shadow-md text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition"
      title="Recenter map"
    >
      <HiLocationMarker className="w-5 h-5" />
    </button>
  )
}

export function MapPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchTouched, setSearchTouched] = useState(false) // true after first search attempt
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM)
  const [userPosition, setUserPosition] = useState<{ lat: number; lon: number } | null>(null)
  const [userLocationName, setUserLocationName] = useState<string | null>(null)
  const [manualStartPosition, setManualStartPosition] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const [fromAddressQuery, setFromAddressQuery] = useState('')
  const [fromSuggestions, setFromSuggestions] = useState<GeocodeResult[]>([])
  const [fromSuggestionsOpen, setFromSuggestionsOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [pois, setPois] = useState<PoiResult[]>([])
  const [showPois, setShowPois] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<{
    lat: number
    lon: number
    name: string
  } | null>(null)
  const [routeInfo, setRouteInfo] = useState<RouteResult | null>(null)
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null)
  const [destinationName, setDestinationName] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [liveFollow, setLiveFollow] = useState(false)
  const watchIdRef = useRef<number | null>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fromDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Route start = GPS if available, else manually entered address
  const startPosition = userPosition ?? (manualStartPosition ? { lat: manualStartPosition.lat, lon: manualStartPosition.lon } : null)

  const loadPois = useCallback(async (lat: number, lon: number) => {
    try {
      const results = await mapService.getPois(lat, lon, POI_RADIUS)
      setPois(results)
    } catch {
      setPois([])
    }
  }, [])

  // Debounced search-as-you-type: suggestions based on similarity (Nominatim returns best matches)
  useEffect(() => {
    const q = searchQuery.trim()
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    if (!q) {
      setSearchResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    searchDebounceRef.current = setTimeout(() => {
      mapService
        .geocode(q, 8)
        .then((results) => {
          setSearchResults(results)
          setSearchTouched(true)
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false))
      searchDebounceRef.current = null
    }, SEARCH_DEBOUNCE_MS)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [searchQuery])

  const updatePosition = useCallback(
    async (lat: number, lon: number) => {
      setUserPosition({ lat, lon })
      setMapCenter([lat, lon])
      setMapZoom(14)
      try {
        const rev = await mapService.reverseGeocode(lat, lon)
        setUserLocationName(rev.placeName ?? null)
      } catch {
        setUserLocationName(null)
      }
      loadPois(lat, lon)
    },
    [loadPois]
  )

  const handleCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) return
    setLocating(true)
    setManualStartPosition(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        updatePosition(lat, lon)
        setSelectedDestination(null)
        setRouteInfo(null)
        setRouteGeometry(null)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }, [updatePosition])

  useEffect(() => {
    if (!liveFollow || !navigator.geolocation) return
    setLocating(true)
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setUserPosition({ lat, lon })
        setMapCenter([lat, lon])
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 100 }
    )
    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [liveFollow])

  const handleSelectDestination = useCallback((lat: number, lon: number, name: string) => {
    setSelectedDestination({ lat, lon, name })
    setDestinationName(name)
    setRouteInfo(null)
    setRouteGeometry(null)
  }, [])

  const handleResultClick = useCallback(
    (r: GeocodeResult) => {
      setMapCenter([r.lat, r.lon])
      setMapZoom(14)
      handleSelectDestination(r.lat, r.lon, r.display_name)
      setSearchResults([])
      setSearchQuery(r.display_name)
    },
    [handleSelectDestination]
  )

  const handleMapClick = useCallback(
    async (lat: number, lon: number) => {
      try {
        const rev = await mapService.reverseGeocode(lat, lon)
        handleSelectDestination(lat, lon, rev.placeName ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`)
      } catch {
        handleSelectDestination(lat, lon, `${lat.toFixed(4)}, ${lon.toFixed(4)}`)
      }
      setMapCenter([lat, lon])
      setMapZoom(14)
    },
    [handleSelectDestination]
  )

  // From-address suggestions (debounced)
  useEffect(() => {
    const q = fromAddressQuery.trim()
    if (fromDebounceRef.current) clearTimeout(fromDebounceRef.current)
    if (!q) {
      setFromSuggestions([])
      return
    }
    fromDebounceRef.current = setTimeout(() => {
      mapService.geocode(q, 5).then(setFromSuggestions).catch(() => setFromSuggestions([]))
      fromDebounceRef.current = null
    }, 300)
    return () => {
      if (fromDebounceRef.current) clearTimeout(fromDebounceRef.current)
    }
  }, [fromAddressQuery])

  const setFromAddress = useCallback((r: GeocodeResult) => {
    setManualStartPosition({ lat: r.lat, lon: r.lon, name: r.display_name })
    setFromAddressQuery(r.display_name)
    setFromSuggestions([])
    setFromSuggestionsOpen(false)
    setMapCenter([r.lat, r.lon])
    setMapZoom(14)
    setUserPosition(null)
    setRouteInfo(null)
    setRouteGeometry(null)
  }, [])

  // Fetch route when we have start and destination; blue line updates dynamically when start moves (e.g. live follow)
  useEffect(() => {
    if (!selectedDestination || !startPosition) return
    let cancelled = false
    mapService
      .getRouteWithGeometry(
        startPosition.lat,
        startPosition.lon,
        selectedDestination.lat,
        selectedDestination.lon
      )
      .then((route) => {
        if (!cancelled) {
          setRouteInfo(route ?? null)
          setRouteGeometry(route?.geometry ?? null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRouteInfo(null)
          setRouteGeometry(null)
        }
      })
    return () => {
      cancelled = true
    }
  }, [
    startPosition?.lat,
    startPosition?.lon,
    selectedDestination?.lat,
    selectedDestination?.lon,
  ])

  useEffect(() => {
    if (!mapReady || !showPois) return
    const c = mapCenter
    loadPois(c[0], c[1])
  }, [mapReady, showPois, mapCenter[0], mapCenter[1], loadPois])

  const showSearchDropdown = searchQuery.trim().length > 0
  const recenterTarget: [number, number] = startPosition
    ? [startPosition.lat, startPosition.lon]
    : selectedDestination
      ? [selectedDestination.lat, selectedDestination.lon]
      : mapCenter

  return (
    <div className="min-h-screen bg-slate-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">OpenStreetMap</h1>
          <p className="mt-1 text-sm text-slate-500">English only. High-precision pins and shortest driving path (road network). Search places, set your location, and get distance and time.</p>
        </header>

        {/* Main card: controls + map */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left panel: search & location */}
            <aside className="lg:col-span-4 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="p-4 sm:p-5 space-y-4">
                {/* Search destination */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Destination</label>
                  <div className="flex rounded-lg border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                    <span className="flex items-center pl-3 text-slate-400">
                      <HiSearch className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchResults.length > 0) handleResultClick(searchResults[0])
                      }}
                      placeholder="Place or address..."
                      className="flex-1 min-w-0 py-2.5 px-3 rounded-r-lg text-slate-800 placeholder-slate-400 focus:outline-none text-sm"
                    />
                    {searching && <span className="flex items-center pr-2 text-xs text-slate-400">…</span>}
                  </div>
                  <AnimatePresence>
                    {showSearchDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden z-[100]"
                      >
                        {searchResults.length > 0 ? (
                          <ul className="py-1 max-h-52 overflow-y-auto">
                            {searchResults.map((r) => (
                              <li key={r.place_id}>
                                <button
                                  type="button"
                                  onClick={() => handleResultClick(r)}
                                  className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-emerald-50/80 text-sm"
                                >
                                  <span className="text-base flex-shrink-0">
                                    {r.type === 'city' ? '🏙️' : r.type === 'town' ? '🏘️' : r.type === 'village' ? '🏡' : r.type === 'country' ? '🌍' : '📍'}
                                  </span>
                                  <span className="truncate text-slate-700">{r.display_name}</span>
                                  <HiChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 ml-auto" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : searchTouched && !searching ? (
                          <p className="px-3 py-2.5 text-slate-500 text-xs">No places found. Try different spelling.</p>
                        ) : null}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Start location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Start (your location)</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleCurrentPosition}
                      disabled={locating}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition"
                    >
                      <HiLocationMarker className="w-4 h-4" />
                      {locating ? 'Locating…' : 'Use my location'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLiveFollow((v) => !v)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition ${
                        liveFollow ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <HiRefresh className="w-4 h-4" />
                      {liveFollow ? 'Live on' : 'Live follow'}
                    </button>
                  </div>
                </div>

                {/* From address (optional) */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Or enter start address</label>
                  <input
                    type="text"
                    value={fromAddressQuery}
                    onChange={(e) => {
                      setFromAddressQuery(e.target.value)
                      setFromSuggestionsOpen(true)
                    }}
                    onFocus={() => fromSuggestions.length > 0 && setFromSuggestionsOpen(true)}
                    onBlur={() => setTimeout(() => setFromSuggestionsOpen(false), 150)}
                    placeholder="e.g. 10 Downing St, London"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {manualStartPosition && (
                    <button type="button" onClick={() => { setManualStartPosition(null); setFromAddressQuery('') }} className="mt-1 text-xs text-slate-500 hover:text-slate-700">Clear</button>
                  )}
                  <AnimatePresence>
                    {fromSuggestionsOpen && fromSuggestions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-[100]"
                      >
                        {fromSuggestions.map((r) => (
                          <li key={r.place_id}>
                            <button type="button" onClick={() => setFromAddress(r)} className="w-full text-left px-3 py-2 text-sm hover:bg-emerald-50/80">
                              {r.display_name}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Route summary card */}
                <AnimatePresence>
                  {(startPosition || selectedDestination || routeInfo) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl bg-slate-50 border border-slate-100 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 text-sm">
                          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Route</p>
                          <p className="mt-0.5 text-slate-700 truncate">From: {userPosition ? (userLocationName ?? 'Your location') : manualStartPosition?.name ?? '—'}</p>
                          <p className="text-slate-700 truncate">To: {destinationName ?? selectedDestination?.name ?? '—'}</p>
                          {routeInfo && (
                            <p className="mt-2 text-emerald-600 font-semibold">
                              {routeInfo.distance_text ?? `${(routeInfo.distance_metres / 1000).toFixed(1)} km`} · {routeInfo.duration_text ?? `${Math.round(routeInfo.duration_seconds / 60)} min`}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => { setSelectedDestination(null); setRouteInfo(null); setRouteGeometry(null); setDestinationName(null) }}
                          className="p-1 rounded text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* POI toggle */}
                <button
                  type="button"
                  onClick={() => setShowPois((v) => !v)}
                  className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition"
                >
                  {showPois ? 'Hide nearby places' : 'Show nearby places'}
                </button>
              </div>
            </aside>

            {/* Map card content – fixed height, rounded */}
            <div className="lg:col-span-8 relative">
              <div className="h-[380px] sm:h-[420px] lg:h-[480px] rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl overflow-hidden">
                <MapContainer
                  center={DEFAULT_CENTER}
                  zoom={DEFAULT_ZOOM}
                  className="w-full h-full"
                  style={{ minHeight: 380 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapReady onReady={() => setMapReady(true)} />
                  <MapClickHandler onMapClick={handleMapClick} />
                  {(mapCenter[0] !== DEFAULT_CENTER[0] || mapCenter[1] !== DEFAULT_CENTER[1]) && (
                    <FlyTo center={mapCenter} zoom={mapZoom} />
                  )}

                  {routeGeometry && routeGeometry.length >= 2 && (
                    <Polyline
                      positions={routeGeometry}
                      pathOptions={{ color: '#2563eb', weight: 6, opacity: 0.95 }}
                    />
                  )}

                  {searchResults.map((r) => (
                    <Marker
                      key={r.place_id}
                      position={[r.lat, r.lon]}
                      icon={iconForSearchType(r.type)}
                      eventHandlers={{ click: () => handleResultClick(r) }}
                    >
                      <Popup>
                        <strong>{r.display_name}</strong>
                        <br />
                        <button type="button" className="mt-1 text-emerald-600 underline text-sm" onClick={() => handleResultClick(r)}>
                          Set as destination & show route
                        </button>
                      </Popup>
                    </Marker>
                  ))}

                  {startPosition && (
                    <Marker position={[startPosition.lat, startPosition.lon]} icon={iconUser} zIndexOffset={1000}>
                      <Popup>{userPosition ? 'Your location (GPS)' : manualStartPosition?.name ?? 'Start'}</Popup>
                    </Marker>
                  )}

                  {showPois && pois.map((p) => (
                    <Marker
                      key={`${p.lat}-${p.lon}-${p.name}`}
                      position={[p.lat, p.lon]}
                      icon={iconPoi}
                      eventHandlers={{ click: () => handleSelectDestination(p.lat, p.lon, p.name) }}
                    >
                      <Popup>
                        <strong>{p.name}</strong>
                        <button type="button" className="mt-1 text-emerald-600 underline text-sm block" onClick={() => handleSelectDestination(p.lat, p.lon, p.name)}>
                          Route here
                        </button>
                      </Popup>
                    </Marker>
                  ))}

                  {selectedDestination && (
                    <Marker position={[selectedDestination.lat, selectedDestination.lon]} icon={iconDestination} zIndexOffset={500}>
                      <Popup>{selectedDestination.name}</Popup>
                    </Marker>
                  )}

                  <RecenterButton center={recenterTarget} zoom={mapZoom} />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">© OpenStreetMap contributors</p>
      </div>
    </div>
  )
}
