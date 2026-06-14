document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("search");
  if (!search) return;
  const cards = Array.from(document.querySelectorAll(".post-card"));

  function matchCard(card, q) {
    q = q.trim().toLowerCase();
    if (!q) return true;
    const title = card.dataset.title || "";
    const tags = card.dataset.tags || "";
    return title.toLowerCase().includes(q) || tags.toLowerCase().includes(q);
  }

  search.addEventListener("input", (e) => {
    const q = e.target.value;
    cards.forEach((c) => {
      c.style.display = matchCard(c, q) ? "" : "none";
    });
  });

  // keyboard shortcut: / focuses search
  window.addEventListener("keydown", (e) => {
    if (e.key === "/") {
      e.preventDefault();
      search.focus();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------
  // Layout & Sidebar Settings
  // --------------------------
  const layout = document.querySelector(".layout");
  const sidebar = document.querySelector(".sidebar");

  // --------------------------
  // Apply Layout Mode
  // --------------------------
  function applyLayoutMode(mode) {
    if (!layout) return;
    layout.classList.remove("full", "wide", "compact");
    if (mode !== "normal") layout.classList.add(mode);
    updateNavWidth();
  }

  // --------------------------
  // Apply Sidebar Mode
  // --------------------------
  function applySidebarMode(mode) {
    if (!sidebar) return;
    sidebar.classList.remove(
      "default",
      "static-open",
      "static-closed",
      "hover",
      "toggle",
    );
    sidebar.classList.add(mode);
  }

  // --------------------------
  // Load Saved Settings
  // --------------------------
  function loadSettings() {
    const layoutMode = localStorage.getItem("layout-mode") || "normal";
    const sidebarMode = localStorage.getItem("sidebar-mode") || "default";

    applyLayoutMode(layoutMode);
    applySidebarMode(sidebarMode);

    // Sync dropdowns if on Settings page
    const layoutSelect = document.getElementById("layout-mode");
    const sidebarSelect = document.getElementById("sidebar-mode");

    if (layoutSelect) layoutSelect.value = layoutMode;
    if (sidebarSelect) sidebarSelect.value = sidebarMode;
  }

  // --------------------------
  // Save + Apply on Change
  // --------------------------
  document.addEventListener("change", (e) => {
    if (e.target.id === "layout-mode") {
      const mode = e.target.value;
      localStorage.setItem("layout-mode", mode);
      applyLayoutMode(mode);
    }

    if (e.target.id === "sidebar-mode") {
      const mode = e.target.value;
      localStorage.setItem("sidebar-mode", mode);
      applySidebarMode(mode);

      document.dispatchEvent(
        new CustomEvent("sidebar-mode-changed", {
          detail: { mode },
        }),
      );
    }
  });

  loadSettings();
});

// Fade page
function applyFadeIns() {
  const fadeEls = document.querySelectorAll(".fade");

  // Reset all fade elements
  fadeEls.forEach((el) => el.classList.remove("visible"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // optional: stop observing once visible
        }
      });
    },
    { threshold: 0.15 },
  );

  fadeEls.forEach((el) => observer.observe(el));
}

// Wrap images procedurally
function wrapImages(selector = "img") {
  document.querySelectorAll(selector).forEach((img) => {
    // Check if image is supposed to be wrapped
    if (img.classList.contains("no-wrap")) return;

    // Handle wrapper already exists
    if (img.closest(".img-wrapper")) return;

    // Create wrapper
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "img-wrapper";

    // Handle wrapper modes at runtime
    if (img.classList.contains("banner")) imgWrapper.classList.add("banner");

    // Insert image into wrapper
    img.parentNode.insertBefore(imgWrapper, img);
    imgWrapper.appendChild(img);

    // Get natural width and height of image and compute correct height based off of them
    function updateWrapperHeight() {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      if (!naturalWidth || !naturalHeight) return;

      const width = imgWrapper.clientWidth;
      imgWrapper.style.height = `${(naturalHeight / naturalWidth) * width}px`;
    }

    // Run image computation; if image doesn't yet exist, wait till it does
    if (img.complete) {
      updateWrapperHeight();
    } else {
      img.addEventListener("load", updateWrapperHeight);
    }

    window.addEventListener("resize", updateWrapperHeight);
  });
}

// Navbar Width
function getSidebarWidth() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar.classList.contains("collapsed")) {
    return 72;
  } else return 212;
}

function getLayoutWidth() {
  const layout = document.querySelector(".layout");
  if (layout.classList.contains("full")) {
    return window.innerWidth;
  }
  return layout.getBoundingClientRect().width;
}

function navbarWidth() {
  const layoutWidth = getLayoutWidth();
  const sidebarWidth = getSidebarWidth();
  return layoutWidth - sidebarWidth * 2;
}

window.updateNavWidth = function updateNavWidth() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  const width = navbarWidth();
  navbar.style.maxWidth = width + "px";
};

// Listeners
document.addEventListener("DOMContentLoaded", () => {
  applyFadeIns();
  wrapImages();
});

document.addEventListener("spa-page-loaded", () => {
  applyFadeIns();
  const saved = localStorage.getItem("site-theme");
  if (saved && themes[saved]) {
    updateFillerImages(themes[saved]);
  }
  wrapImages();
});

document.addEventListener("page-title-changed", (e) => {
  const title = e.detail.title || "Tigger.dev";
  document.title = `${title} - Tigger.dev`;
  const titleElement = document.getElementById("page-title");
  if (titleElement) titleElement.textContent = title;
});

window.addEventListener("resize", updateNavWidth);
