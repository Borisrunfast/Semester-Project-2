import { showErrorModal } from "./modals";

/**
 * Utility functions for interacting with the browser's localStorage.
 * Provides methods to set, get, and remove items with JSON serialization.
 */

/**
 * Stores a value in localStorage under the specified key after serializing it to JSON.
 *
 * @param {string} key - The key under which the value will be stored.
 * @param {any} value - The value to store. Must be serializable to JSON.
 */
function putToStorage(key, value) {
    try {
        const serializedValue = JSON.stringify(value);
        window.localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error(`Error storing data in localStorage for key "${key}":`, error);
        showErrorModal("Failed to save data. Please try again.");
    }
}

/**
 * Retrieves and deserializes a value from localStorage by its key.
 *
 * @param {string} key - The key of the item to retrieve.
 * @returns {any|null} The parsed value if found and valid, otherwise null.
 */
function getFromStorage(key) {
    try {
        const serializedValue = window.localStorage.getItem(key);
        if (serializedValue === null) return null;
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error(`Error parsing data from localStorage for key "${key}":`, error);
        showErrorModal("Failed to retrieve data. Please try again.");
        return null;
    }
}

/**
 * Removes an item from localStorage by its key.
 *
 * @param {string} key - The key of the item to remove.
 */
function removeFromStorage(key) {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing data from localStorage for key "${key}":`, error);
        showErrorModal("Failed to remove data. Please try again.");
    }
}

export { putToStorage, getFromStorage, removeFromStorage };
