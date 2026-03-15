/**
 * Normalize a hotel object so the API response always includes price and image.
 * Maps common alternate keys (photo, price, etc.) to our standard shape.
 */

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=No+image'

/**
 * @param {Record<string, unknown>} raw
 * @returns {Record<string, unknown>}
 */
export function normalizeHotel(raw) {
  if (!raw || typeof raw !== 'object') return raw
  const priceFrom = (val) => {
    if (val == null) return null
    if (typeof val === 'number' && Number.isFinite(val)) return val
    if (typeof val === 'object' && val !== null && ('amount' in val || 'value' in val))
      return Number(val.amount ?? val.value)
    return Number(val)
  }
  const price =
    priceFrom(raw.min_total_price) ??
    priceFrom(raw.minTotalPrice) ??
    priceFrom(raw.price) ??
    priceFrom(raw.total_price) ??
    priceFrom(raw.totalPrice) ??
    priceFrom(raw.min_price) ??
    priceFrom(raw.minPrice) ??
    priceFrom(raw.from_price) ??
    priceFrom(raw.fromPrice) ??
    (Array.isArray(raw.blocks) && raw.blocks[0] != null ? priceFrom(raw.blocks[0].total_price ?? raw.blocks[0].totalPrice ?? raw.blocks[0].price) : null) ??
    null
  const priceNum = price != null && Number.isFinite(Number(price)) ? Number(price) : null
  const image =
    raw.image_url && String(raw.image_url).trim()
      ? String(raw.image_url)
      : raw.photo
        ? String(raw.photo)
        : raw.main_photo
          ? String(raw.main_photo)
          : PLACEHOLDER_IMAGE
  return {
    ...raw,
    hotel_id: raw.hotel_id,
    hotel_name: raw.hotel_name ?? raw.name ?? 'Hotel',
    url: raw.url ?? raw.booking_url ?? '',
    image_url: image,
    min_total_price: priceNum ?? 0,
    currency_code: raw.currency_code ?? raw.currency ?? 'GBP',
    star_rating: raw.star_rating ?? raw.stars ?? 0,
    review_score: raw.review_score ?? raw.reviewScore ?? raw.rating ?? (raw.review && typeof raw.review === 'object' && raw.review.score != null ? raw.review.score : null) ?? 0,
    review_count: raw.review_count ?? raw.reviewCount ?? (raw.review && typeof raw.review === 'object' && raw.review.review_count != null ? raw.review.review_count : null) ?? 0,
    review_score_word: raw.review_score_word ?? raw.reviewScoreWord ?? (raw.review && typeof raw.review === 'object' && raw.review.display != null ? raw.review.display : null) ?? '',
    address: raw.address ?? '',
  }
}

/**
 * @param {unknown} data - Search response (object with data/results/hotels array)
 * @returns {unknown} Same structure with each hotel normalized (image_url, min_total_price guaranteed)
 */
export function normalizeSearchResponse(data) {
  if (!data || typeof data !== 'object') return data
  const out = { ...data }
  let list = null
  if (Array.isArray(out.data)) list = out.data
  else if (out.data && typeof out.data === 'object' && Array.isArray(out.data.hotels)) list = out.data.hotels
  else if (Array.isArray(out.results)) list = out.results
  else if (Array.isArray(out.hotels)) list = out.hotels
  if (Array.isArray(list)) {
    out.data = list.map((h) => normalizeHotel(typeof h === 'object' && h !== null ? h : {}))
  }
  return out
}
