import { register } from "../../api/auth/register.js";
import { showSuccessModal, showErrorModal } from "../../utils/modals.js";

const form = document.forms.register;

/**
 * Handles the submission of the registration form.
 * Prevents default form behavior, collects and validates form data,
 * sends a registration request, and provides user feedback based on the response.
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Extract form data and convert it to an object
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const { name, email, password, confirmPassword } = data;

  // Simple client-side validation: Check if passwords match
  if (password !== confirmPassword) {
    showErrorModal("Passwords do not match. Please try again.");
    return;
  }

  // Additional client-side validations can be added here (e.g., email format, password strength)

  try {
    // Send a registration request to the API
    const response = await register({ name, email, password });
    
    /**
     * Handle the API response:
     * - If registration is successful, display a success modal and redirect to the login page.
     * - If the API returns an error structure, extract and display the error message.
     * - If the response structure is unexpected, display a generic error message.
     */
    if (response && response.data && response.data.name) {
      // Successfully created a user
      showSuccessModal("Registration successful! You can now login.");
      setTimeout(() => {
        window.location.href = "/auth/login/index.html";
      }, 1500);
    } else {
      // Extract and display specific error messages from the API response
      const errorMessage = (response && response.errors && response.errors[0]?.message) 
        || "Failed to register. Please ensure your data is correct and try again.";
      showErrorModal(errorMessage);
    }
  } catch (error) {
    // Log the error for debugging and display a generic error modal to the user
    console.error("Error registering:", error);
    showErrorModal("An unexpected error occurred. Please try again.");
  }
});
