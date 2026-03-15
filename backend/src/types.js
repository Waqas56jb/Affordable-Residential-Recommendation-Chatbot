/**
 * Shared request/response shapes for accommodation API.
 * Kept in sync with frontend types for easy integration.
 * @typedef {Object} DestinationSuggestion
 * @property {number} dest_id
 * @property {string} dest_type
 * @property {string} [label]
 *
 * @typedef {Object} DestinationLookupResponse
 * @property {boolean} success
 * @property {string} query
 * @property {number} [dest_id]
 * @property {string} [dest_type]
 * @property {string} [normalized_query]
 * @property {DestinationSuggestion[]} [suggestions]
 * @property {string} [message]
 *
 * @typedef {Object} HotelSearchResult
 * @property {number} hotel_id
 * @property {string} hotel_name
 * @property {string} url
 * @property {string} image_url
 * @property {number} star_rating
 * @property {number} review_score
 * @property {number} review_count
 * @property {string} review_score_word
 * @property {string} address
 * @property {number} [distance_from_center]
 * @property {string} [unit_configuration_label]
 * @property {number} min_total_price
 * @property {string} currency_code
 * @property {number} [is_free_cancellable]
 * @property {number} [is_no_prepayment_block]
 * @property {string} [checkin]
 * @property {string} [checkout]
 *
 * @typedef {Object} HotelSearchResponse
 * @property {boolean} success
 * @property {HotelSearchResult[]} [data]
 * @property {{ rows_per_page: number, current_offset: number, total_count_with_filters: number }} [pagination]
 * @property {{ dest_id: string, dest_type: string, search_type: string }} [search_metadata]
 * @property {string} [message]
 *
 * @typedef {Object} SearchParams
 * @property {number|string} dest_id
 * @property {string} [dest_type]
 * @property {string} checkin
 * @property {string} checkout
 * @property {number} [adults]
 * @property {number} [rooms]
 * @property {number} [children]
 * @property {number} [rows_per_page]
 * @property {number} [offset]
 * @property {string} [currency]
 */
