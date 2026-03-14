// sidebar.js
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.sidebar-toggle');
const layout = document.querySelector('.layout');
const dim = document.querySelector('.sidebar-dim');

let userCollapsed = true; // start collapsed

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
    sidebar.classList.toggle('drawer-open');
    // drawer-open implies expanded visually
    if (sidebar.classList.contains('drawer-open')) {
      setExpanded(true);
    } else {
      setExpanded(true); // keep expanded state but hide via drawer
    }
    return;
  }

  const willExpand = sidebar.classList.contains('collapsed');
  setExpanded(willExpand);
});

// Hover expand/collapse (desktop only)
sidebar.addEventListener('mouseenter', () => {
  if (window.innerWidth > 880 && userCollapsed === false) {
    setExpanded(true);
  }
});

sidebar.addEventListener('mouseleave', () => {
  if (window.innerWidth > 880 && userCollapsed === false) {
    setExpanded(false);
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
    // desktop: respect userCollapsed
    if (userCollapsed) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }
}

// Dim click closes drawer
dim.addEventListener('click', () => {
  sidebar.classList.remove('drawer-open');
});

// Init
sidebar.classList.add('collapsed');
handleResize();
window.addEventListener('resize', handleResize);
