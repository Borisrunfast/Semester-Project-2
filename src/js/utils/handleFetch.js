import { showErrorModal } from "./modals";

/**
 * A utility function to perform fetch requests with standardized error handling.
 *
 * @param {string} url - The endpoint URL for the fetch request.
 * @param {Object} [options={}] - Optional configurations for the fetch request (method, headers, body, etc.).
 * @returns {Promise<Object>} - Resolves with the parsed JSON response data.
 */
export default async function handleFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      showErrorModal(data.message || "An error occurred");
      return null;
    }
    return data;
  } catch (error) {
    console.error("Fetch error:", error.message);
    showErrorModal(error.message || "An unexpected error occurred");
    return null;
  }
}
