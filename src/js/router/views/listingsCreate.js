import { createListing } from "../../api/listings/create.js";
import { showSuccessModal, showErrorModal } from "../../utils/modals.js";

// Reference to the Create Listing form
const createListingForm = document.getElementById("createListingForm");

/**
 * Handles the submission of the Create Listing form.
 * Extracts form data, formats it, sends a request to create a new listing,
 * and provides user feedback based on the response.
 */
createListingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Extract and sanitize form input values
  const title = event.target.title.value.trim();
  const description = event.target.description.value.trim();
  
  // Process tags: split by commas, trim whitespace, and remove empty strings
  const tags = event.target.tags.value
    ? event.target.tags.value.split(",").map(tag => tag.trim()).filter(Boolean)
    : [];
  
  // Process images: split by commas, trim whitespace, and remove empty strings
  const imagesInput = event.target.images.value.trim();
  const images = imagesInput
    ? imagesInput.split(",").map(url => url.trim()).filter(Boolean)
    : [];
  
  // Convert end date to ISO string format
  const endsAt = new Date(event.target.endsAt.value).toISOString();

  try {
    // Send a request to create a new listing with the extracted data
    const response = await createListing({ title, description, tags, images, endsAt });
    
    // Check if the listing was created successfully
    if (response && response.data && response.data.id) {
      showSuccessModal("Listing created successfully!");
      
      // Redirect to the homepage after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      // Display an error modal if the response is not as expected
      showErrorModal("Failed to create listing. Please check your input and try again.");
    }
  } catch (error) {
    // Log the error and display an error modal to the user
    console.error("Error creating listing:", error);
    showErrorModal("Failed to create listing. Please try again.");
  }
});
