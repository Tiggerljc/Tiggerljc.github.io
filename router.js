// router.js

let activeSectionScript = null;
let activeSectionName = null;
let activeRequestId = 0;

function unloadSectionScript() {
  if (!activeSectionScript) return;

  document.dispatchEvent(new Event("section-script-destroy"));
  activeSectionScript.remove();
  activeSectionScript = null;
  activeSectionName = null;
}

function loadSectionScript(sectionName, onReady) {
  const scriptMap = {
    blogs: "/static/scripts/blogs.js",
    docs: "/static/scripts/docs.js",
    notes: "/static/scripts/notes.js",
  };

  const src = scriptMap[sectionName];
  if (!src) {
    onReady?.();
    return;
  }

  if (activeSectionName === sectionName && activeSectionScript) {
    onReady?.();
    return;
  }

  unloadSectionScript();

  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.addEventListener("load", () => {
    activeSectionScript = script;
    activeSectionName = sectionName;
    onReady?.();
  });
  script.addEventListener("error", () => {
    console.error(`Failed to load section script: ${src}`);
    onReady?.();
  });

  document.body.appendChild(script);
}

function syncPageMeta(doc) {
  const meta = doc.querySelector("#page-meta");
  if (!meta) return;

  try {
    const data = JSON.parse(meta.textContent);
    document.dispatchEvent(
      new CustomEvent("page-title-changed", { detail: data }),
    );
  } catch (e) {
    console.warn("Invalid page-meta JSON", e);
  }
}

function injectPage(doc, skipSmoothScroll = false, metaDoc = doc) {
  const newContent = doc.querySelector("#content");

  if (!newContent) {
    console.warn("Loaded page has no #content wrapper.");
    return;
  }

  const oldContent = document.getElementById("content");
  oldContent.replaceWith(newContent);

  syncPageMeta(metaDoc);

  if (!skipSmoothScroll) {
    smoothScrollToTop();
  } else {
    window.scrollTo({ top: 0 });
  }

  // Notify other scripts
  document.dispatchEvent(new Event("spa-page-loaded"));
}

function getSectionInfo(url) {
  const normalized = (url || "").replace(/^\/+/, "");

  if (/^pages\/blogs(?:\/|\.|$)/i.test(normalized)) {
    return { name: "blogs", shellUrl: "/pages/Blogs.html" };
  }

  if (/^pages\/docs(?:\/|\.|$)/i.test(normalized)) {
    return { name: "docs", shellUrl: "/pages/Docs.html" };
  }

  if (/^pages\/notes(?:\/|\.|$)/i.test(normalized)) {
    return { name: "notes", shellUrl: "/pages/Notes.html" };
  }

  return null;
}

function handleSectionScript(url, onReady) {
  const section = getSectionInfo(url);
  if (!section) {
    unloadSectionScript();
    onReady?.();
    return;
  }

  loadSectionScript(section.name, onReady);
}

async function loadPage(url, skipSmoothScroll = false) {
  let content = document.getElementById("content");
  if (!content) return;

  if (!url.startsWith("/")) url = "/" + url;

  const requestId = ++activeRequestId;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const normalizedPath = url.replace(/^\/+/, "");
    const section = getSectionInfo(url);
    const isSubPartial = /^(pages\/(blogs|docs|notes)\/)/i.test(normalizedPath);
    const isSectionRoute = !!section;

    if (requestId !== activeRequestId) return;

    if (isSectionRoute) {
      handleSectionScript(url, async () => {
        if (requestId !== activeRequestId) return;

        if (isSubPartial) {
          const shellUrl = section.shellUrl;
          const shellRes = await fetch(shellUrl);
          if (!shellRes.ok) throw new Error(`HTTP ${shellRes.status}`);

          const shellHtml = await shellRes.text();
          const shellDoc = new DOMParser().parseFromString(
            shellHtml,
            "text/html",
          );

          if (requestId !== activeRequestId) return;

          injectPage(shellDoc, skipSmoothScroll, doc);

          document.dispatchEvent(
            new CustomEvent("sub-partial-load", {
              detail: { doc, html, url, skipSmoothScroll },
            }),
          );
        } else {
          setTimeout(() => injectPage(doc, skipSmoothScroll, doc), 250);
        }

        document.dispatchEvent(
          new CustomEvent("section-script-ready", {
            detail: { doc, html, url, skipSmoothScroll, isSubPartial },
          }),
        );
      });
      return;
    }

    unloadSectionScript();
    setTimeout(() => injectPage(doc, skipSmoothScroll, doc), 250);
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
    pendingScrollTarget = null;
    loadPage("/pages/home.html");
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
}

document.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);
