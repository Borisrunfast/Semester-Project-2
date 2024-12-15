import { getFromStorage, putToStorage } from "../../utils/localStorage.js";
import { deleteListing } from "../../api/listings/delete.js";
import { getAllListings, searchListings } from "../../api/listings/read.js";
import { getProfileByName } from "../../api/profile/read.js";
import { showSuccessModal, showErrorModal, showConfirmModal } from "../../utils/modals.js";

// References to DOM elements
const heroSection = document.querySelector(".hero");
const listingsContainer = document.getElementById("listingsContainer");
const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");

// Retrieve logged-in user's username
const loggedInUsername = getFromStorage("userData")?.name || "";

// Update user data (e.g., credits) if logged in
// Async function fixes Top level async error in Netlify
(async () => {
  if (loggedInUsername) {
    const updatedUser = await getProfileByName(loggedInUsername);
    if (updatedUser) {
      putToStorage("userData", updatedUser.data);
    }
  }
})();

// Pagination and search state
let currentQuery = "";
let currentPage = 1;
const limit = 12; // Number of listings per page

/**
 * Renders the hero section with a welcome message.
 * Displays different content based on user's login status.
 */
function renderHeroSection() {
  heroSection.innerHTML = "";

  const title = document.createElement("h1");
  title.className = "text-4xl font-bold";
  title.textContent = "Welcome to Auction House";
  heroSection.appendChild(title);

  if (!loggedInUsername) {
    // Description for guests
    const description = document.createElement("p");
    description.className = "text-lg mt-2";
    description.textContent = "Buy and sell unique items. Join today to start bidding!";
    heroSection.appendChild(description);

    // "Get Started" button for guests
    const button = document.createElement("a");
    button.href = "/auth/register/index.html";
    button.className = "px-6 py-3 mt-2 bg-accent text-white rounded-md shadow hover:bg-green-600 inline-block";
    button.textContent = "Get Started";
    heroSection.appendChild(button);
  } else {
    // Welcome message for logged-in users
    const welcomeMessage = document.createElement("p");
    welcomeMessage.className = "text-lg";
    welcomeMessage.textContent = `Welcome back, ${loggedInUsername}!`;
    heroSection.appendChild(welcomeMessage);
  }
}

/**
 * Fetches and renders auction listings based on query and pagination.
 * Renders up to 12 listing cards from the current fetched page.
 * Enables users to navigate between different pages using pagination controls.
 *
 * @param {string} query - The search query.
 * @param {number} page - The current page number.
 */
async function renderListings(query = "", page = 1) {
  listingsContainer.innerHTML = "Loading...";

  try {
    let listings;
    const baseParams = `&_seller=true&_bids=true&page=${page}&limit=${limit}`;

    if (query) {
      // Fetch listings based on search query
      listings = await searchListings(`${encodeURIComponent(query)}${baseParams}`);
    } else {
      // Fetch all listings with pagination
      listings = await getAllListings(`?${baseParams.slice(1)}`);
    }

    listingsContainer.innerHTML = "";

    if (!listings.data || listings.data.length === 0) {
      listingsContainer.innerHTML = "<p class='text-gray-500'>No listings found.</p>";
      renderPagination(null, query);
      return;
    }

    // Iterate over each listing and create a listing card
    listings.data.forEach((listing) => {
      const {
        id,
        title,
        description,
        media,
        tags,
        seller,
        _count,
        bids,
        endsAt,
      } = listing;

      const isSeller = seller?.name === loggedInUsername;
      const highestBid = bids?.length
        ? Math.max(...bids.map((bid) => bid.amount))
        : 0;

      const listingCard = document.createElement("div");
      listingCard.className = "bg-white border rounded-md shadow-md p-4 flex flex-col w-11/12";

      listingCard.innerHTML = `
        <img
          src="${media[0]?.url || "/noImage.jpg"}"
          alt="${media[0]?.alt || "No Image"}"
          class="w-full h-48 object-contain rounded-md mb-4 aspect-video"
        />
        <h3 class="text-lg font-semibold text-primary mb-2 block whitespace-nowrap overflow-hidden text-ellipsis">${title}</h3>
        <p class="text-sm text-text mb-4 line-clamp-2 overflow-hidden">
          ${description || "No description provided."}
        </p>
        <div class="mb-4">
          <p class="text-sm text-gray-600 overflow-hidden"><strong>Seller:</strong> ${seller?.name || "Unknown"}</p>
          <p class="text-sm text-gray-600"><strong>Active:</strong> ${new Date(endsAt) > new Date() ? "Yes" : "No"}</p>
          <p class="text-sm text-gray-600 overflow-hidden"><strong>Tags:</strong> ${tags?.length ? tags.join(", ") : "None"}</p>
          <p class="text-sm text-gray-600"><strong>Bids:</strong> ${_count?.bids || 0}</p>
          <p class="text-sm text-gray-600"><strong>Highest Bid:</strong> ${highestBid || "No bids yet"}</p>
        </div>
        <div class="mt-4 flex justify-between">
          <div class="mt-4">
            <a
              href="/listings/view/index.html?id=${id}"
              class="text-accent hover:underline text-sm font-medium"
            >
              View Details
            </a>
          </div>
          ${
            isSeller
              ? `
                <div class="flex">
                  <a
                    href="/listings/edit/index.html?id=${id}"
                    class="bg-accent text-white mr-3 px-4 py-2 rounded-md hover:bg-accent/80 edit-link"
                  >
                    Edit
                  </a>
                  <button
                    class="bg-error text-white px-4 py-2 rounded-md hover:bg-error/90 delete-button"
                    data-id="${id}"
                  >
                    Delete
                  </button>
                </div>
              `
              : ""
          }
        </div>
      `;
      listingsContainer.appendChild(listingCard);
    });

    // Attach delete event listeners to delete buttons
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const listingId = event.target.dataset.id;

        showConfirmModal(
          "Are you sure you want to delete this listing?",
          async () => {
            await deleteListing(listingId);
            showSuccessModal("Listing deleted successfully.");
            renderListings(query, page);
          },
          () => {
            // Cancel action
          }
        );
      });
    });

    // Render pagination controls
    renderPagination(listings.meta, query);
  } catch (error) {
    listingsContainer.innerHTML = `<p class='text-error'>Error loading listings. Please try again later.</p>`;
    console.error(error);
    showErrorModal("Error loading listings. Please try again later.");
  }
}

