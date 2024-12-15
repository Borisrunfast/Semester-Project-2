import { getListingById } from "../../api/listings/read.js";
import { deleteListing } from "../../api/listings/delete.js";
import { bidOnListing } from "../../api/listings/create.js";
import { getFromStorage } from "../../utils/localStorage.js";
import { showSuccessModal, showErrorModal, showConfirmModal } from "../../utils/modals.js";

// Retrieve the listing ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

// References to DOM elements
const titleElement = document.getElementById("title");
const mediaContainer = document.getElementById("mediaContainer");
const descriptionElement = document.getElementById("description");
const tagsElement = document.getElementById("tags");
const endDateElement = document.getElementById("endDate");
const bidsContainer = document.getElementById("bidsContainer");
const bidSection = document.getElementById("bidSection");

// Retrieve user data from local storage
let userData = getFromStorage("userData");
let listingData; 
let currentImageIndex = 0;

/**
 * Fetches the listing data by ID and renders all components on the page.
 */
async function fetchAndRenderListing() {
  try {
    const listing = await getListingById(listingId, true, true);
    listingData = listing.data;
    const { title, description, media, endsAt, bids, seller, tags, id } = listingData;

    // Populate listing details
    titleElement.textContent = title;
    descriptionElement.textContent = description || "No description provided.";
    endDateElement.textContent = `Ends at: ${new Date(endsAt).toLocaleString()}`;
    tagsElement.textContent = tags && tags.length > 0 ? `Tags: ${tags.join(", ")}` : "No tags.";

    // Render different components
    renderMediaCarousel(media);
    renderSeller(seller);
    renderBids(bids, seller);
    renderBidForm(bids, seller, endsAt);

    // Determine if the logged-in user is the seller
    const loggedInUsername = userData?.name;
    const isSeller = seller?.name === loggedInUsername;

    // If the user is the seller, display edit and delete options
    if (isSeller) {
      createSellerActions(id);
    }

  } catch (error) {
    console.error("Error fetching listing:", error);
    showErrorModal("Could not fetch listing. Please try again.");
  }
}

/**
 * Creates and appends edit and delete buttons for the seller.
 *
 * @param {string} id - The unique identifier of the listing.
 */
function createSellerActions(id) {
  // Create a container for the edit/delete buttons
  const sellerActionsContainer = document.createElement("div");
  sellerActionsContainer.className = "mt-4 flex";

  sellerActionsContainer.innerHTML = `
    <a
      href="/listings/edit/index.html?id=${id}"
      class="bg-accent text-white mr-2 px-4 py-2 rounded-md hover:bg-accent/80"
    >
      Edit
    </a>
    <button
      class="bg-error text-white px-4 py-2 rounded-md hover:bg-error/90 delete-button"
      data-id="${id}"
    >
      Delete
    </button>
  `;

  // Insert the actions container before the bid section
  endDateElement.parentNode.insertBefore(sellerActionsContainer, bidSection);

  // Attach event listener for the delete button
  sellerActionsContainer.querySelector(".delete-button").addEventListener("click", async (event) => {
    const listingId = event.target.dataset.id;
    handleDeleteListing(listingId);
  });
}

/**
 * Handles the deletion of a listing with user confirmation.
 *
 * @param {string} listingId - The unique identifier of the listing to delete.
 */
