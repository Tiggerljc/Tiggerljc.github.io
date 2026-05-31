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

// =====
//  ToC
// =====
function getHeadings() {
  // Content container
  const content = document.querySelector(".content");
  if (!content) return;

  // Headings
  const headings = content.querySelectorAll("h2, h3, h4");

  const info = [...headings].map((h) => ({
    element: h,
    level: parseInt(h.tagName.substring(1)),
    id: h.id,
    title: h.textContent.trim(),
  }));

  return info;
}

function injectToC() {
  // Sidebar element
  const ToC = document.getElementById("ToC");
  if (!ToC) return;

  // Headings
  const headings = getHeadings();

  // Clear previous ToC before creating new elements
  ToC.innerHTML = "";

  // Get current page without queries so hrefs don't cascade queries
  const currentPage = getURL().split("?")[0];

  // Create a "Scroll to Top" element before the header index loop runs
  // Container & link
  const top = document.createElement("a");
  top.href = currentPage + "?scroll=top";
  // Image
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-arrow-up");
  // Text
  const title = document.createElement("span");
  title.innerHTML = "Back to Top";
  title.classList.add("label");
  // Append
  top.appendChild(icon);
  top.appendChild(title);
  ToC.appendChild(top);

  for (let h = 0; h < headings.length; h++) {
    const cursor = headings[h];

    // ToC Items
    const item = document.createElement("a");

    // Ensure ID exists; if not, create it from title
    if (!cursor.id) {
      const id = cursor.title.toLowerCase().replace(/\s+/g, "-");
      cursor.id = id;
      cursor.element.id = id;
    }

    // Create link
    item.href = currentPage + "?scroll=" + cursor.id;

    // Create images

    // Custom SVGs
    // const icon = document.createElement("img");
    // icon.src = `/static/img/sidebar/h${cursor.level}.svg`;
    // icon.classList.add("icon");

    // Google Icons
    const icon = document.createElement("span");
    icon.classList.add("material-symbols-rounded");
    icon.innerHTML = "short_text";

    // Create title
    const title = document.createElement("span");
    title.innerHTML = cursor.title;
    title.classList.add("label");

    // Append Content
    item.appendChild(icon);
    item.appendChild(title);
    ToC.appendChild(item);
  }

  if (!ToC.dataset.tocClickBound) {
    ToC.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      e.preventDefault();
      const href = a.getAttribute("href");
      const params = new URLSearchParams(href.split("?")[1] || "");
      const id = params.get("scroll");
      if (!id) return;
      pendingScrollTarget = id;
      location.hash = href;
      scrollToTarget(id);
    });
    ToC.dataset.tocClickBound = "true";
  }

  if (pendingScrollTarget) {
    const fallbackTarget = decodeURIComponent(pendingScrollTarget);
    if (document.getElementById(fallbackTarget)) {
      scrollToTarget(pendingScrollTarget);
      pendingScrollTarget = null;
    }
  }
}

// Scroll logic
function scrollToTarget(target) {
  let id = decodeURIComponent(target);
  const el = document.getElementById(id);
  if (!el) return;
  const yOffset = el.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({
    top: yOffset,
    behavior: "smooth",
  });
}

// ToC listeners
document.addEventListener("spa-page-loaded", () => {
  injectToC();

  if (pendingScrollTarget) {
    scrollToTarget(pendingScrollTarget);
    console.log("spa-page-loaded " + pendingScrollTarget);
    pendingScrollTarget = null;
  }
});

document.addEventListener("scroll-updated", (e) => {
  const scrollTarget = e.detail;
  console.log(
    "scroll-updated | pendingScrollTarget= " +
      pendingScrollTarget +
      " scrollTarget= " +
      scrollTarget,
  );
  scrollToTarget(scrollTarget);
});

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
