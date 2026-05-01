const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.sidebar-toggle');
const layout = document.querySelector('.layout');
const dim = document.querySelector('.sidebar-dim');

// Read sidebar mode
let sidebarMode = localStorage.getItem('sidebar-mode') || 'default';

// Mode flags
let isStaticOpen, isStaticClosed, isHoverOnly, isToggleOnly;

// Hover intent timer
let hoverTimer = null;

// Tracks whether user explicitly collapsed via toggle
let userCollapsed = false;

function updateModeFlags(mode) {
  sidebarMode = mode;
  isStaticOpen   = mode === 'static-open';
  isStaticClosed = mode === 'static-closed';
  isHoverOnly    = mode === 'hover';
  isToggleOnly   = mode === 'toggle';

  applySidebarBehavior();
}

function applySidebarBehavior() {
  // Reset
  toggle.style.display = "";
  sidebar.classList.remove('collapsed');
  layout.classList.remove('sidebar-expanded');

  // Always re-enable hover listeners (we may disable them later)
  sidebar.addEventListener('mouseenter', onHoverEnter);
  sidebar.addEventListener('mouseleave', onHoverLeave);

  // DEFAULT MODE
  if (sidebarMode === 'default') {
    sidebar.classList.add('collapsed');
    return;
  }

  // STATIC OPEN
  if (isStaticOpen) {
    sidebar.classList.remove('collapsed');
    layout.classList.add('sidebar-expanded');
    toggle.style.display = "none";
    return;
  }

  // STATIC CLOSED
  if (isStaticClosed) {
    sidebar.classList.add('collapsed');
    toggle.style.display = "none";
    return;
  }

  // HOVER ONLY
  if (isHoverOnly) {
    sidebar.classList.add('collapsed');
    toggle.style.display = "none";
    return;
  }

  // TOGGLE ONLY
  if (isToggleOnly) {
    sidebar.classList.add('collapsed');
    sidebar.removeEventListener('mouseenter', onHoverEnter);
    sidebar.removeEventListener('mouseleave', onHoverLeave);
    return;
  }
}

function setExpanded(expanded) {
  if (expanded) {
    sidebar.classList.remove('collapsed');
    layout.classList.add('sidebar-expanded');
    userCollapsed = false;
  } else {
    sidebar.classList.add('collapsed');
    layout.classList.remove('sidebar-expanded');
    userCollapsed = true;
  }
}

function autoCollapse() {
  sidebar.classList.add('collapsed');
  layout.classList.remove('sidebar-expanded');
  // DO NOT set userCollapsed = true
}

// HOVER INTENT HANDLERS
function onHoverEnter() {
  if (isStaticOpen || isStaticClosed || isToggleOnly) return;
  if (window.innerWidth <= 880) return;

  clearTimeout(hoverTimer);

  if (!userCollapsed) {
    hoverTimer = setTimeout(() => {
      setExpanded(true);   // <-- correct
    }, 250);
  }
}

function onHoverLeave() {
  if (isStaticOpen || isStaticClosed || isToggleOnly) return;
  if (window.innerWidth <= 880) return;

  clearTimeout(hoverTimer);

  if (!userCollapsed) {
    autoCollapse();   // <-- correct
  }
}

// Toggle button
toggle.addEventListener('click', () => {
  if (isStaticOpen || isStaticClosed || isHoverOnly) return;

  const isMobile = window.innerWidth <= 880;

  if (isMobile) {
    const isOpen = sidebar.classList.toggle('drawer-open');
    if (isOpen) sidebar.classList.remove('collapsed');
    else sidebar.classList.add('collapsed');
    return;
  }

  const willExpand = sidebar.classList.contains('collapsed');
  setExpanded(willExpand); // this sets userCollapsed correctly
});

// Resize
function handleResize() {
  const isMobile = window.innerWidth <= 880;

  if (isMobile) {
    sidebar.classList.add('collapsed');
    layout.classList.remove('sidebar-expanded');
    sidebar.classList.remove('drawer-open');
  } else {
    sidebar.classList.remove('drawer-open');
  }
}

dim.addEventListener('click', () => {
  sidebar.classList.remove('drawer-open');
  sidebar.classList.add('collapsed');
});

// Init
updateModeFlags(sidebarMode);
handleResize();
window.addEventListener('resize', handleResize);

// Listen for mode changes
document.addEventListener("sidebar-mode-changed", (e) => {
  updateModeFlags(e.detail.mode);
});