/**
 * Renders pagination controls based on listing metadata.
 * Allows users to navigate between different pages of listings.
 *
 * @param {Object|null} meta - Metadata containing pagination information.
 * @param {string} query - The current search query.
 */
function renderPagination(meta, query) {
  const oldPagination = document.getElementById("paginationContainer");
  if (oldPagination) {
    oldPagination.remove();
  }

  if (!meta || !meta.pageCount || meta.pageCount <= 1) return;

  const { pageCount, currentPage } = meta;

  const paginationContainer = document.createElement("div");
  paginationContainer.id = "paginationContainer";
  paginationContainer.className = "flex justify-center mt-6";

  const paginationList = document.createElement("div");
  paginationList.className = "flex space-x-2 items-center";

  let startPage = currentPage - 2;
  let endPage = currentPage + 2;

  if (startPage < 1) {
    endPage += 1 - startPage;
    startPage = 1;
  }
  if (endPage > pageCount) {
    startPage -= endPage - pageCount;
    endPage = pageCount;
  }

  if (currentPage > 1) {
    // Previous page button
    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&#10094;";
    prevButton.className = "px-3 py-2 border rounded-md bg-white text-primary hover:bg-secondary";
    prevButton.addEventListener("click", () => {
      renderListings(query, currentPage - 1);
    });
    paginationList.appendChild(prevButton);
  }

  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = `px-4 py-2 border rounded-md ${
      i === currentPage ? "bg-primary text-white" : "bg-white text-primary hover:bg-secondary"
    }`;
    pageButton.addEventListener("click", () => {
      renderListings(query, i);
    });
    paginationList.appendChild(pageButton);
  }

  if (currentPage < pageCount) {
    // Next page button
    const nextButton = document.createElement("button");
    nextButton.innerHTML = "&#10095;";
    nextButton.className = "px-3 py-2 border rounded-md bg-white text-primary hover:bg-secondary";
    nextButton.addEventListener("click", () => {
      renderListings(query, currentPage + 1);
    });
    paginationList.appendChild(nextButton);
  }

  paginationContainer.appendChild(paginationList);
  listingsContainer.parentNode.appendChild(paginationContainer);
}

/**
 * Handles the search functionality for listings.
 * Initiates a search based on user input and renders the results.
 */
searchBtn.addEventListener("click", () => {
  const query = searchBar.value.trim();

  // Remove existing error messages
  const errorElementId = "searchErrorMessage";
  let errorElement = document.getElementById(errorElementId);
  if (errorElement) {
    errorElement.remove();
  }

  searchBar.classList.remove("border-error");

  if (!query) {
    showErrorModal("You can't search with an empty search bar.");
    return;
  }

  currentQuery = query;
  currentPage = 1;
  renderListings(query, currentPage);
});

// Initial Render Calls
renderHeroSection();
renderListings(currentQuery, currentPage);
