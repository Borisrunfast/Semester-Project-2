import { putToStorage } from "../../utils/localStorage";
import { API_AUTH } from "../constant";

/**
 * Logs in a user using their email and password.
 * On successful login, stores the access token and user data in local storage.
 *
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function login({ email, password }) {
    const response = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (response.ok) {
        // Store the access token and user data in local storage
        putToStorage('accessToken', data.data.accessToken);
        putToStorage('userData', data.data);
    }

    return data;
}
