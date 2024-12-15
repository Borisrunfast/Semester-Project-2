import { showErrorModal } from "./modals";

export default async function handleDeleteFetch(url, options = {}) {
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        // Attempt to read the error message if available
        let errorMessage = "An error occurred";
        try {
          const data = await response.json();
          if (data && data.message) {
            errorMessage = data.message;
          }
        } catch {
          // No JSON body or can't parse, stick to the generic error
        }
  
        throw new Error(errorMessage);
      }
  
      // If response is ok, no data is needed
      return;
    } catch (error) {
      console.error("Fetch error (DELETE):", error.message);
      showErrorModal(error.message || "An unexpected error occurred");
      throw error; 
    }
  }