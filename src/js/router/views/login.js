import { login } from "../../api/auth/login";
import { showSuccessModal, showErrorModal } from "../../utils/modals.js";

// Reference to the login form
const form = document.forms.login;

/**
 * Handles the submission of the login form.
 * Prevents default form behavior, collects form data,
 * attempts to log in the user, and provides feedback based on the response.
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Extract form data and convert to an object
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    // Attempt to log in with the provided credentials
    await login(data);
    
    // Show success modal and redirect to homepage after a short delay
    showSuccessModal("Login successful!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  } catch (error) {
    // Log the error and show an error modal to the user
    console.error("Error logging in:", error);
    showErrorModal("Failed to log in. Please check your credentials and try again.");
  }
});
