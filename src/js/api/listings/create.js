import { getFromStorage } from "../../utils/localStorage";
import { API_BASE, API_KEY } from "../constant";
import handleFetch from "../../utils/handleFetch";

/**
 * Creates a new auction listing with the provided details.
 *
 * @param {Object} listingDetails - The details of the listing to create.
 * @param {string} listingDetails.title - The title of the listing.
 * @param {string} listingDetails.description - A description of the listing.
 * @param {string} listingDetails.tags - Comma-separated tags for the listing.
 * @param {string[]} listingDetails.images - An array of image URLs for the listing.
 * @param {string} listingDetails.endsAt - The end date and time for the listing.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function createListing({ title, description, tags, images, endsAt }) {
  const url = `${API_BASE}/auction/listings`;
  const token = getFromStorage("accessToken");

  // Prepare media objects from image URLs
  const media = images.map(url => ({
    url,
    alt: "" 
  }));

  // Construct the request payload
  const body = {
    title,
    description,
    tags,
    media,
    endsAt
  };

  // Send a POST request to create a new listing
  return await handleFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY
    },
    body: JSON.stringify(body),
  });
}

/**
 * Places a bid on an existing auction listing.
 *
 * @param {string} id - The ID of the listing to bid on.
 * @param {number} amount - The bid amount.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function bidOnListing(id, amount) {
  const url = `${API_BASE}/auction/listings/${id}/bids`;
  const token = getFromStorage("accessToken");

  // Construct the bid payload
  const body = {
    amount
  };

  // Send a POST request to place a bid on the listing
  return await handleFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY
    },
    body: JSON.stringify(body),
  });
}
