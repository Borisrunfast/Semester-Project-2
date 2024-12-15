import { getFromStorage, removeFromStorage } from "../utils/localStorage.js";
import { showConfirmModal, showSuccessModal } from "../utils/modals.js";

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle and Navigation Links
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  // Desktop and Mobile Logout/Login Links
  const desktopLogoutButton = document.getElementById("desktopLogoutButton");
  const desktopLoginLink = document.getElementById("desktopLoginLink");
  const desktopRegisterLink = document.getElementById("desktopRegisterLink");
  const mobileLogoutButton = document.getElementById("mobileLogoutButton");
  const mobileLoginLink = document.getElementById("mobileLoginLink");
  const mobileRegisterLink = document.getElementById("mobileRegisterLink");

  // Access Token to Check Login Status
  const accessToken = getFromStorage("accessToken");

  // Handle Mobile Menu Toggle
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");

    // Ensure the mobile menu stays on top of other elements
    if (!mobileMenu.classList.contains("hidden")) {
      mobileMenu.style.zIndex = "50"; // Higher than other elements
    } else {
      mobileMenu.style.zIndex = ""; // Reset when closed
    }
  });

  // Close the Mobile Menu on Link Click (Optional)
  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {
      mobileMenu.classList.add("hidden");
    }
  });

  // Show/Hide Login or Logout Buttons Based on Login Status
  if (accessToken) {
    // User is logged in
    desktopLogoutButton?.classList.remove("hidden");
    mobileLogoutButton?.classList.remove("hidden");

    desktopLoginLink?.classList.add("hidden");
    mobileLoginLink?.classList.add("hidden");
    desktopRegisterLink?.classList.add("hidden");
    mobileRegisterLink?.classList.add("hidden");
  } else {
    // User is not logged in
    desktopLogoutButton?.classList.add("hidden");
    mobileLogoutButton?.classList.add("hidden");

    desktopLoginLink?.classList.remove("hidden");
    mobileLoginLink?.classList.remove("hidden");
    desktopRegisterLink?.classList.remove("hidden");
    mobileRegisterLink?.classList.remove("hidden");
  }

  // Logout Functionality
  const handleLogout = () => {
    showConfirmModal("Are you sure you want to log out?",
      () => {
        // Remove tokens and redirect to login page
        removeFromStorage("accessToken");
        removeFromStorage("userData");

        showSuccessModal("You have been logged out.");
        setTimeout(() => {
          window.location.href = "/auth/login/";
        }, 1500);
      },
      () => {
        // Cancelled logout
      }
    );
  };

  // Attach Logout Events to Buttons
  desktopLogoutButton?.addEventListener("click", handleLogout);
  mobileLogoutButton?.addEventListener("click", handleLogout);
});
