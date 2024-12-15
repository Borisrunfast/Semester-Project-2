import { API_BASE, API_KEY } from "../constant";
import { getFromStorage } from "../../utils/localStorage";
import handleFetch from "../../utils/handleFetch";

// Retrieve the access token from localStorage for authorization
const token = getFromStorage("accessToken");

/**
 * Fetches all profiles with optional query parameters.
 *
 * @param {string} [queryParams=""] - Additional query parameters for filtering profiles.
 * @returns {Promise<Object>} - The response data from the API.
 */
export async function getAllProfiles(queryParams = "") {
    const url = `${API_BASE}/auction/profiles${queryParams}`;
    return await handleFetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
}

/**
 * Retrieves a specific profile by username with optional query parameters.
 *
 * @param {string} name - The username of the profile to retrieve.
 * @param {string} [queryParams=""] - Additional query parameters for the request.
 * @returns {Promise<Object>} - The response data from the API.
 */
export async function getProfileByName(name, queryParams = "") {
    const url = `${API_BASE}/auction/profiles/${encodeURIComponent(name)}${queryParams}`;
    return await handleFetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
}

/**
 * Retrieves all listings associated with a specific profile.
 *
 * @param {string} name - The username of the profile.
 * @param {string} [queryParams=""] - Additional query parameters for filtering listings.
 * @returns {Promise<Object>} - The response data from the API.
 */
export async function getListingsByProfile(name, queryParams = "") {
    const url = `${API_BASE}/auction/profiles/${encodeURIComponent(name)}/listings${queryParams}`;
    return await handleFetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
}

/**
 * Retrieves all bids made by a specific profile, optionally including listing details.
 *
 * @param {string} name - The username of the profile.
 * @param {boolean} [includeListings=false] - Whether to include associated listing details.
 * @returns {Promise<Object>} - The response data from the API.
 */
export async function getBidsByProfile(name, includeListings = false) {
    const url = `${API_BASE}/auction/profiles/${encodeURIComponent(name)}/bids?_listings=${includeListings}`;
    return await handleFetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
}

/**
 * Retrieves all wins (successful bids) associated with a specific profile.
 *
 * @param {string} name - The username of the profile.
 * @param {string} [queryParams=""] - Additional query parameters for filtering wins.
 * @returns {Promise<Object>} - The response data from the API.
 */
export async function getWinsByProfile(name, queryParams = "") {
    const url = `${API_BASE}/auction/profiles/${encodeURIComponent(name)}/wins${queryParams}`;
    return await handleFetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
}

/**
 * Searches for profiles based on a query string.
 *
 * @param {string} query - The search term to query profiles.
 * @returns {Promise<Object>} - The response data from the API.
 */
export async function searchProfiles(query) {
    const encodedQuery = encodeURIComponent(query);
    const url = `${API_BASE}/auction/profiles/search?q=${encodedQuery}`;
    return await handleFetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
}

/**
 * Constructs the authorization headers for API requests.
 *
 * @returns {Object} - An object containing the necessary headers.
 */
function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': API_KEY
    };
}
