const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.sidebar-toggle');
const layout = document.querySelector('.layout');
const dim = document.querySelector('.sidebar-dim');

// Read sidebar mode
let sidebarMode = localStorage.getItem('sidebar-mode') || 'default';

// Mode flags
let isStaticOpen, isStaticClosed, isHoverOnly, isToggleOnly;

function updateModeFlags(mode) {
  sidebarMode = mode;
  isStaticOpen   = mode === 'static-open';
  isStaticClosed = mode === 'static-closed';
  isHoverOnly    = mode === 'hover';
  isToggleOnly   = mode === 'toggle';

  applySidebarBehavior();
}

function applySidebarBehavior() {
  // Reset everything
  toggle.style.display = "";
  sidebar.classList.remove('collapsed');
  layout.classList.remove('sidebar-expanded');

  // Always re-enable hover listeners (we may disable them later)
  sidebar.addEventListener('mouseenter', hoverOpen);
  sidebar.addEventListener('mouseleave', hoverClose);

  // DEFAULT MODE
  if (sidebarMode === 'default') {
    sidebar.classList.add('collapsed'); // default starts collapsed
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
    sidebar.removeEventListener('mouseenter', hoverOpen);
    sidebar.removeEventListener('mouseleave', hoverClose);
    return;
  }
}

let userCollapsed = false;

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

// Named hover handlers
function hoverOpen() {
  if (isStaticOpen || isStaticClosed || isToggleOnly) return;

  // Prevent auto-open on page load
  if (!sidebar.matches(':hover')) return;

  if (window.innerWidth > 880) setExpanded(true);
}

function hoverClose() {
  if (isStaticOpen || isStaticClosed || isToggleOnly) return;
  if (window.innerWidth > 880 && !userCollapsed) setExpanded(false);
}

// Attach hover listeners
sidebar.addEventListener('mouseenter', hoverOpen);
sidebar.addEventListener('mouseleave', hoverClose);

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
  setExpanded(willExpand);
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
updateModeFlags(sidebarMode); // handles collapsed/open state
handleResize();
window.addEventListener('resize', handleResize);

// Listen for mode changes
document.addEventListener("sidebar-mode-changed", (e) => {
  updateModeFlags(e.detail.mode);
});
