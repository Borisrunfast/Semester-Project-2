import { API_BASE, API_KEY } from "../constant";
import { getFromStorage } from "../../utils/localStorage";
import handleFetch from "../../utils/handleFetch";
import { showErrorModal } from "../../utils/modals";

/**
 * Updates a user's profile with the provided bio, avatar, and banner information.
 *
 * @param {string} name - The username of the profile to update.
 * @param {Object} profileData - An object containing the profile fields to update.
 * @param {string} [profileData.bio] - The new bio for the user.
 * @param {string} [profileData.avatar] - The URL of the new avatar image.
 * @param {string} [profileData.banner] - The URL of the new banner image.
 * @returns {Promise<Object|null>} - The response data from the API or null if an error occurred.
 */
export async function updateProfile(name, { bio, avatar, banner }) {
    const encodedName = encodeURIComponent(name);
    const url = `${API_BASE}/auction/profiles/${encodedName}`;
    const token = getFromStorage("accessToken");
    
    // Check if the token exists before making the request
    if (!token) {
        showErrorModal("Authentication token is missing. Please log in.");
        return null;
    }
    
    const payload = { 
        bio: bio || "", 
        avatar: {
          url: avatar || "",
          alt: ""
        }, 
        banner: {
          url: banner || "",
          alt: ""
        }
    };
    
    try {
        const response = await handleFetch(url, {
          method: "PUT",
          headers: getAuthHeaders(token),
          body: JSON.stringify(payload),
        });
        return response;
    } catch (error) {
        return null;
    }
}

/**
 * Constructs the authorization headers for API requests.
 *
 * @param {string} token - The access token for authorization.
 * @returns {Object} - An object containing the necessary headers.
 */
function getAuthHeaders(token) {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': API_KEY
    };
}
