import { useState, useCallback, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiSearch,
  HiLocationMarker,
  HiStar,
  HiExternalLink,
} from 'react-icons/hi'
import { ROUTES } from '@/constants/routes'
import { lookupDestination, searchHotels, getAccommodationStatus } from '@/services/accommodation'
import type { HotelSearchResult } from '@/types/accommodation'

const SUGGESTED = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Doha', 'Edinburgh']
const ROWS = 12

function getDefaultDates() {
  const today = new Date()
  const checkin = new Date(today)
  checkin.setDate(checkin.getDate() + 7)
  const checkout = new Date(checkin)
  checkout.setDate(checkout.getDate() + 2)
  return {
    checkin: checkin.toISOString().slice(0, 10),
    checkout: checkout.toISOString().slice(0, 10),
  }
}

export function FindHotelsPage() {
  const defaultDates = useMemo(getDefaultDates, [])
  const [locationQuery, setLocationQuery] = useState('')
  const [checkin, setCheckin] = useState(defaultDates.checkin)
  const [checkout, setCheckout] = useState(defaultDates.checkout)
  const [adults, setAdults] = useState(2)
  const [rooms, setRooms] = useState(1)
  const [results, setResults] = useState<HotelSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiConfigured, setApiConfigured] = useState(false)

  useEffect(() => {
    getAccommodationStatus()
      .then(({ configured }) => setApiConfigured(configured))
      .catch(() => setApiConfigured(false))
  }, [])

  const handleSearch = useCallback(async () => {
    setError(null)
    if (!locationQuery.trim()) {
      setError('Enter a location (e.g. London, Doha).')
      return
    }
    if (!apiConfigured) {
      setError('Hotel search is not configured. Try the Map or Explore page.')
      return
    }
    setLookupLoading(true)
    let resolvedDestId: number | null = null
    let resolvedDestType = 'CITY'
    try {
      const lookup = await lookupDestination(locationQuery.trim())
      if (!lookup.success || lookup.dest_id == null) {
        setError(lookup.message ?? 'Location not found. Try London, Manchester, Doha.')
        return
      }
      resolvedDestId = lookup.dest_id
      resolvedDestType = lookup.dest_type ?? 'CITY'
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lookup failed')
      setLookupLoading(false)
      return
    } finally {
      setLookupLoading(false)
    }

    if (resolvedDestId == null) return
    setLoading(true)
    try {
      const res = await searchHotels({
        dest_id: resolvedDestId,
        dest_type: resolvedDestType,
        checkin,
        checkout,
        adults,
        rooms,
        rows_per_page: ROWS,
        offset: 0,
        currency: 'GBP',
      })
      const raw = res as unknown as Record<string, unknown>
      const list = Array.isArray(raw?.data)
        ? (raw.data as HotelSearchResult[])
        : Array.isArray((raw?.data as Record<string, unknown>)?.hotels)
          ? ((raw.data as Record<string, unknown>).hotels as HotelSearchResult[])
          : Array.isArray(raw?.results)
            ? (raw.results as HotelSearchResult[])
            : Array.isArray(raw?.hotels)
              ? (raw.hotels as HotelSearchResult[])
              : []
      setResults(Array.isArray(list) ? list.filter((h) => h && typeof h === 'object') : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [locationQuery, checkin, checkout, adults, rooms, apiConfigured])

  const filteredResults = useMemo(
    () => results.filter((r) => r != null && typeof r === 'object'),
    [results]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Best hotels in UK & Qatar
              </h1>
              <p className="mt-2 text-teal-100 text-sm sm:text-base max-w-xl">
                Hotel recommendations in UK & Qatar. Search by city and compare prices.
              </p>
            </div>
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2 text-teal-100 hover:text-white text-sm font-medium transition"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. London, Doha, Edinburgh"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check-in</label>
              <input
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check-out</label>
              <input
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Guests / Rooms</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value) || 1)}
                  className="w-20 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
                />
                <span className="self-center text-slate-400">/</span>
                <input
                  type="number"
                  min={1}
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value) || 1)}
                  className="w-20 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading || lookupLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg hover:opacity-95 disabled:opacity-60 transition"
              style={{ backgroundColor: '#14b8a6' }}
            >
              <HiSearch className="w-5 h-5" />
              {loading || lookupLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setLocationQuery(city)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition"
              >
                {city}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-red-600"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results list */}
        <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <HiLocationMarker className="w-6 h-6 text-teal-600" />
              {loading && results.length === 0
                ? 'Searching…'
                : `${filteredResults.length} hotel${filteredResults.length !== 1 ? 's' : ''} found`}
            </h2>
            {loading && results.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-32 h-24 rounded-lg bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-3/4" />
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-600">
                <p>Search a city (e.g. London, Doha) to see hotel recommendations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.slice(0, 10).map((hotel, i) => {
                  const h = hotel as unknown as Record<string, unknown>
                  const name = hotel?.hotel_name ?? (h?.hotel_name as string) ?? (h?.name as string) ?? 'Hotel'
                  const url = (hotel?.url ?? h?.url ?? '#') as string
                  const imageUrl = (hotel?.image_url ?? h?.image_url ?? 'https://via.placeholder.com/400x300?text=No+image') as string
                  const stars = typeof hotel?.star_rating === 'number' ? hotel.star_rating : Number(h?.star_rating) || 0
                  const score = Number(hotel?.review_score ?? h?.review_score) || 0
                  const count = Number(hotel?.review_count ?? h?.review_count) || 0
                  const rawPrice = hotel?.min_total_price ?? h?.min_total_price ?? h?.price
                  const price = typeof rawPrice === 'number' && rawPrice > 0 ? rawPrice : 0
                  const currency = String(hotel?.currency_code ?? h?.currency_code ?? 'GBP')
                  const address = String(hotel?.address ?? h?.address ?? '')
                  return (
                    <motion.a
                      key={hotel?.hotel_id ?? i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group"
                    >
                      <div className="w-28 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-900 group-hover:text-teal-700 line-clamp-2">{name}</h3>
                          <span className="text-lg font-bold text-slate-900 flex-shrink-0">
                            {price > 0 ? (currency === 'GBP' ? `£${price.toFixed(0)}` : `${currency} ${price.toFixed(0)}`) : '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                          <span className="flex items-center gap-0.5">
                            <HiStar className="w-4 h-4 text-amber-500" />
                            {stars}
                          </span>
                          <span>·</span>
                          <span>{score} ({count} reviews)</span>
                        </div>
                        {address && <p className="mt-1 text-xs text-slate-500 line-clamp-2">{address}</p>}
                        <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-teal-600 group-hover:text-teal-700">
                          View on Booking.com <HiExternalLink className="w-4 h-4" />
                        </span>
                      </div>
                    </motion.a>
                  )
                })}
                {filteredResults.length > 10 && (
                  <p className="text-sm text-slate-500 text-center py-2">
                    Showing 10 of {filteredResults.length}. Refine search for more.
                  </p>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
