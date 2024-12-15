import { getFromStorage } from "../../utils/localStorage";
import { API_KEY, API_BASE } from "../constant";
import handleFetch from "../../utils/handleFetch";

/**
 * Updates an existing auction listing with the provided details.
 *
 * @param {string} id - The unique identifier of the listing to update.
 * @param {Object} updateDetails - The details to update in the listing.
 * @param {string} updateDetails.title - The new title for the listing.
 * @param {string} updateDetails.description - The new description for the listing.
 * @param {string} updateDetails.tags - Comma-separated tags for the listing.
 * @param {Object[]} updateDetails.media - An array of media objects with URLs and alt texts.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function updateListing(id, { title, description, tags, media }) {
  // Construct the API endpoint URL for updating the listing
  const url = `${API_BASE}/auction/listings/${id}`;
  
  // Send a PUT request to update the listing with the provided details
  return await handleFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.accessToken)}`,
      "X-Noroff-API-Key": API_KEY
    },
    body: JSON.stringify({ title, description, tags, media }),
  });
}
