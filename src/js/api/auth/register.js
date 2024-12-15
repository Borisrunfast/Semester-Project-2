import { API_AUTH } from "../constant";

/**
 * Registers a new user with the provided details.
 * Sends a POST request to the registration API and returns the response data.
 *
 * @param {Object} userDetails - The user's registration details.
 * @param {string} userDetails.name - The user's full name.
 * @param {string} userDetails.email - The user's email address.
 * @param {string} userDetails.password - The user's chosen password.
 * @param {string} [userDetails.bio] - (Optional) The user's bio.
 * @param {string} [userDetails.banner] - (Optional) URL to the user's banner image.
 * @param {string} [userDetails.avatar] - (Optional) URL to the user's avatar image.
 * @returns {Promise<Object>} The JSON response from the registration API.
 */
export async function register({
  name,
  email,
  password,
  bio,
  banner,
  avatar,
}) {
  // Send a POST request to the registration endpoint with user details
  const response = await fetch(`${API_AUTH}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  // Parse and return the JSON response
  return await response.json();
}
