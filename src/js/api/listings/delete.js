import { getFromStorage } from "../../utils/localStorage";
import { API_KEY, API_BASE } from "../constant";
import handleDeleteFetch from "../../utils/handelDeleteFetch";

/**
 * Deletes an existing auction listing by its ID.
 *
 * @param {string} id - The unique identifier of the listing to delete.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function deleteListing(id) {
  // Construct the API endpoint URL for deleting the listing
  const url = `${API_BASE}/auction/listings/${id}`;
  
  // Retrieve the user's access token from local storage
  const token = getFromStorage("accessToken");
  
  // Send a DELETE request to the API to remove the listing
  return await handleDeleteFetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY
    },
  });
}
