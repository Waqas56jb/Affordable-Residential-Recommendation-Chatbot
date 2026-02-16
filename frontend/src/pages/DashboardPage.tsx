import { useState, useCallback, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiSearch,
  HiLocationMarker,
  HiCalendar,
  HiUser,
  HiStar,
  HiExternalLink,
  HiFilter,
  HiX,
} from 'react-icons/hi'
import { ROUTES } from '@/routes'
import {
  lookupDestination,
  searchHotels,
  getAccommodationStatus,
} from '@/services/accommodation'
import type { HotelSearchResult } from '@/types/accommodation'

const ROWS_PER_PAGE = 20
const SUGGESTED_CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Doha', 'Edinburgh']

function getDefaultDates() {
  try {
    const today = new Date()
    const checkin = new Date(today)
    checkin.setDate(checkin.getDate() + 7)
    const checkout = new Date(checkin)
    checkout.setDate(checkout.getDate() + 2)
    const checkinStr = checkin.toISOString?.()?.slice(0, 10)
    const checkoutStr = checkout.toISOString?.()?.slice(0, 10)
    return {
      checkin: checkinStr ?? new Date().toISOString().slice(0, 10),
      checkout: checkoutStr ?? new Date().toISOString().slice(0, 10),
    }
  } catch {
    const d = new Date().toISOString().slice(0, 10)
    return { checkin: d, checkout: d }
  }
}

