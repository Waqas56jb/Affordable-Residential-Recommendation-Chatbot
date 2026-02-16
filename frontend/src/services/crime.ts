/**
 * UK Crime dataset API (local backend). No external police API.
 */

const BASE = '/api/crime'

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
