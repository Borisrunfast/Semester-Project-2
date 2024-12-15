import { getListingById } from "../../api/listings/read.js";
import { updateListing } from "../../api/listings/update.js";
import { deleteListing } from "../../api/listings/delete.js";
import { showSuccessModal, showErrorModal, showConfirmModal } from "../../utils/modals.js";

// Retrieve the listing ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

// Reference to DOM elements
const editListingForm = document.getElementById("editListingForm");
const deleteButton = document.getElementById("deleteButton");

/**
 * Fetches listing data by ID and populates the edit form.
 */
async function loadListingData() {
  try {
    const { data } = await getListingById(listingId);
    const { title, description, tags, media, endsAt } = data;

    // Populate form fields with fetched data
    editListingForm.title.value = title;
    editListingForm.description.value = description;
    editListingForm.tags.value = tags?.join(", ") || "";
    editListingForm.image.value = media[0]?.url || "";
    editListingForm.endsAt.value = new Date(endsAt).toISOString().slice(0, -1);
  } catch (error) {
    console.error("Error fetching listing data:", error);
    showErrorModal("Failed to load listing. Please try again.");
  }
}

/**
 * Handles the submission of the edit listing form.
 * Sends updated listing data to the API and provides user feedback.
 */
editListingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Extract and format form data
  const title = editListingForm.title.value;
  const description = editListingForm.description.value;
  const tags = editListingForm.tags.value
    ? editListingForm.tags.value.split(",").map(tag => tag.trim())
    : [];
  const image = editListingForm.image.value;
  const endsAt = new Date(editListingForm.endsAt.value).toISOString();

  try {
    // Send update request to the API
    await updateListing(listingId, {
      title,
      description,
      tags,
      media: [{ url: image, alt: "" }],
      endsAt,
    });

    showSuccessModal("Listing updated successfully!");
    
    // Redirect to the listing details page after a short delay
    setTimeout(() => {
      window.location.href = `/listings/view/index.html?id=${listingId}`;
    }, 1500);
  } catch (error) {
    console.error("Error updating listing:", error);
    showErrorModal("Failed to update listing. Please try again.");
  }
});

/**
 * Handles the deletion of the listing.
 * Prompts the user for confirmation before deleting.
 */
deleteButton.addEventListener("click", async () => {
  showConfirmModal(
    "Are you sure you want to delete this listing?",
    async () => {
      try {
        // Send delete request to the API
        await deleteListing(listingId);
        showSuccessModal("Listing deleted successfully!");
        
        // Redirect to the listings page after a short delay
        setTimeout(() => {
          window.location.href = "/listings/";
        }, 1500);
      } catch (error) {
        console.error("Error deleting listing:", error);
        showErrorModal("Failed to delete listing. Please try again.");
      }
    },
    () => {
      // User canceled the deletion; no action needed
    }
  );
});

// Initialize the page by loading listing data
loadListingData();
