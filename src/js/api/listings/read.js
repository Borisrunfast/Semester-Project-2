import handleFetch from "../../utils/handleFetch";

const API_BASE_URL = "https://v2.api.noroff.dev";

/**
 * Retrieves all auction listings with optional query parameters.
 *
 * @param {string} [queryParams=""] - Additional query parameters for filtering listings.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function getAllListings(queryParams = "") {
  const url = `${API_BASE_URL}/auction/listings${queryParams}`;
  
  // Send a GET request to fetch all listings
  return await handleFetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Retrieves a specific auction listing by its ID.
 *
 * @param {string} id - The unique identifier of the listing.
 * @param {boolean} [includeSeller=false] - include seller details.
 * @param {boolean} [includeBids=false] - include bid details.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function getListingById(id, includeSeller = false, includeBids = false) {
  const url = `${API_BASE_URL}/auction/listings/${id}?_seller=${includeSeller}&_bids=${includeBids}`;
  
  // Send a GET request to fetch the listing by ID with optional inclusions
  return await handleFetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Searches for auction listings based on a query string.
 *
 * @param {string} queryString - The search term to query listings.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function searchListings(queryString) {
  const url = `${API_BASE_URL}/auction/listings/search?q=${encodeURIComponent(queryString)}`;
  
  // Send a GET request to search listings by query string
  return await handleFetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
