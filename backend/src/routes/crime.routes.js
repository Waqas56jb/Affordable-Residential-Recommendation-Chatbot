/**
 * Crime API: serves UK crime from local dataset (backend/2025-12 etc.).
 * No external API. Used for Check Crime map (red/yellow/green grid).
 */

import { Router } from 'express'
import { listMonths, getCrimeGridAndStats } from '../services/crime.service.js'

const router = Router()

/**
 * GET /api/crime/months
 * Returns available month folders (e.g. ["2025-12", "2025-11"]).
 */
router.get('/months', (req, res) => {
  try {
    const months = listMonths()
    return res.json(months)
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to list months' })
  }
})

/**
 * GET /api/crime/grid?month=2025-12
 * Returns grid aggregation for the UK map: cells with lat, lng, count; total; byCategory; maxCount.
 * Loads from local files or from GitHub raw URLs when deployed.
 */
router.get('/grid', async (req, res) => {
  try {
    const month = req.query.month
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'Query param month=YYYY-MM is required' })
    }
    const data = await getCrimeGridAndStats(month)
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to load crime grid' })
  }
})

export default router