export function DashboardPage() {
  const defaultDates = useMemo(getDefaultDates, [])
  const [locationQuery, setLocationQuery] = useState('')
  const [destId, setDestId] = useState<number | null>(null)
  const [destType, setDestType] = useState('CITY')
  const [destLabel, setDestLabel] = useState('')
  const [checkin, setCheckin] = useState(defaultDates.checkin)
  const [checkout, setCheckout] = useState(defaultDates.checkout)
  const [adults, setAdults] = useState(2)
  const [rooms, setRooms] = useState(1)
  const [results, setResults] = useState<HotelSearchResult[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [minStars, setMinStars] = useState<number | ''>('')
  const [minReview, setMinReview] = useState<number | ''>('')
  const [apiConfigured, setApiConfigured] = useState(false)
  const [statusLoading, setStatusLoading] = useState(true)
  const [searchAttempted, setSearchAttempted] = useState(false)

  useEffect(() => {
    getAccommodationStatus()
      .then(({ configured }) => setApiConfigured(configured))
      .catch(() => setApiConfigured(false))
      .finally(() => setStatusLoading(false))
  }, [])

  const loadPage = useCallback(async (pageOffset: number) => {
    if (destId == null || !apiConfigured) return
    setLoading(true)
    setError(null)
    try {
      const res = await searchHotels({
        dest_id: destId,
        dest_type: destType,
        checkin,
        checkout,
        adults,
        rooms,
        rows_per_page: ROWS_PER_PAGE,
        offset: pageOffset,
        currency: 'GBP',
      })
      const raw = res as unknown as Record<string, unknown>
      const d = raw?.data as unknown
      const list = Array.isArray(raw?.data)
        ? (raw.data as HotelSearchResult[])
        : Array.isArray((d as Record<string, unknown>)?.hotels)
          ? ((d as Record<string, unknown>).hotels as HotelSearchResult[])
          : Array.isArray(raw?.results)
            ? (raw.results as HotelSearchResult[])
            : Array.isArray(raw?.hotels)
              ? (raw.hotels as HotelSearchResult[])
              : []
      const safeList = Array.isArray(list) ? list.filter((h) => h && typeof h === 'object') : []
      const total = (res?.pagination as { total_count_with_filters?: number })?.total_count_with_filters ?? safeList.length
      setResults(safeList)
      setTotalCount(total)
      setOffset(pageOffset)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load page')
    } finally {
      setLoading(false)
    }
  }, [destId, destType, checkin, checkout, adults, rooms, apiConfigured])

  const handleSearch = async () => {
    setSearchAttempted(true)
    setError(null)
    let resolvedDestId = destId
    let resolvedDestType = destType
    if (resolvedDestId == null && locationQuery.trim() && apiConfigured) {
      setLookupLoading(true)
      try {
        const res = await lookupDestination(locationQuery.trim())
        if (res.success && res.dest_id != null) {
          resolvedDestId = res.dest_id
          resolvedDestType = res.dest_type ?? 'CITY'
          setDestId(resolvedDestId)
          setDestType(resolvedDestType)
          setDestLabel(res.normalized_query ?? locationQuery)
        } else {
          setError(res.message ?? 'Location not found. Try another city (e.g. London, Doha).')
          setLookupLoading(false)
          return
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to lookup location')
        setLookupLoading(false)
        return
      } finally {
        setLookupLoading(false)
      }
    }
    if (resolvedDestId == null || !apiConfigured) {
      setError('Enter a location (e.g. London, Manchester, Doha) and click Search.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await searchHotels({
        dest_id: resolvedDestId,
        dest_type: resolvedDestType,
        checkin,
        checkout,
        adults,
        rooms,
        rows_per_page: ROWS_PER_PAGE,
        offset: 0,
        currency: 'GBP',
      })
      // StayAPI / backend may return list as res.data, res.data.hotels, res.results, or res.hotels
      const raw = res as unknown as Record<string, unknown>
      const d = raw?.data as unknown
      const list = Array.isArray(raw?.data)
        ? (raw.data as HotelSearchResult[])
        : Array.isArray((d as Record<string, unknown>)?.hotels)
          ? ((d as Record<string, unknown>).hotels as HotelSearchResult[])
          : Array.isArray((d as Record<string, unknown>)?.search_results)
            ? ((d as Record<string, unknown>).search_results as HotelSearchResult[])
            : Array.isArray(raw?.results)
              ? (raw.results as HotelSearchResult[])
              : Array.isArray(raw?.hotels)
                ? (raw.hotels as HotelSearchResult[])
                : []
      const safeList = Array.isArray(list) ? list.filter((h) => h && typeof h === 'object') : []
      const total = (res?.pagination as { total_count_with_filters?: number } | undefined)?.total_count_with_filters ?? (res as { total_count?: number }).total_count ?? safeList.length
      setResults(safeList)
      setTotalCount(total)
      setOffset(0)
      // Only show as error if we have no list and the message is not a success line (e.g. "Found X hotels")
      const msg = (res as { message?: string }).message
      if (safeList.length === 0 && msg && !/found\s+\d+\s+hotel/i.test(msg)) {
        setError(msg)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const filteredResults = useMemo(() => {
    let list = Array.isArray(results) ? results.filter((r) => r != null && typeof r === 'object') : []
    const num = (v: unknown) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0)
    if (minPrice !== '') list = list.filter((r) => num(r?.min_total_price) >= minPrice)
    if (maxPrice !== '') list = list.filter((r) => num(r?.min_total_price) <= maxPrice)
    if (minStars !== '') list = list.filter((r) => num(r?.star_rating) >= minStars)
    if (minReview !== '') list = list.filter((r) => num(r?.review_score) >= minReview)
    return list
  }, [results, minPrice, maxPrice, minStars, minReview])

  const totalPages = Math.max(1, Math.ceil(Number(totalCount) / ROWS_PER_PAGE) || 1)
  const currentPage = Math.max(1, Math.floor(Number(offset) / ROWS_PER_PAGE) + 1)
  const hasSearched = searchAttempted

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/80 to-white">
      {/* Hero */}
      <div className="bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Find the best place to stay
              </h1>
              <p className="mt-2 text-primary-200 text-sm sm:text-base max-w-xl">
                Search student-friendly accommodation in the UK & Qatar. Real-time availability and prices.
              </p>
            </div>
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2 text-primary-200 hover:text-white text-sm font-medium transition"
            >
              ← Back to home
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative -mt-6 sm:-mt-8 rounded-2xl shadow-xl border border-primary-100 bg-white p-4 sm:p-6"
        >
          {!statusLoading && !apiConfigured && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <strong>Live search is disabled.</strong> Start the backend server (<code className="bg-amber-100 px-1 rounded">cd backend && node server.js</code>) and set <code className="bg-amber-100 px-1 rounded">STAYAPI_API_KEY</code> in <code className="bg-amber-100 px-1 rounded">backend/.env</code>. Get a key at{' '}
              <a href="https://stayapi.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                stayapi.com
              </a>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="block text-xs font-semibold text-primary-800 mb-1.5">Location</label>
                <div className="relative">
                  <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. London, Manchester, Doha"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                  />
                  {destLabel && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded pointer-events-none">
                      {destLabel}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary-800 mb-1.5">Check-in</label>
                <div className="relative">
                  <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none" />
                  <input
                    type="date"
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary-800 mb-1.5">Check-out</label>
                <div className="relative">
                  <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none" />
                  <input
                    type="date"
                    value={checkout}
                    onChange={(e) => setCheckout(e.target.value)}
                    min={checkin}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary-800 mb-1.5">Guests / Rooms</label>
                <div className="flex rounded-xl border border-primary-200 overflow-hidden">
                  <div className="flex items-center pl-3 pr-2 py-2 border-r border-primary-200 bg-primary-50/50">
                    <HiUser className="w-5 h-5 text-primary-500" />
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value) || 1)}
                    className="w-14 px-2 py-3 text-center border-0 focus:ring-0 bg-transparent"
                  />
                  <span className="self-center text-primary-600 text-sm">/</span>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value) || 1)}
                    className="w-12 px-2 py-3 text-center border-0 focus:ring-0 bg-transparent"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
                <button
                  type="submit"
                  disabled={!apiConfigured || statusLoading || lookupLoading || loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition min-h-[48px]"
                  style={{ backgroundColor: '#14b8a6' }}
                >
                  {lookupLoading || loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <HiSearch className="w-5 h-5 shrink-0" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Suggested cities */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-primary-600 self-center">Try:</span>
            {SUGGESTED_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setLocationQuery(city)
                  setDestId(null)
                  setDestLabel('')
                  if (!apiConfigured) return
                  setLookupLoading(true)
                  lookupDestination(city)
                    .then((r) => {
                      if (r.success && r.dest_id != null) {
                        setDestId(r.dest_id)
                        setDestType(r.dest_type ?? 'CITY')
                        setDestLabel(r.normalized_query ?? city)
                      }
                    })
                    .catch(() => setError('Could not resolve location'))
                    .finally(() => setLookupLoading(false))
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition"
              >
                {city}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between"
            >
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded">
                <HiX className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary-200 bg-white text-primary-800 font-medium hover:bg-primary-50 transition"
            >
              <HiFilter className="w-5 h-5" />
              Filters
            </button>
            {showFilters && (
              <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white border border-primary-100">
                <input
                  type="number"
                  placeholder="Min £"
                  value={minPrice === '' ? '' : minPrice}
                  onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-lg border border-primary-200 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max £"
                  value={maxPrice === '' ? '' : maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-lg border border-primary-200 text-sm"
                />
                <select
                  value={minStars === '' ? '' : minStars}
                  onChange={(e) => setMinStars(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-3 py-2 rounded-lg border border-primary-200 text-sm"
                >
                  <option value="">Any stars</option>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>{s}+ stars</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Min rating"
                  min={0}
                  max={10}
                  step={0.5}
                  value={minReview === '' ? '' : minReview}
                  onChange={(e) => setMinReview(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-28 px-3 py-2 rounded-lg border border-primary-200 text-sm"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-900">
                {loading && results.length === 0
                  ? 'Searching…'
                  : `${filteredResults.length} place${filteredResults.length !== 1 ? 's' : ''} to stay`}
              </h2>
              {totalCount > ROWS_PER_PAGE && (
                <span className="text-sm text-primary-600">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {loading && results.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-2xl border border-primary-100 bg-white overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-primary-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-5 bg-primary-100 rounded w-3/4" />
                      <div className="h-4 bg-primary-100 rounded w-1/2" />
                      <div className="h-6 bg-primary-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-white border border-primary-100">
                <p className="text-primary-700">No accommodation matches your search. Try another location or dates.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((hotel, i) => {
                    const h = hotel as unknown as Record<string, unknown>
                    const id = hotel?.hotel_id ?? hotel?.url ?? i
                    const name = hotel?.hotel_name ?? h?.name ?? 'Hotel'
                    const url = (hotel?.url ?? h?.url ?? '#') as string
                    const imageUrl = (hotel?.image_url ?? h?.image_url ?? 'https://via.placeholder.com/400x300?text=No+image') as string
                    const starRating = typeof hotel?.star_rating === 'number' ? hotel.star_rating : Number(h?.star_rating) || 0
                    const rawReview = (h as Record<string, unknown>)?.review ?? h
                    const rawScore = hotel?.review_score ?? h?.review_score ?? (h as Record<string, unknown>)?.reviewScore ?? (typeof rawReview === 'object' && rawReview != null && 'score' in rawReview ? (rawReview as { score?: number }).score : null)
                    const rawCount = hotel?.review_count ?? h?.review_count ?? (h as Record<string, unknown>)?.reviewCount ?? (typeof rawReview === 'object' && rawReview != null && 'review_count' in rawReview ? (rawReview as { review_count?: number }).review_count : null)
                    const rawWord = hotel?.review_score_word ?? h?.review_score_word ?? (h as Record<string, unknown>)?.reviewScoreWord ?? (typeof rawReview === 'object' && rawReview != null && 'display' in rawReview ? (rawReview as { display?: string }).display : null)
                    const reviewScore =
                      typeof rawScore === 'object' && rawScore != null && 'score' in rawScore
                        ? Number((rawScore as { score?: number }).score) || 0
                        : Number(rawScore) || 0
                    const reviewCount =
                      typeof rawScore === 'object' && rawScore != null && 'review_count' in rawScore
                        ? Number((rawScore as { review_count?: number }).review_count) || 0
                        : typeof rawCount === 'number' && Number.isFinite(rawCount)
                          ? rawCount
                          : Number(rawCount) || 0
                    const reviewWord =
                      typeof rawScore === 'object' && rawScore != null && 'display' in rawScore
                        ? String((rawScore as { display?: string }).display ?? '')
                        : String(rawWord ?? '')
                    const rawPrice =
                      hotel?.min_total_price ??
                      h?.min_total_price ??
                      (h as Record<string, unknown>)?.minTotalPrice ??
                      h?.price ??
                      (typeof (h?.price as Record<string, unknown>) === 'object' && (h?.price as Record<string, unknown>) != null
                        ? ((h.price as Record<string, unknown>).amount ?? (h.price as Record<string, unknown>).value)
                        : null) ??
                      h?.total_price ??
                      (h as Record<string, unknown>)?.totalPrice ??
                      h?.min_price ??
                      (h as Record<string, unknown>)?.minPrice ??
                      h?.from_price ??
                      (h as Record<string, unknown>)?.fromPrice
                    const priceNum = typeof rawPrice === 'number' && Number.isFinite(rawPrice) ? rawPrice : Number(rawPrice)
                    const price = Number.isFinite(priceNum) && priceNum > 0 ? priceNum : 0
                    const currency = String(hotel?.currency_code ?? h?.currency_code ?? (h?.price as Record<string, unknown>)?.currency ?? 'GBP')
                    const freeCancel = hotel?.is_free_cancellable === 1
                    const address = String(hotel?.address ?? h?.address ?? '')
                    return (
                      <motion.a
                        key={id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        className="group block rounded-2xl border border-primary-100 bg-white overflow-hidden shadow-md hover:shadow-xl hover:border-primary-200 transition-all duration-300"
                      >
                        <div className="aspect-[4/3] bg-primary-100 relative overflow-hidden">
                          <img
                            src={imageUrl}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">
                            <HiStar className="w-4 h-4 text-amber-400" />
                            {starRating}
                          </div>
                          {freeCancel && (
                            <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-primary-600 text-white text-xs font-medium">
                              Free cancellation
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-primary-900 group-hover:text-primary-700 line-clamp-2">
                            {String(name)}
                          </h3>
                          <div className="mt-2 flex items-center gap-2 text-sm text-primary-600">
                            <span className="font-semibold text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">
                              {Number.isFinite(reviewScore) ? reviewScore : '—'} {reviewWord}
                            </span>
                            <span>({Number.isFinite(reviewCount) ? reviewCount : 0} reviews)</span>
                          </div>
                          {address && (
                            <p className="mt-1 text-xs text-primary-600 line-clamp-2">{address}</p>
                          )}
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xl font-bold text-primary-800">
                              {price > 0
                                ? `${currency === 'GBP' ? '£' : currency + ' '}${price.toFixed(0)}`
                                : 'Price on request'}
                            </span>
                            {price > 0 && <span className="text-xs text-primary-600">total</span>}
                          </div>
                          <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary-600 group-hover:text-primary-700">
                            View on Booking.com <HiExternalLink className="w-4 h-4" />
                          </span>
                        </div>
                      </motion.a>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalCount > ROWS_PER_PAGE && !loading && (
                  <div className="mt-10 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadPage(Math.max(0, offset - ROWS_PER_PAGE))}
                      disabled={offset === 0}
                      className="px-4 py-2 rounded-xl border border-primary-200 bg-white font-medium text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPage(offset + ROWS_PER_PAGE)}
                      disabled={offset + ROWS_PER_PAGE >= totalCount}
                      className="px-4 py-2 rounded-xl border border-primary-200 bg-white font-medium text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Empty state before search */}
        {!hasSearched && apiConfigured && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center py-16 px-4 rounded-2xl bg-white border border-primary-100"
          >
            <HiSearch className="w-16 h-16 mx-auto text-primary-300 mb-4" />
            <h2 className="text-xl font-bold text-primary-800">Search for accommodation</h2>
            <p className="text-primary-600 mt-2 max-w-md mx-auto">
              Enter a city like London, Manchester, or Doha, pick your dates, and hit Search to see real availability and prices.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
