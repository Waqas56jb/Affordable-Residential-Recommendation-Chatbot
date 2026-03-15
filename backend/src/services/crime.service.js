/**
 * UK Crime dataset: always uses local backend/2025-12 when running locally (fs); falls back to
 * GitHub raw URLs only when deployed (e.g. Vercel) and no local month folder is found.
 * Aggregates by grid cell for map (red/yellow/green) and returns stats (total, by category).
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from '../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GRID_SIZE = 0.03
const UK_BOUNDS = { latMin: 49.8, latMax: 60.9, lngMin: -8.6, lngMax: 1.8 }

/** Street CSV filenames for 2025-12 (from repo backend/2025-12/2025-12/). Used when loading from GitHub. */
const STREET_CSV_FILES_2025_12 = [
  '2025-12-avon-and-somerset-street.csv',
  '2025-12-bedfordshire-street.csv',
  '2025-12-cambridgeshire-street.csv',
  '2025-12-cheshire-street.csv',
  '2025-12-city-of-london-street.csv',
  '2025-12-cleveland-street.csv',
  '2025-12-cumbria-street.csv',
  '2025-12-derbyshire-street.csv',
  '2025-12-devon-and-cornwall-street.csv',
  '2025-12-dorset-street.csv',
  '2025-12-durham-street.csv',
  '2025-12-dyfed-powys-street.csv',
  '2025-12-essex-street.csv',
  '2025-12-gloucestershire-street.csv',
  '2025-12-hampshire-street.csv',
  '2025-12-hertfordshire-street.csv',
  '2025-12-humberside-street.csv',
  '2025-12-kent-street.csv',
  '2025-12-lancashire-street.csv',
  '2025-12-leicestershire-street.csv',
  '2025-12-lincolnshire-street.csv',
  '2025-12-merseyside-street.csv',
  '2025-12-metropolitan-street.csv',
  '2025-12-norfolk-street.csv',
  '2025-12-north-wales-street.csv',
  '2025-12-north-yorkshire-street.csv',
  '2025-12-northamptonshire-street.csv',
  '2025-12-northern-ireland-street.csv',
  '2025-12-northumbria-street.csv',
  '2025-12-nottinghamshire-street.csv',
  '2025-12-south-wales-street.csv',
  '2025-12-south-yorkshire-street.csv',
  '2025-12-staffordshire-street.csv',
  '2025-12-suffolk-street.csv',
  '2025-12-surrey-street.csv',
  '2025-12-sussex-street.csv',
  '2025-12-thames-valley-street.csv',
  '2025-12-warwickshire-street.csv',
  '2025-12-west-mercia-street.csv',
  '2025-12-west-midlands-street.csv',
  '2025-12-west-yorkshire-street.csv',
  '2025-12-wiltshire-street.csv',
]

/** Prefer local backend root (when running on your machine) so crime data is read from disk, not GitHub. */
function getBackendRoot() {
  const fromDirname = path.resolve(__dirname, '../..')
  if (fs.existsSync(fromDirname)) {
    try {
      const entries = fs.readdirSync(fromDirname, { withFileTypes: true })
      if (entries.some((e) => e.isDirectory() && /^\d{4}-\d{2}$/.test(e.name))) return fromDirname
    } catch (_) {}
  }
  const fromCwd = process.cwd()
  if (fs.existsSync(fromCwd)) {
    try {
      const entries = fs.readdirSync(fromCwd, { withFileTypes: true })
      if (entries.some((e) => e.isDirectory() && /^\d{4}-\d{2}$/.test(e.name))) return fromCwd
    } catch (_) {}
  }
  return null
}

const BACKEND_ROOT = getBackendRoot()

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

function* readStreetCSVsFromFs(monthDir) {
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

/** Raw GitHub URL for a street CSV. */
function getGitHubRawUrl(month, filename) {
  const { githubRepo, githubBranch } = config.crime
  return `https://raw.githubusercontent.com/${githubRepo}/${githubBranch}/backend/${month}/${month}/${filename}`
}

/** Fetch one CSV from GitHub and yield parsed rows. */
async function* fetchStreetCSVFromGitHub(month, filename) {
  const url = getGitHubRawUrl(month, filename)
  const res = await fetch(url)
  if (!res.ok) return
  const text = await res.text()
  const lines = text.split(/\r?\n/)
  const header = lines[0]
  if (!header || !header.includes('Longitude')) return
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i])
    if (row) yield row
  }
}

/**
 * List available month folders. Uses local fs if available, else returns known months from GitHub.
 */
export function listMonths() {
  if (BACKEND_ROOT) {
    try {
      const entries = fs.readdirSync(BACKEND_ROOT, { withFileTypes: true })
      const months = entries
        .filter((e) => e.isDirectory() && /^\d{4}-\d{2}$/.test(e.name))
        .map((e) => e.name)
      if (months.length > 0) return months.sort().reverse()
    } catch (_) {}
  }
  return ['2025-12']
}

/**
 * Aggregate crime data for a month: grid cells (for map) and stats (total, by category).
 * Uses local fs when available; otherwise loads from GitHub raw URLs.
 */
export async function getCrimeGridAndStats(month) {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return { grid: [], total: 0, byCategory: {}, maxCount: 0 }
  }

  const gridCounts = new Map()
  const byCategory = {}
  let total = 0

  if (BACKEND_ROOT) {
    const monthDir = path.join(BACKEND_ROOT, month)
    if (fs.existsSync(monthDir)) {
      for (const row of readStreetCSVsFromFs(monthDir)) {
        total++
        const key = gridKey(row.lat, row.lng)
        gridCounts.set(key, (gridCounts.get(key) || 0) + 1)
        byCategory[row.crimeType] = (byCategory[row.crimeType] || 0) + 1
      }
    }
  }

  if (total === 0 && month === '2025-12') {
    const files = STREET_CSV_FILES_2025_12
    for (const filename of files) {
      try {
        for await (const row of fetchStreetCSVFromGitHub(month, filename)) {
          total++
          const key = gridKey(row.lat, row.lng)
          gridCounts.set(key, (gridCounts.get(key) || 0) + 1)
          byCategory[row.crimeType] = (byCategory[row.crimeType] || 0) + 1
        }
      } catch (_) {
        // skip failed file
      }
    }
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
