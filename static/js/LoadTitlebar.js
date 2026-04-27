// Load the titlebar structure
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("site-titlebar");
  if (!container) return;

  try {
    const response = await fetch("/partials/titlebar.html");
    const html = await response.text();

    // Keep the element, replace its contents
    container.innerHTML = html;

  } catch (err) {
    console.error("Failed to load titlebar:", err);
  }
});
