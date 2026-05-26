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

// =============
//  BREADCRUMBS
// =============
// Get JSON file (returns a JS object)
async function getTree() {
  return fetch("/static/data/breadcrumbs.json").then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
}
// Get URL
function getURL() {
  const url = window.location.hash;
  return url;
}
// Recursive search function
function searchNode(node, targetHref) {
  // Get base
  if (node.href === targetHref) {
    return [node];
  }
  // Loop through children
  for (const key in node.children) {
    const child = node.children[key];

    // Recursively search child
    const found = searchNode(child, targetHref);

    // If found, prepend current node
    if (found) {
      return [node, ...found];
    }
  }
  // Not found in subtree
  return null;
}
// Render the breadcrumb list in the sidebar through DOM
function renderBreadcrumbs(path) {
  // Get global sidebar container
  const breadcrumbs = document.querySelector(".breadcrumbs");
  if (!breadcrumbs || !path) return;
  // Clear old breadcrumbs
  breadcrumbs.innerHTML = "";

  const lastIndex = path.length - 1;

  // Loop through path array and create DOM elements for each node
  for (let i = 0; i < path.length; i++) {
    const crumb = document.createElement("div");
    crumb.classList.add("crumb");
    crumb.style.setProperty("--depth", `${i * 12}px`);

    const node = path[i];
    if (i < lastIndex) {
      // Links
      const link = document.createElement("a");
      link.href = node.href;
      link.textContent = node.title;
      crumb.appendChild(link);

      // Arrows
      const arrow = document.createElement("span");
      arrow.classList.add("arrow");
      arrow.textContent = ">";
      crumb.appendChild(arrow);
    } else {
      // Keep last item from being a link
      const currentPage = document.createElement("span");
      currentPage.classList.add("current-page");
      currentPage.textContent = node.title;

      crumb.appendChild(currentPage);
    }
    // Append crumbs into container
    breadcrumbs.appendChild(crumb);
  }
}
// Search JSON tree for current url and render breadcrumbs
function updateBreadcrumbs(url) {
  getTree().then((tree) => {
    const path = searchNode(tree.home, url);
    renderBreadcrumbs(path);

    // Get collapsed heigth and set it as container height
    const breadcrumbs = document.querySelector(".breadcrumbs");
    if (sidebar.classList.contains("collapsed")) {
      requestAnimationFrame(() => {
        if (!sidebar || !breadcrumbs) return;

        breadcrumbs.style.removeProperty("--height");
        const height = breadcrumbs.scrollHeight;
        breadcrumbs.style.setProperty("--height", `${height}px`);
      });
    } else {
      breadcrumbs.style.removeProperty("--height");
    }
  });
}
// Get the current url and update breadcrumbs on SPA load
document.addEventListener("spa-page-loaded", () => {
  const url = getURL();
  updateBreadcrumbs(url);
});

// Toggle button
// document.querySelector(".crumb-toggle").addEventListener("click", () => {
//   const bc = document.querySelector(".breadcrumbs");
//   bc.classList.toggle("collapsed");

//   const btn = document.querySelector(".crumb-toggle");
//   btn.textContent = bc.classList.contains("collapsed") ? ">" : "v";
// });

// ======
//  INIT
// ======
updateSidebarMode(sidebarMode);
updateNavWidth();

// Listen for mode changes
document.addEventListener("sidebar-mode-changed", (e) => {
  updateSidebarMode(e.detail.mode);
  updateNavWidth();
});
