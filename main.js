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
    cards.forEach(c => {
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
  const layout = document.querySelector('.layout');
  const sidebar = document.querySelector('.sidebar');

  // --------------------------
  // Apply Layout Mode
  // --------------------------
  function applyLayoutMode(mode) {
    if (!layout) return;
    layout.classList.remove('full', 'wide', 'compact');
    if (mode !== 'normal') layout.classList.add(mode);
  }

  // --------------------------
  // Apply Sidebar Mode
  // --------------------------
  function applySidebarMode(mode) {
    if (!sidebar) return;
    sidebar.classList.remove(
      'default',
      'static-open',
      'static-closed',
      'hover',
      'toggle'
    );
    sidebar.classList.add(mode);
  }

  // --------------------------
  // Load Saved Settings
  // --------------------------
  function loadSettings() {
    const layoutMode = localStorage.getItem('layout-mode') || 'normal';
    const sidebarMode = localStorage.getItem('sidebar-mode') || 'default';

    applyLayoutMode(layoutMode);
    applySidebarMode(sidebarMode);

    // Sync dropdowns if on Settings page
    const layoutSelect = document.getElementById('layout-mode');
    const sidebarSelect = document.getElementById('sidebar-mode');

    if (layoutSelect) layoutSelect.value = layoutMode;
    if (sidebarSelect) sidebarSelect.value = sidebarMode;
  }

  // --------------------------
  // Save + Apply on Change
  // --------------------------
  document.addEventListener('change', (e) => {
    if (e.target.id === 'layout-mode') {
      const mode = e.target.value;
      localStorage.setItem('layout-mode', mode);
      applyLayoutMode(mode);
    }

    if (e.target.id === 'sidebar-mode') {
      const mode = e.target.value;
      localStorage.setItem('sidebar-mode', mode);
      applySidebarMode(mode);

      document.dispatchEvent(new CustomEvent("sidebar-mode-changed", {
      detail: { mode }
      }));
    }
  });

  loadSettings();
});

function applyFadeIns() {
  const fadeEls = document.querySelectorAll('.fade');

  // Reset all fade elements
  fadeEls.forEach(el => el.classList.remove('visible'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
         observer.unobserve(entry.target); // optional: stop observing once visible
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  applyFadeIns();
});

// Listen for SPA navigation
document.addEventListener("spa-page-loaded", () => {
  applyFadeIns();
  const saved = localStorage.getItem("site-theme");
  if (saved && themes[saved]) {
    updateFillerImages(themes[saved]);
  }
});

// Update the page title dynamically
document.addEventListener("page-title-changed", (e) => {
  const title = e.detail.title || "Tigger.dev";
  document.title = `${title} - Tigger.dev`;
  const titleElement = document.getElementById("page-title");
  if (titleElement) titleElement.textContent = title;
});
