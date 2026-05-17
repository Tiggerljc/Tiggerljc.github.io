const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".sidebar-toggle");

// Read sidebar mode
let sidebarMode = localStorage.getItem("sidebar-mode") || "default";

// Sidebar modes
let isStaticOpen, isStaticClosed, isHoverOnly, isToggleOnly;

// Hover timer
let hoverTimer = null;

// Tracks whether user explicitly collapsed via toggle
let userCollapsed = false;

function updateSidebarMode(mode) {
  sidebarMode = mode;
  isStaticOpen = mode === "static-open";
  isStaticClosed = mode === "static-closed";
  isHoverOnly = mode === "hover";
  isToggleOnly = mode === "toggle";

  // Reset userCollapsed when switching to default mode
  if (mode === "default") {
    userCollapsed = false;
  }

  applySidebarBehavior();
  updateNavWidth();
}

function applySidebarBehavior() {
  // Reset
  toggle.style.display = "";

  // Always re-enable hover listeners (we may disable them later)
  sidebar.addEventListener("mouseenter", onHoverEnter);
  sidebar.addEventListener("mouseleave", onHoverLeave);

  // DEFAULT MODE -- uses root function behavior, adds .collapsed to ensure initial state is collapsed
  if (sidebarMode === "default") {
    sidebar.classList.add("collapsed");
    return;
  }

  // STATIC OPEN
  if (isStaticOpen) {
    sidebar.classList.remove("collapsed");
    toggle.style.display = "none";
    return;
  }

  // STATIC CLOSED
  if (isStaticClosed) {
    sidebar.classList.add("collapsed");
    toggle.style.display = "none";
    return;
  }

  // HOVER ONLY
  if (isHoverOnly) {
    sidebar.classList.add("collapsed");
    toggle.style.display = "none";
    return;
  }

  // TOGGLE ONLY
  if (isToggleOnly) {
    sidebar.classList.add("collapsed");
    sidebar.removeEventListener("mouseenter", onHoverEnter);
    sidebar.removeEventListener("mouseleave", onHoverLeave);
    return;
  }
}

function setExpanded(expanded) {
  if (expanded) {
    sidebar.classList.remove("collapsed");
    userCollapsed = false;
  } else {
    sidebar.classList.add("collapsed");
    userCollapsed = true;
  }
}

function autoCollapse() {
  sidebar.classList.add("collapsed");
}

// HOVER INTENT HANDLERS
function onHoverEnter() {
  if (isStaticOpen || isStaticClosed || isToggleOnly) return;
  clearTimeout(hoverTimer);
  if (!userCollapsed) {
    hoverTimer = setTimeout(() => {
      setExpanded(true);
      updateNavWidth();
    }, 250);
  }
}

function onHoverLeave() {
  if (isStaticOpen || isStaticClosed || isToggleOnly) return;
  clearTimeout(hoverTimer);
  if (!userCollapsed) {
    autoCollapse();
    updateNavWidth();
  }
}

// Toggle button
toggle.addEventListener("click", () => {
  if (isStaticOpen || isStaticClosed || isHoverOnly) return;
  const willExpand = sidebar.classList.contains("collapsed");
  setExpanded(willExpand);
  updateNavWidth();
});

// SIDEBAR CONTENT LOADERS
// Local Loader
function loadLocal() {
  const sidebarLocal = window.sidebarLocal;
  if (!sidebarLocal) {
    // Inject message saying no ToC on this page
    return;
  }
  const local = document.querySelector(".sidebar-local");
  // Inject into local
}

// Global Loader

// Init
updateSidebarMode(sidebarMode);
updateNavWidth();

// Listen for mode changes
document.addEventListener("sidebar-mode-changed", (e) => {
  updateSidebarMode(e.detail.mode);
  updateNavWidth();
});
