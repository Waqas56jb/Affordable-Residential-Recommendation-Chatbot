/**
 * Map API: geocoding, POIs, routing. All real-time from OSM/Nominatim/Overpass/OSRM.
 */

import { Router } from 'express'
import { forwardGeocode, reverseGeocodeMap, getPois, getRoute, getRouteWithGeometry, haversineDistance } from '../services/map.service.js'

const router = Router()

/**
 * GET /api/map/geocode?q=London&limit=10
 * Forward geocode: search any place in the world.
 */
router.get('/geocode', async (req, res) => {
  try {
    const q = req.query.q
    const limit = req.query.limit != null ? Math.min(Number(req.query.limit) || 10, 40) : 10
    const countrycodes = req.query.countrycodes || undefined
    if (!q || String(q).trim() === '') {
      return res.status(400).json({ success: false, message: 'Query parameter "q" is required' })
    }
    const results = await forwardGeocode(String(q).trim(), { limit, countrycodes })
    return res.json({ success: true, results })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Geocode failed' })
  }
})

/**
 * GET /api/map/reverse?lat=51.5&lon=-0.1
 * Reverse geocode: get place name from coordinates.
 */
router.get('/reverse', async (req, res) => {
  try {
    const lat = Number(req.query.lat)
    const lon = Number(req.query.lon)
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ success: false, message: 'Parameters "lat" and "lon" are required' })
    }
    const result = await reverseGeocodeMap(lat, lon)
    return res.json({ success: true, ...result })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Reverse geocode failed' })
  }
})

/**
 * GET /api/map/pois?lat=51.5&lon=-0.1&radius=2000&types=supermarket,pharmacy,cafe
 * Get POIs (supermarkets, amenities) around a point. Real-time from Overpass.
 */
router.get('/pois', async (req, res) => {
  try {
    const lat = Number(req.query.lat)
    const lon = Number(req.query.lon)
    const radius = req.query.radius != null ? Number(req.query.radius) : 2000
    const types = req.query.types || undefined
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ success: false, message: 'Parameters "lat" and "lon" are required' })
    }
    const results = await getPois(lat, lon, radius, types)
    return res.json({ success: true, results })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'POIs fetch failed' })
  }
})

/**
 * GET /api/map/route?fromLat=&fromLon=&toLat=&toLon=
 * Get driving distance and duration between two points (OSRM).
 */
router.get('/route', async (req, res) => {
  try {
    const fromLat = Number(req.query.fromLat)
    const fromLon = Number(req.query.fromLon)
    const toLat = Number(req.query.toLat)
    const toLon = Number(req.query.toLon)
    if ([fromLat, fromLon, toLat, toLon].some(Number.isNaN)) {
      return res.status(400).json({
        success: false,
        message: 'Parameters "fromLat", "fromLon", "toLat", "toLon" are required',
      })
    }
    const route = await getRoute({ fromLat, fromLon, toLat, toLon })
    if (!route) {
      return res.json({ success: false, message: 'Route not found', distance_metres: null, duration_seconds: null })
    }
    const from = { lat: fromLat, lon: fromLon }
    const to = { lat: toLat, lon: toLon }
    const straightLine = haversineDistance(from, to)
    return res.json({
      success: true,
      ...route,
      straight_line_metres: Math.round(straightLine),
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Route failed' })
  }
})

/**
 * GET /api/map/route/geometry?fromLat=&fromLon=&toLat=&toLon=
 * Route with street path geometry (for drawing on map).
 */
router.get('/route/geometry', async (req, res) => {
  try {
    const fromLat = Number(req.query.fromLat)
    const fromLon = Number(req.query.fromLon)
    const toLat = Number(req.query.toLat)
    const toLon = Number(req.query.toLon)
    if ([fromLat, fromLon, toLat, toLon].some(Number.isNaN)) {
      return res.status(400).json({
        success: false,
        message: 'Parameters "fromLat", "fromLon", "toLat", "toLon" are required',
      })
    }
    const route = await getRouteWithGeometry({ fromLat, fromLon, toLat, toLon })
    if (!route) {
      return res.json({ success: false, message: 'Route not found', geometry: null })
    }
    return res.json({ success: true, ...route })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Route failed' })
  }
})

/**
 * GET /api/map/distance?fromLat=&fromLon=&toLat=&toLon=
 * Straight-line distance only (Haversine).
 */
router.get('/distance', async (req, res) => {
  try {
    const fromLat = Number(req.query.fromLat)
    const fromLon = Number(req.query.fromLon)
    const toLat = Number(req.query.toLat)
    const toLon = Number(req.query.toLon)
    if ([fromLat, fromLon, toLat, toLon].some(Number.isNaN)) {
      return res.status(400).json({
        success: false,
        message: 'Parameters "fromLat", "fromLon", "toLat", "toLon" are required',
      })
    }
    const metres = haversineDistance(
      { lat: fromLat, lon: fromLon },
      { lat: toLat, lon: toLon }
    )
    return res.json({
      success: true,
      distance_metres: Math.round(metres),
      distance_text: metres >= 1000 ? `${(metres / 1000).toFixed(1)} km` : `${Math.round(metres)} m`,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Distance failed' })
  }
})

export default router