async function handleDeleteListing(listingId) {
  showConfirmModal(
    "Are you sure you want to delete this listing?",
    async () => {
      try {
        await deleteListing(listingId);
        showSuccessModal("Listing deleted successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } catch (error) {
        console.error("Error deleting listing:", error);
        showErrorModal("Failed to delete listing. Please try again.");
      }
    },
    () => {
      // User canceled
    }
  );
}

/**
 * Renders the media carousel with navigation controls.
 *
 * @param {Object[]} media - An array of media objects containing URLs and alt texts.
 */
function renderMediaCarousel(media) {
  mediaContainer.innerHTML = "";

  if (!media || media.length === 0) {
    mediaContainer.innerHTML = "<p class='text-gray-700'>No media available.</p>";
    return;
  }

  const imageElement = document.createElement("img");
  imageElement.className = "rounded-md w-full h-full object-contain transition-all";
  imageElement.src = media[currentImageIndex].url || "/public/noImage.jpg";
  imageElement.alt = media[currentImageIndex].alt || "";
  mediaContainer.appendChild(imageElement);

  if (media.length > 1) {
    const prevButton = createCarouselButton("&#10094;", "left");
    const nextButton = createCarouselButton("&#10095;", "right");

    mediaContainer.appendChild(prevButton);
    mediaContainer.appendChild(nextButton);
  }
}

/**
 * Creates a navigation button for the media carousel.
 *
 * @param {string} symbol - The HTML symbol to display on the button.
 * @param {string} direction - The direction of the button ('left' or 'right').
 * @returns {HTMLElement} The created button element.
 */
function createCarouselButton(symbol, direction) {
  const button = document.createElement("button");
  button.innerHTML = symbol;
  button.className = `absolute ${direction === "left" ? "left-2" : "right-2"} top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-gray-900`;
  
  button.addEventListener("click", () => {
    currentImageIndex = direction === "left"
      ? (currentImageIndex - 1 + listingData.media.length) % listingData.media.length
      : (currentImageIndex + 1) % listingData.media.length;
    mediaContainer.querySelector("img").src = listingData.media[currentImageIndex].url || "/public/noImage.jpg";
    mediaContainer.querySelector("img").alt = listingData.media[currentImageIndex].alt || "";
  });

  return button;
}

/**
 * Renders the seller information.
 *
 * @param {Object} seller - The seller's data.
 */
function renderSeller(seller) {
  const sellerElement = document.createElement("p");
  sellerElement.className = "text-sm text-gray-600 mb-4";
  sellerElement.innerHTML = `<strong>Seller:</strong> <a href="/profile/index.html?name=${encodeURIComponent(seller.name)}" class="text-accent hover:underline">${seller.name}</a>`;
  
  // Insert seller information after the tags
  tagsElement.parentNode.insertBefore(sellerElement, endDateElement.nextSibling);
}

/**
 * Renders the list of bids on the listing.
 *
 * @param {Object[]} bids - An array of bid objects.
 * @param {Object} seller - The seller's data.
 */
function renderBids(bids) {
  const sortedBids = (bids || []).slice().reverse();

  if (sortedBids.length === 0) {
    bidsContainer.innerHTML = "<p>No bids yet.</p>";
    return;
  }

  const loggedInUsername = userData?.name;
  bidsContainer.innerHTML = sortedBids
    .map((bid) => {
      const isUserBid = bid.bidder.name === loggedInUsername;
      return `
        <li class="border p-3 rounded-md ${isUserBid ? 'bg-green-100' : ''}">
          <div class="flex items-center justify-between">
            <p class="text-lg font-semibold">
              ${bid.amount} credits
              ${isUserBid ? '<span class="text-sm bg-green-600 text-white px-2 py-1 rounded ml-2">Your Bid</span>' : ''}
            </p>
            <p class="text-sm text-gray-600">${new Date(bid.created).toLocaleString()}</p>
          </div>
          <p class="mt-1 text-gray-700"><strong>Bidder:</strong> <a href="/profile/index.html?name=${encodeURIComponent(bid.bidder.name)}" class="text-accent hover:underline">${bid.bidder.name}</a></p>
        </li>
      `;
    })
    .join("");
}

/**
 * Renders the bid form, allowing users to place a new bid.
 *
 * @param {Object[]} bids - An array of bid objects.
 * @param {Object} seller - The seller's data.
 * @param {string} endsAt - The ISO string representing the listing's end time.
 */
function renderBidForm(bids, seller, endsAt) {
  bidSection.innerHTML = "";

  const now = new Date();
  const listingEnd = new Date(endsAt);

  // Conditions to display the bid form
  if (!userData) {
    bidSection.innerHTML = `
      <p class="text-red-500 mb-4">You must be logged in to place a bid.</p>
      <a href="/auth/login/" class="text-accent hover:underline">Login Here</a>
    `;
    return;
  }

  if (seller.name === userData.name) {
    bidSection.innerHTML = `
      <p class="text-gray-600 mb-4">You cannot bid on your own listing.</p>
    `;
    return;
  }

  if (listingEnd <= now) {
    bidSection.innerHTML = `
      <p class="text-gray-600 mb-4">This listing has ended. No more bids allowed.</p>
    `;
    return;
  }

  const sortedBids = (bids || []).slice().reverse();
  const highestBid = sortedBids.length > 0 ? sortedBids[0].amount : 0;
  const minBid = highestBid > 0 ? highestBid + 1 : 1;

  bidSection.innerHTML = `
    <div class="bg-white border rounded-md shadow-md p-4 mb-4">
      <h3 class="text-lg font-semibold text-primary mb-2">Place a Bid</h3>
      <p class="text-sm text-gray-700 mb-2">Minimum bid: ${minBid} credits</p>
      <p class="text-sm text-gray-700 mb-4">Your credits: ${userData.credits}</p>
      <div class="flex items-center space-x-2">
        <input
          type="number"
          id="bidAmount"
          class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-32"
          placeholder="${minBid}"
          min="${minBid}"
        />
        <button
          id="placeBidBtn"
          class="px-4 py-2 bg-accent text-white rounded-md hover:bg-green-600"
        >
          Place Bid
        </button>
      </div>
      <p id="bidError" class="text-red-500 mt-2 hidden"></p>
    </div>
  `;

  // Reference to bid form elements
  const placeBidBtn = document.getElementById("placeBidBtn");
  const bidAmountInput = document.getElementById("bidAmount");
  const bidError = document.getElementById("bidError");

  // Event listener for placing a bid
  placeBidBtn.addEventListener("click", async () => {
    // Reset error messages
    bidError.classList.add("hidden");
    bidError.textContent = "";

    const bidValue = parseInt(bidAmountInput.value.trim(), 10);
    if (isNaN(bidValue) || bidValue < minBid) {
      bidError.textContent = `Your bid must be at least ${minBid} credits.`;
      bidError.classList.remove("hidden");
      return;
    }

    if (bidValue > userData.credits) {
      bidError.textContent = `You don't have enough credits for this bid. Your credits: ${userData.credits}`;
      bidError.classList.remove("hidden");
      return;
    }

    try {
      // Send a bid request to the API
      await bidOnListing(listingId, bidValue);
      showSuccessModal("Bid placed successfully!");
      
      // Refresh listing data after a short delay
      setTimeout(async () => {
        await fetchAndRenderListing();
      }, 1500);
    } catch (error) {
      console.error("Error placing bid:", error);
      bidError.textContent = "Failed to place bid. Please try again.";
      bidError.classList.remove("hidden");
      showErrorModal("Failed to place bid. Please try again.");
    }
  });
}

// Initialize the page by fetching and rendering the listing data
fetchAndRenderListing();
