// Clear the existing HTML body content
document.body.innerHTML = "";

// Set up basic styling (optional)
document.body.classList.add("bg-background", "text-text", "flex", "flex-col", "items-center", "justify-center", "min-h-screen");

// Create Image
const image = document.createElement("img");
image.src = "/public/lost404.png"; // Adjust the path if needed
image.alt = "Page not found illustration";
image.className = "w-64 h-auto mb-4"; // Tailwind classes for width and spacing

// Create Heading
const heading = document.createElement("h1");
heading.className = "text-3xl font-bold text-primary mb-4";
heading.textContent = "Oops!";

// Create Paragraph
const message = document.createElement("p");
message.className = "text-gray-700 mb-6";
message.textContent = "The page you're looking for does not exist.";

// Create Button
const goHomeBtn = document.createElement("button");
goHomeBtn.id = "goHomeBtn";
goHomeBtn.className = "bg-accent text-white px-6 py-3 rounded-md hover:bg-green-700";
goHomeBtn.textContent = "Go Back to Home";

// Append elements to body
document.body.appendChild(image);
document.body.appendChild(heading);
document.body.appendChild(message);
document.body.appendChild(goHomeBtn);

// Add event listener to button to return to homepage
goHomeBtn.addEventListener("click", () => {
  window.location.href = "/";
});
