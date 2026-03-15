import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Rectangle, Popup, useMap } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiShieldCheck,
  HiChartBar,
  HiCalendar,
  HiExclamation,
  HiMap,
  HiTrendingUp,
} from 'react-icons/hi'
import * as crimeApi from '@/services/crime'
import type { CrimeGridCell, CrimeGridResponse } from '@/services/crime'
import 'leaflet/dist/leaflet.css'

const UK_BOUNDS: [[number, number], [number, number]] = [
  [49.8, -8.6],
  [60.9, 1.8],
]
const UK_CENTER: [number, number] = [54.5, -2.5]
const UK_ZOOM = 6
const GRID_SIZE = 0.03
const HALF = GRID_SIZE / 2

function FlyToBounds({ bounds }: { bounds: [[number, number], [number, number]] }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 10 })
  }, [map, bounds])
  return null
}

function getCellColor(count: number, maxCount: number): string {
  if (maxCount <= 0) return 'rgb(34 197 94)'
  const p = count / maxCount
  if (p >= 0.66) return 'rgb(220 38 38)'
  if (p >= 0.33) return 'rgb(234 179 8)'
  return 'rgb(34 197 94)'
}

function formatCategory(cat: string): string {
  return cat
    .split(/[-/]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export function CheckCrimePage() {
  const [months, setMonths] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [data, setData] = useState<CrimeGridResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMonths, setLoadingMonths] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    crimeApi
      .getCrimeMonths()
      .then((list) => {
        setMonths(list)
        if (list.length > 0 && !selectedMonth) setSelectedMonth(list[0])
      })
      .catch(() => setMonths([]))
      .finally(() => setLoadingMonths(false))
  }, [])

  useEffect(() => {
    if (!selectedMonth) return
    setLoading(true)
    setError(null)
    crimeApi
      .getCrimeGrid(selectedMonth)
      .then(setData)
      .catch((e) => {
        setData(null)
        setError(e.message || 'Failed to load crime data')
      })
      .finally(() => setLoading(false))
  }, [selectedMonth])

  const topCategories = data?.byCategory
    ? Object.entries(data.byCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
    : []

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-teal-50/30">
      {/* Hero header – same theme as rest of site */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/50 border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(20,184,166,0.12),transparent)]" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-teal-100 text-teal-800">
                <HiShieldCheck className="w-4 h-4" />
                UK crime overview
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                Check Crime in the UK
              </h1>
              <p className="mt-1.5 text-slate-600 max-w-2xl">
                View reported incidents by month on an interactive map. Data is from our local dataset — historical, not live. Red = higher incidence, yellow = moderate, green = lower.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-w-0">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5 order-2 lg:order-1">
            {/* Month selector card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 overflow-hidden"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <HiCalendar className="w-4 h-4 text-teal-600" />
                  Select month
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">Dataset is grouped by month</p>
              </div>
              <div className="p-5">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={loadingMonths}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition"
                >
                  {months.length === 0 && (
                    <option value="">{loadingMonths ? 'Loading…' : 'No months'}</option>
                  )}
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {error && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2">
                    <HiExclamation className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <p className="text-sm text-rose-700">{error}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <AnimatePresence>
              {data && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-5"
                >
                  {/* KPI cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 p-5"
                    >
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <HiTrendingUp className="w-4 h-4 text-teal-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Total incidents</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                        {data.total.toLocaleString()}
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 }}
                      className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 p-5"
                    >
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <HiMap className="w-4 h-4 text-teal-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Grid cells</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                        {data.grid.length.toLocaleString()}
                      </p>
                    </motion.div>
                  </div>

                  {/* By category */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-b border-slate-100">
                      <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <HiChartBar className="w-4 h-4 text-teal-600" />
                        By category
                      </h2>
                    </div>
                    <div className="p-4 max-h-52 overflow-y-auto">
                      <ul className="space-y-2">
                        {topCategories.map(([cat, count]) => (
                          <li
                            key={cat}
                            className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition"
                          >
                            <span className="text-sm text-slate-700 truncate mr-2">
                              {formatCategory(cat)}
                            </span>
                            <span className="text-sm font-bold text-slate-900 tabular-nums flex-shrink-0">
                              {count.toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Legend */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 p-5"
                  >
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Map legend
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-md bg-red-500 shadow-inner" />
                        <span className="text-sm text-slate-700">Higher reported incidents</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-md bg-amber-400 shadow-inner" />
                        <span className="text-sm text-slate-700">Moderate</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-md bg-emerald-500 shadow-inner" />
                        <span className="text-sm text-slate-700">Lower / no crime</span>
                      </div>
                    </div>
                    <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      Reported data only. Not a live feed or safety guarantee.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* Map */}
          <div className="lg:col-span-8 order-1 lg:order-2 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden min-w-0"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-between">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <HiMap className="w-5 h-5" />
                  {selectedMonth || 'Select month'} · UK map
                </span>
                {loading && (
                  <span className="inline-flex items-center gap-1.5 text-white/90 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Loading…
                  </span>
                )}
              </div>
              <div className="h-[380px] sm:h-[420px] lg:h-[520px] relative min-h-[320px]">
                <MapContainer
                  key="crime-uk-map"
                  center={UK_CENTER}
                  zoom={UK_ZOOM}
                  className="w-full h-full rounded-b-2xl"
                  style={{ minHeight: 320 }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FlyToBounds bounds={UK_BOUNDS} />
                  <Rectangle
                    bounds={UK_BOUNDS}
                    pathOptions={{
                      fillColor: 'rgb(34 197 94)',
                      fillOpacity: 0.12,
                      color: 'transparent',
                      weight: 0,
                    }}
                  />
                  {data?.grid.map((cell: CrimeGridCell, i: number) => {
                    const bounds: [[number, number], [number, number]] = [
                      [cell.lat - HALF, cell.lng - HALF],
                      [cell.lat + HALF, cell.lng + HALF],
                    ]
                    const fill = getCellColor(cell.count, data.maxCount)
                    return (
                      <Rectangle
                        key={`${cell.lat}-${cell.lng}-${i}`}
                        bounds={bounds}
                        pathOptions={{
                          fillColor: fill,
                          fillOpacity: 0.65,
                          color: 'rgba(0,0,0,0.12)',
                          weight: 0.5,
                        }}
                        eventHandlers={{
                          mouseover: (e) => {
                            e.target.setStyle({ fillOpacity: 0.85 })
                            e.target.bringToFront()
                          },
                          mouseout: (e) => {
                            e.target.setStyle({ fillOpacity: 0.65 })
                          },
                        }}
                      >
                        <Popup>
                          <span className="font-semibold">{cell.count}</span> incident
                          {cell.count !== 1 ? 's' : ''} in this area
                        </Popup>
                      </Rectangle>
                    )
                  })}
                </MapContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
