import { getProfileByName, getBidsByProfile, getWinsByProfile, getListingsByProfile } from "../../api/profile/read.js";
import { updateProfile } from "../../api/profile/update.js";
import { getFromStorage } from "../../utils/localStorage.js";
import { showSuccessModal, showErrorModal, showConfirmModal } from "../../utils/modals.js";

// References to DOM elements
const profileNameElement = document.getElementById("profileName");
const profileBioElement = document.getElementById("profileBio");
const profileAvatarElement = document.getElementById("profileAvatar");
const profileCreditsElement = document.getElementById("profileCredits");
const updateProfileBtn = document.getElementById("updateProfileBtn");
const updateModal = document.getElementById("updateModal");
const updateProfileForm = document.getElementById("updateProfileForm");
const cancelUpdateBtn = document.getElementById("cancelUpdateBtn");

const toggleBidsBtn = document.getElementById("toggleBidsBtn");
const toggleWinsBtn = document.getElementById("toggleWinsBtn");
const toggleListingsBtn = document.getElementById("toggleListingsBtn");
const bidsSection = document.getElementById("bidsSection");
const winsSection = document.getElementById("winsSection");
const listingsSection = document.getElementById("listingsSection");
const bidsContainer = document.getElementById("bidsContainer");
const winsContainer = document.getElementById("winsContainer");
const listingsContainer = document.getElementById("listingsContainer");

// Retrieve the username from URL parameters or local storage
const urlParams = new URLSearchParams(window.location.search);
let username = urlParams.get("name") || getFromStorage("userData")?.name;

// Cache to store fetched data and prevent redundant API calls
let cachedBidsData = null;
let cachedWinsData = null;
let cachedListingsData = null;

// Initialize data loading if a username is present
if (!username) {
  showErrorModal("You need to be logged in to view a profile");
} else {
  loadAllData();
}

/**
 * Loads all necessary data for the profile page, including profile details,
 * bids, wins, and listings.
 */
async function loadAllData() {
  try {
    // Fetch and display profile information
    let profileResponse = await getProfileByName(username);
    const profile = profileResponse.data;
    profileNameElement.textContent = profile.name;
    profileBioElement.textContent = profile.bio || "No bio available.";
    profileAvatarElement.src = profile.avatar?.url || "/public/noImage.jpg";
    profileCreditsElement.textContent = `Credits: ${profile.credits}`;

    // Fetch and render bids, wins, and listings
    await loadBidsData();
    await loadWinsData();
    await loadListingsData();
  } catch (error) {
    console.error("Error loading profile:", error);
    showErrorModal("Failed to load profile. Please try again.");
  }
}

/**
 * Fetches the user's bids and renders them on the profile page.
 */
async function loadBidsData() {
  try {
    const { data: bids } = await getBidsByProfile(username, true);
    cachedBidsData = bids;
    renderBids(bids);
  } catch (error) {
    console.error("Error loading bids:", error);
    cachedBidsData = [];
    bidsContainer.innerHTML = "<p class='text-red-500'>Failed to load bids.</p>";
    showErrorModal("Failed to load bids. Please try again.");
  }
}

/**
 * Fetches the user's wins and renders them on the profile page.
 */
async function loadWinsData() {
  try {
    const wins = await getWinsByProfile(username);
    cachedWinsData = wins.data || [];
    renderWins(cachedWinsData);
  } catch (error) {
    console.error("Error loading wins:", error);
    cachedWinsData = [];
    winsContainer.innerHTML = "<p class='text-red-500'>Failed to load wins.</p>";
    showErrorModal("Failed to load wins. Please try again.");
  }
}

/**
 * Fetches the user's listings and renders them on the profile page.
 */
async function loadListingsData() {
  try {
    const listings = await getListingsByProfile(username);
    cachedListingsData = listings.data || [];
    renderListings(cachedListingsData);
  } catch (error) {
    console.error("Error loading listings:", error);
    cachedListingsData = [];
    listingsContainer.innerHTML = "<p class='text-red-500'>Failed to load listings.</p>";
    showErrorModal("Failed to load listings. Please try again.");
  }
}

/**
 * Renders the list of bids on the profile page.
 *
 * @param {Object[]} bids - An array of bid objects.
 */
