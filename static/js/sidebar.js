// sidebar.js
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.sidebar-toggle');
const layout = document.querySelector('.layout');
const dim = document.querySelector('.sidebar-dim');

let userCollapsed = false; // treat as "passive" at start

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

// Click toggle (desktop + mobile)
toggle.addEventListener('click', () => {
  const isMobile = window.innerWidth <= 880;

  if (isMobile) {
    const isOpen = sidebar.classList.toggle('drawer-open');
    if (isOpen) {
      sidebar.classList.remove('collapsed');
    } else {
      sidebar.classList.add('collapsed');
    }
    return;
  }

  const willExpand = sidebar.classList.contains('collapsed');
  setExpanded(willExpand);
});

// Hover expand/collapse (desktop only)
sidebar.addEventListener('mouseenter', () => {
  if (window.innerWidth > 880) {
    setExpanded(true); // always open on hover
  }
});

sidebar.addEventListener('mouseleave', () => {
  if (window.innerWidth > 880 && !userCollapsed) {
    setExpanded(false); // only auto-close when not explicitly collapsed
  }
});

// Resize behavior
function handleResize() {
  const isMobile = window.innerWidth <= 880;

  if (isMobile) {
    sidebar.classList.add('collapsed');
    layout.classList.remove('sidebar-expanded');
    sidebar.classList.remove('drawer-open');
  } else {
    sidebar.classList.remove('drawer-open');
    // keep current collapsed/expanded state; hover/click manage it
  }
}

// Dim click closes drawer
dim.addEventListener('click', () => {
  sidebar.classList.remove('drawer-open');
  sidebar.classList.add('collapsed');
});

// Init
sidebar.classList.add('collapsed');
handleResize();
window.addEventListener('resize', handleResize);
