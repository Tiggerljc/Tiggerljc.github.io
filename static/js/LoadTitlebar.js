// LoadTitlebar.js
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("site-titlebar");
  if (!container) return;

  try {
    // 1. Fetch the titlebar partial
    const response = await fetch("/partials/titlebar.html");
    const html = await response.text();

    // 2. Inject it into the page
    container.outerHTML = html;

    // 3. After injection, select the new title element
    const titleElement = document.getElementById("page-title");

    // 4. Read the page metadata block
    const metaScript = document.getElementById("page-meta");
    if (!metaScript) {
      console.warn("No #page-meta block found for dynamic title.");
      return;
    }

    const meta = JSON.parse(metaScript.textContent);

    // 5. Set the title text
    if (meta.title && titleElement) {
      titleElement.textContent = meta.title;
    }

  } catch (err) {
    console.error("Failed to load titlebar:", err);
  }
});
