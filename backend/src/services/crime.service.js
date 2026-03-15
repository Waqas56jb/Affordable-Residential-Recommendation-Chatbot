/**
 * UK Crime dataset: read from backend/2025-12 (and other month folders).
 * Walks *-street.csv files, aggregates by grid cell for map (red/yellow/green)
 * and returns stats (total, by category). No external API.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BACKEND_ROOT = path.resolve(__dirname, '../..')
const GRID_SIZE = 0.03
const UK_BOUNDS = { latMin: 49.8, latMax: 60.9, lngMin: -8.6, lngMax: 1.8 }

function inUK(lat, lng) {
  return (
    lat >= UK_BOUNDS.latMin &&
    lat <= UK_BOUNDS.latMax &&
    lng >= UK_BOUNDS.lngMin &&
    lng <= UK_BOUNDS.lngMax
  )
}

function gridKey(lat, lng) {
  const latCell = Math.floor(lat / GRID_SIZE) * GRID_SIZE
  const lngCell = Math.floor(lng / GRID_SIZE) * GRID_SIZE
  return `${latCell.toFixed(4)},${lngCell.toFixed(4)}`
}

function parseCSVLine(line) {
  const parts = line.split(',').map((p) => p.trim())
  if (parts.length < 10) return null
  const lng = parseFloat(parts[4])
  const lat = parseFloat(parts[5])
  if (Number.isNaN(lat) || Number.isNaN(lng) || !inUK(lat, lng)) return null
  const crimeType = parts[9] || 'Other'
  return { lat, lng, crimeType }
}

function* readStreetCSVs(monthDir) {
  const innerDir = path.join(monthDir, path.basename(monthDir))
  if (!fs.existsSync(innerDir)) return
  const files = fs.readdirSync(innerDir)
  for (const f of files) {
    if (f.endsWith('-street.csv')) {
      const fullPath = path.join(innerDir, f)
      const content = fs.readFileSync(fullPath, 'utf-8')
      const lines = content.split(/\r?\n/)
      const header = lines[0]
      if (!header || !header.includes('Longitude')) continue
      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i])
        if (row) yield row
      }
    }
  }
}

/**
 * List available month folders (e.g. 2025-12) under backend root.
 */
export function listMonths() {
  const months = []
  try {
    const entries = fs.readdirSync(BACKEND_ROOT, { withFileTypes: true })
    for (const e of entries) {
      if (e.isDirectory() && /^\d{4}-\d{2}$/.test(e.name)) months.push(e.name)
    }
  } catch (_) {}
  return months.sort().reverse()
}

/**
 * Aggregate crime data for a month: grid cells (for map) and stats (total, by category).
 */
export function getCrimeGridAndStats(month) {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return { grid: [], total: 0, byCategory: {}, maxCount: 0 }
  }
  const monthDir = path.join(BACKEND_ROOT, month)
  if (!fs.existsSync(monthDir)) {
    return { grid: [], total: 0, byCategory: {}, maxCount: 0 }
  }
  const gridCounts = new Map()
  const byCategory = {}
  let total = 0
  for (const row of readStreetCSVs(monthDir)) {
    total++
    const key = gridKey(row.lat, row.lng)
    gridCounts.set(key, (gridCounts.get(key) || 0) + 1)
    byCategory[row.crimeType] = (byCategory[row.crimeType] || 0) + 1
  }
  let maxCount = 0
  const grid = []
  for (const [key, count] of gridCounts) {
    if (count > maxCount) maxCount = count
    const [latStr, lngStr] = key.split(',')
    grid.push({
      lat: parseFloat(latStr) + GRID_SIZE / 2,
      lng: parseFloat(lngStr) + GRID_SIZE / 2,
      count,
    })
  }
  return { grid, total, byCategory, maxCount }
}