function renderBids(bids) {
  if (!bids || bids.length === 0) {
    bidsContainer.innerHTML = "<p>No bids found.</p>";
    return;
  }

  bidsContainer.innerHTML = bids.map(bid => `
    <div class="border p-4 rounded-md shadow-md overflow-hidden">
      <p><strong>Amount:</strong> ${bid.amount} credits</p>
      <p><strong>Listing:</strong> ${
        bid.listing
          ? `<a href="/listings/view/index.html?id=${bid.listing.id}" class="text-accent hover:underline">${bid.listing.title}</a>`
          : "No associated listing"
      }</p>
      <p class="text-sm text-gray-500"><strong>Date:</strong> ${new Date(bid.created).toLocaleString()}</p>
    </div>
  `).join("");
}

/**
 * Renders the list of wins on the profile page.
 *
 * @param {Object[]} wins - An array of win objects.
 */
function renderWins(wins) {
  if (!wins || wins.length === 0) {
    winsContainer.innerHTML = "<p>No wins found.</p>";
    return;
  }

  winsContainer.innerHTML = wins.map(win => `
    <div class="border p-4 rounded-md shadow-md overflow-hidden">
      <p class="text-lg font-semibold text-primary">
        <a href="/listings/view/index.html?id=${win.id}" class="text-accent hover:underline">${win.title}</a>
      </p>
      <p>${win.description || "No description"}</p>
      <p class="text-sm text-gray-500"><strong>Ended:</strong> ${new Date(win.endsAt).toLocaleString()}</p>
    </div>
  `).join("");
}

/**
 * Renders the list of listings on the profile page.
 *
 * @param {Object[]} listings - An array of listing objects.
 */
function renderListings(listings) {
  if (!listings || listings.length === 0) {
    listingsContainer.innerHTML = "<p>No listings found.</p>";
    return;
  }

  listingsContainer.innerHTML = listings.map(listing => `
    <div class="border p-4 rounded-md shadow-md overflow-hidden">
      <p class="text-lg font-semibold text-primary">
        <a href="/listings/view/index.html?id=${listing.id}" class="text-accent hover:underline">${listing.title}</a>
      </p>
      <p>${listing.description || "No description"}</p>
      <p class="text-sm text-gray-500"><strong>Ends:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
    </div>
  `).join("");
}

/**
 * Toggles the visibility of the bids section.
 */
toggleBidsBtn.addEventListener("click", () => {
  const isHidden = bidsSection.classList.contains("hidden");
  winsSection.classList.add("hidden");
  listingsSection.classList.add("hidden");

  if (isHidden) {
    if (cachedBidsData && cachedBidsData.length) {
      renderBids(cachedBidsData);
    }
    bidsSection.classList.remove("hidden");
  } else {
    bidsSection.classList.add("hidden");
  }
});

/**
 * Toggles the visibility of the wins section.
 */
toggleWinsBtn.addEventListener("click", () => {
  const isHidden = winsSection.classList.contains("hidden");
  bidsSection.classList.add("hidden");
  listingsSection.classList.add("hidden");

  if (isHidden) {
    if (cachedWinsData && cachedWinsData.length) {
      renderWins(cachedWinsData);
    }
    winsSection.classList.remove("hidden");
  } else {
    winsSection.classList.add("hidden");
  }
});

/**
 * Toggles the visibility of the listings section.
 */
toggleListingsBtn.addEventListener("click", () => {
  const isHidden = listingsSection.classList.contains("hidden");
  bidsSection.classList.add("hidden");
  winsSection.classList.add("hidden");

  if (isHidden) {
    if (cachedListingsData && cachedListingsData.length) {
      renderListings(cachedListingsData);
    }
    listingsSection.classList.remove("hidden");
  } else {
    listingsSection.classList.add("hidden");
  }
});

/**
 * Opens the update profile modal.
 */
updateProfileBtn.addEventListener("click", () => {
  updateModal.classList.remove("hidden");
});

/**
 * Closes the update profile modal.
 */
cancelUpdateBtn.addEventListener("click", () => {
  updateModal.classList.add("hidden");
});

/**
 * Handles the submission of the update profile form.
 * Validates and sends updated profile data to the API.
 */
updateProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const bio = event.target.bio.value;
  const avatar = event.target.avatar.value;
  const banner = event.target.banner.value;

  showConfirmModal(
    "Are you sure you want to update your profile?",
    async () => {
      try {
        await updateProfile(username, { bio, avatar, banner });
        showSuccessModal("Profile updated successfully!");
        updateModal.classList.add("hidden");
        // Refresh all data after a short delay
        setTimeout(() => {
          loadAllData();
        }, 1500);
      } catch (error) {
        console.error("Error updating profile:", error);
        showErrorModal("Failed to update profile. Please try again.");
      }
    },
    () => {
      // User canceled the update; no action needed
    }
  );
});
