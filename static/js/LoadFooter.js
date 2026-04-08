document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("site-footer");
  if (!container) return;

  try {
    const response = await fetch("/partials/footer.html");
    const html = await response.text();
    container.innerHTML = html;
  } catch (err) {
    console.error("Failed to load footer:", err);
  }
});
