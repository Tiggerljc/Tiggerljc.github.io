// sidebar.js
const sidebar = document.querySelector('.sidebar');
const panel = document.querySelector('.sidebar-panel');
const strip = document.querySelector('.sidebar-strip');
const toggle = document.querySelector('.strip-toggle');
const layout = document.querySelector('.layout');
const dim = document.querySelector('.sidebar-dim');

let userCollapsed = false; // true = intentional collapse

// --------------------------------------------------
// CLICK TOGGLE (desktop + mobile)
// --------------------------------------------------
toggle.addEventListener('click', () => {
  const isMobile = window.innerWidth <= 880;

  if (isMobile) {
    // Mobile drawer behavior
    sidebar.classList.toggle('drawer-open');
    return;
  }

  // Desktop collapse behavior
  const isCollapsed = sidebar.classList.toggle('collapsed');
  userCollapsed = isCollapsed;

  // Update header shift
  if (isCollapsed) layout.classList.remove('sidebar-expanded');
  else layout.classList.add('sidebar-expanded');
});

// --------------------------------------------------
// HOVER EXPAND/COLLAPSE (desktop only)
// --------------------------------------------------
sidebar.addEventListener('mouseenter', () => {
  if (!userCollapsed && window.innerWidth > 880) {
    sidebar.classList.remove('collapsed');
    layout.classList.add('sidebar-expanded');
  }
});

sidebar.addEventListener('mouseleave', () => {
  if (!userCollapsed && window.innerWidth > 880) {
    sidebar.classList.add('collapsed');
    layout.classList.remove('sidebar-expanded');
  }
});

// --------------------------------------------------
// BREAKPOINT BEHAVIOR
// --------------------------------------------------
function handleResize() {
  const isMobile = window.innerWidth <= 880;

  if (isMobile) {
    // Always collapsed on mobile
    sidebar.classList.add('collapsed');
    layout.classList.remove('sidebar-expanded');
    userCollapsed = false; // reset to passive
  } else {
    // Restore desktop state
    if (userCollapsed) {
      sidebar.classList.add('collapsed');
      layout.classList.remove('sidebar-expanded');
    } else {
      sidebar.classList.remove('collapsed');
      layout.classList.add('sidebar-expanded');
    }
  }
}

// --------------------------------------------------
// CLICKING DIM LAYER CLOSES DRAWER
// --------------------------------------------------
dim.addEventListener('click', () => {
  sidebar.classList.remove('drawer-open');
});

// --------------------------------------------------
// INIT
// --------------------------------------------------
window.addEventListener('resize', handleResize);
handleResize();
