import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Rectangle, Popup, useMap } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { HiShieldCheck, HiChartBar, HiCalendar, HiExclamation } from 'react-icons/hi'
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
  if (maxCount <= 0) return 'rgb(34 197 94)' // green
  const p = count / maxCount
  if (p >= 0.66) return 'rgb(220 38 38)' // red – high
  if (p >= 0.33) return 'rgb(234 179 8)' // yellow – moderate
  return 'rgb(34 197 94)' // green – low
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <HiShieldCheck className="w-8 h-8 text-rose-600" />
            Check Crime in UK
          </h1>
          <p className="mt-1 text-slate-600">
            Entire UK map from local dataset. Red = high crime, yellow = moderate, green = low or no crime.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <HiCalendar className="w-4 h-4" />
                  Month (dataset)
                </h2>
              </div>
              <div className="p-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={loadingMonths}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
                  <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                    <HiExclamation className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
            </div>

            <AnimatePresence>
              {data && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <HiChartBar className="w-4 h-4" />
                    KPIs
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4">
                      <p className="text-xs font-medium text-slate-500 uppercase">Total incidents</p>
                      <p className="mt-1 text-2xl font-bold text-slate-800">{data.total.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4">
                      <p className="text-xs font-medium text-slate-500 uppercase">Grid cells</p>
                      <p className="mt-1 text-2xl font-bold text-slate-800">{data.grid.length.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase mb-2">By category</p>
                    <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                      {topCategories.map(([cat, count]) => (
                        <li key={cat} className="flex justify-between text-sm">
                          <span className="text-slate-700 truncate mr-2">{formatCategory(cat)}</span>
                          <span className="font-semibold text-slate-900 flex-shrink-0">{count.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
                    <p className="font-medium text-slate-700">Legend</p>
                    <p><span className="inline-block w-3 h-3 rounded bg-red-500 mr-1" /> Red = high crime</p>
                    <p><span className="inline-block w-3 h-3 rounded bg-yellow-500 mr-1" /> Yellow = moderate</p>
                    <p><span className="inline-block w-3 h-3 rounded bg-green-500 mr-1" /> Green = low / no crime</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <HiCalendar className="w-4 h-4" />
                  {selectedMonth || 'Select month'} · UK map
                </span>
                {loading && <span className="text-xs text-slate-400">Loading…</span>}
              </div>
              <div className="h-[500px] relative">
                <MapContainer
                  center={UK_CENTER}
                  zoom={UK_ZOOM}
                  className="w-full h-full"
                  style={{ minHeight: 500 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FlyToBounds bounds={UK_BOUNDS} />
                  {/* Green base: UK area (no crime / low emphasis) */}
                  <Rectangle
                    bounds={UK_BOUNDS}
                    pathOptions={{
                      fillColor: 'rgb(34 197 94)',
                      fillOpacity: 0.12,
                      color: 'transparent',
                      weight: 0,
                    }}
                  />
                  {/* Crime grid cells: red / yellow / green by count */}
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
                          color: 'rgba(0,0,0,0.15)',
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
                          <span className="font-semibold">{cell.count}</span> incident{cell.count !== 1 ? 's' : ''} in this area
                        </Popup>
                      </Rectangle>
                    )
                  })}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
