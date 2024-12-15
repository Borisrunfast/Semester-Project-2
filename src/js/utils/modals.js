// modal.js

/**
 * This module provides utility functions to display various types of modals
 * (success, error, and confirmation) to the user.
 */

// Create and configure the modal container
const modalContainer = document.createElement("div");
modalContainer.className = `
  fixed bottom-4 left-1/2 transform -translate-x-1/2 
  z-50 flex flex-col items-center space-y-2
`;
document.body.appendChild(modalContainer);

/**
 * Creates a base modal element with the provided HTML content.
 *
 * @param {string} contentHTML - The HTML content to be inserted into the modal.
 * @returns {HTMLElement} The created modal element.
 */
function createBaseModal(contentHTML) {
  const modal = document.createElement("div");
  modal.className = `
    bg-background border border-secondary rounded-md shadow-lg p-4 
    w-auto max-w-sm flex flex-col items-stretch
  `;
  modal.innerHTML = contentHTML;
  return modal;
}

/**
 * Automatically dismisses a modal after a specified timeout.
 *
 * @param {HTMLElement} modal - The modal element to be dismissed.
 * @param {number} [timeout=3000] - The time in milliseconds before the modal is dismissed.
 */
function autoDismiss(modal, timeout = 3000) {
  setTimeout(() => {
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }, timeout);
}

/**
 * Displays a success modal with the provided message.
 * The modal automatically dismisses after 3 seconds.
 *
 * @param {string} message - The success message to display.
 */
export function showSuccessModal(message) {
  const modal = createBaseModal(`
    <p class="text-primary font-bold mb-2">Success</p>
    <p class="text-text">${message}</p>
  `);
  modalContainer.appendChild(modal);
  autoDismiss(modal, 3000);
}

/**
 * Displays an error modal with the provided message.
 * The modal automatically dismisses after 5 seconds to ensure visibility.
 *
 * @param {string} message - The error message to display.
 */
export function showErrorModal(message) {
  const modal = createBaseModal(`
    <p class="text-error font-bold mb-2">Error</p>
    <p class="text-text">${message}</p>
  `);
  modalContainer.appendChild(modal);
  autoDismiss(modal, 5000); // Error messages are kept visible longer
}

/**
 * Displays a confirmation modal with Confirm and Cancel buttons.
 * Executes callback functions based on user interaction.
 *
 * @param {string} message - The confirmation message to display.
 * @param {Function} onConfirm - Callback function to execute if the user confirms.
 * @param {Function} onCancel - Callback function to execute if the user cancels.
 */
export function showConfirmModal(message, onConfirm, onCancel) {
  const modal = createBaseModal(`
    <p class="font-bold mb-2 text-text">Confirm Action</p>
    <p class="text-text mb-4">${message}</p>
    <div class="flex justify-end space-x-2">
      <button id="confirmModalCancel" 
        class="bg-secondary text-text px-3 py-2 rounded-md hover:bg-secondary/80">
        Cancel
      </button>
      <button id="confirmModalConfirm" 
        class="bg-primary text-background px-3 py-2 rounded-md hover:bg-primary/80">
        Confirm
      </button>
    </div>
  `);

  modalContainer.appendChild(modal);

  // Reference to the Confirm and Cancel buttons within the modal
  const confirmBtn = modal.querySelector("#confirmModalConfirm");
  const cancelBtn = modal.querySelector("#confirmModalCancel");

  // Event listener for the Confirm button
  confirmBtn.addEventListener("click", () => {
    if (typeof onConfirm === "function") onConfirm();
    modal.remove();
  });

  // Event listener for the Cancel button
  cancelBtn.addEventListener("click", () => {
    if (typeof onCancel === "function") onCancel();
    modal.remove();
  });
}
