/**
 * UK Crime dataset API (backend). No external police API.
 */
import { APP_CONFIG } from '@/config'

const BASE = `${APP_CONFIG.apiBaseUrl.replace(/\/$/, '')}/crime`

export interface CrimeGridCell {
  lat: number
  lng: number
  count: number
}

export interface CrimeGridResponse {
  grid: CrimeGridCell[]
  total: number
  byCategory: Record<string, number>
  maxCount: number
}

export async function getCrimeMonths(): Promise<string[]> {
  const res = await fetch(BASE + '/months')
  if (!res.ok) throw new Error('Failed to fetch months')
  return res.json()
}

export async function getCrimeGrid(month: string): Promise<CrimeGridResponse> {
  const res = await fetch(`${BASE}/grid?month=${encodeURIComponent(month)}`)
  if (!res.ok) throw new Error('Failed to fetch crime grid')
  return res.json()
}
