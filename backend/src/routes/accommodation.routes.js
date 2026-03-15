import { Router } from 'express'
import { lookupDestination, searchHotels, isStayApiConfigured } from '../services/stayApi.service.js'
import { reverseGeocode } from '../services/geocode.service.js'
import { normalizeSearchResponse } from '../utils/normalizeHotel.js'

const router = Router()

/**
 * GET /api/accommodation/destinations/lookup?query=London
 * Resolve location name to destination ID for use in search.
 */
router.get('/destinations/lookup', async (req, res) => {
  try {
    const query = req.query.query
    if (query == null || String(query).trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "query" is required (e.g. ?query=London)',
      })
    }
    const data = await lookupDestination(String(query))
    return res.json(data)
  } catch (err) {
    const message = err.message || 'Destination lookup failed'
    const status = message.includes('not set') ? 503 : 500
    return res.status(status).json({ success: false, message })
  }
})

/**
 * GET /api/accommodation/search
 * Query params: dest_id, dest_type?, checkin, checkout, adults?, rooms?, children?, rows_per_page?, offset?, currency?
 * Returns list of hotels with availability and prices.
 */
router.get('/search', async (req, res) => {
  try {
    const {
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
    } = req.query

    if (dest_id == null || checkin == null || checkout == null) {
      return res.status(400).json({
        success: false,
        message: 'Query parameters "dest_id", "checkin" and "checkout" are required',
      })
    }

    const params = {
      dest_id: Number(dest_id) || String(dest_id),
      dest_type: dest_type ? String(dest_type) : undefined,
      checkin: String(checkin),
      checkout: String(checkout),
      adults: adults != null ? Number(adults) : undefined,
      rooms: rooms != null ? Number(rooms) : undefined,
      children: children != null ? Number(children) : undefined,
      rows_per_page: rows_per_page != null ? Number(rows_per_page) : undefined,
      offset: offset != null ? Number(offset) : undefined,
      currency: currency ? String(currency) : undefined,
    }

    const data = await searchHotels(params)
    const normalized = normalizeSearchResponse(data)
    return res.json(normalized)
  } catch (err) {
    const message = err.message || 'Hotel search failed'
    const status = message.includes('not set') ? 503 : 500
    return res.status(status).json({ success: false, message })
  }
})

/**
 * GET /api/accommodation/search-by-coordinates
 * Search hotels by latitude & longitude (reverse-geocodes to place, then lookup + search).
 * Query params: latitude, longitude, checkin, checkout, adults?, rooms?, rows_per_page?, offset?, currency?
 * Response: same as /search — list of hotels with image_url and min_total_price per hotel.
 */
router.get('/search-by-coordinates', async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      checkin,
      checkout,
      adults,
      rooms,
      rows_per_page,
      offset,
      currency,
    } = req.query

    if (latitude == null || longitude == null || checkin == null || checkout == null) {
      return res.status(400).json({
        success: false,
        message: 'Query parameters "latitude", "longitude", "checkin" and "checkout" are required',
      })
    }

    const { placeName } = await reverseGeocode(Number(latitude), Number(longitude))
    const lookup = await lookupDestination(placeName)
    if (!lookup.success || lookup.dest_id == null) {
      return res.status(404).json({
        success: false,
        message: `Could not resolve location for coordinates (${latitude}, ${longitude}). Try nearby city name.`,
      })
    }

    const params = {
      dest_id: lookup.dest_id,
      dest_type: lookup.dest_type || 'CITY',
      checkin: String(checkin),
      checkout: String(checkout),
      adults: adults != null ? Number(adults) : undefined,
      rooms: rooms != null ? Number(rooms) : undefined,
      rows_per_page: rows_per_page != null ? Number(rows_per_page) : undefined,
      offset: offset != null ? Number(offset) : undefined,
      currency: currency ? String(currency) : undefined,
    }

    const data = await searchHotels(params)
    const normalized = normalizeSearchResponse(data)
    return res.json({
      ...normalized,
      geocode_used: { placeName, dest_id: lookup.dest_id, dest_type: lookup.dest_type },
    })
  } catch (err) {
    const message = err.message || 'Search by coordinates failed'
    const status = message.includes('not set') ? 503 : 500
    return res.status(status).json({ success: false, message })
  }
})

/**
 * GET /api/accommodation/status
 * Check if accommodation API is configured (no key exposed).
 */
router.get('/status', (req, res) => {
  return res.json({ configured: isStayApiConfigured() })
})

export default router
