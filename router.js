// router.js

function injectPage(doc, skipSmoothScroll = false) {
  const newContent = doc.querySelector("#content");
  const meta = doc.querySelector("#page-meta");

  if (!newContent) {
    console.warn("Loaded page has no #content wrapper.");
    return;
  }

  // Replace old content
  const oldContent = document.getElementById("content");
  oldContent.replaceWith(newContent);

  // Update titlebar if metadata exists
  if (meta) {
    try {
      const data = JSON.parse(meta.textContent);
      document.dispatchEvent(
        new CustomEvent("page-title-changed", { detail: data }),
      );
    } catch (e) {
      console.warn("Invalid page-meta JSON", e);
    }
  }

  // Scroll + fade in
  // Ensure scroll query before load; if there is, skip, else run scroll function
  if (!skipSmoothScroll) {
    smoothScrollToTop();
  } else {
    window.scrollTo({ top: 0 });
  }
  // newContent.classList.add("fade", "visible");

  // Notify other scripts
  document.dispatchEvent(new Event("spa-page-loaded"));
}

async function loadPage(url, skipSmoothScroll = false) {
  let content = document.getElementById("content");
  if (!content) return;

  // Normalize URL
  if (!url.startsWith("/")) url = "/" + url;

  // Fade out old content
  // content.classList.add("fade");

  try {
    // Fetch the requested page
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Delay to allow fade-out animation
    setTimeout(() => injectPage(doc, skipSmoothScroll), 250);
  } catch (err) {
    console.error(`Failed to load ${url}:`, err);

    // Remove fade-out so we don't get stuck invisible
    content.classList.remove("fade");

    // Load the 404 fallback page
    const res404 = await fetch("/pages/errors/404.html");
    const html404 = await res404.text();
    const doc404 = new DOMParser().parseFromString(html404, "text/html");

    setTimeout(() => injectPage(doc404), 250);
  }
}

// Intercept link clicks
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link || link.target === "_blank") return;

  const url = link.getAttribute("href");
  if (!url.startsWith("#/")) return;

  e.preventDefault();
  // Remove focus from links to prevent focus styles from sticking
  link.blur();
  location.hash = url;
});

// Smooth scroll
function smoothScrollToTop() {
  const start = document.documentElement.scrollTop;
  const duration = 350;
  const startTime = performance.now();

  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    document.documentElement.scrollTop = start * (1 - eased);
    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// Route caches
let routeCache = null;
let pendingScrollTarget = null;

function handleRoute() {
  let hash = location.hash || "";

  if (!hash || hash === "#") {
    location.hash = "/pages/home.html";
    return;
  }

  // Split hash route and query
  let route, query;
  if (hash.includes("?")) {
    [route, query] = hash.split("?");
  } else {
    route = hash;
    query = "";
  }

  // Check if hash contains query params
  const params = new URLSearchParams(query);

  // Check for scroll query
  const scrollTarget = params.get("scroll");

  // Normalize path
  const path = route.startsWith("#/") ? route.slice(2) : route.slice(1);

  // Store scroll target
  pendingScrollTarget = scrollTarget;

  // If the route is the same as the current page, don't load page
  if (route !== routeCache) {
    routeCache = route;
    pendingScrollTarget = scrollTarget;
    loadPage("/" + path, !!scrollTarget);
    return;
  }

  //Update Scroll
  document.dispatchEvent(
    new CustomEvent("scroll-updated", { detail: scrollTarget }),
  );

  console.log("handleRoute() " + pendingScrollTarget);
}

document.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);
