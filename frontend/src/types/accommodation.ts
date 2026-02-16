/** StayAPI / Booking.com–style accommodation types */

export interface DestinationSuggestion {
  dest_id: number
  dest_type: string
  label?: string
}

export interface DestinationLookupResponse {
  success: boolean
  query: string
  dest_id?: number
  dest_type?: string
  normalized_query?: string
  suggestions?: DestinationSuggestion[]
  message?: string
}

export interface HotelSearchResult {
  hotel_id: number
  hotel_name: string
  url: string
  image_url: string
  star_rating: number
  review_score: number
  review_count: number
  review_score_word: string
  address: string
  distance_from_center?: number
  unit_configuration_label?: string
  min_total_price: number
  currency_code: string
  is_free_cancellable?: number
  is_no_prepayment_block?: number
  checkin?: string
  checkout?: string
}

export interface HotelSearchResponse {
  success: boolean
  data?: HotelSearchResult[]
  pagination?: {
    rows_per_page: number
    current_offset: number
    total_count_with_filters: number
  }
  search_metadata?: {
    dest_id: string
    dest_type: string
    search_type: string
  }
  message?: string
}

export interface SearchParams {
  dest_id: number | string
  dest_type?: string
  checkin: string
  checkout: string
  adults?: number
  rooms?: number
  children?: number
  rows_per_page?: number
  offset?: number
  currency?: string
}
