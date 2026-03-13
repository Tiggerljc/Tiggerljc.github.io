// sidebar.js
const sidebar = document.querySelector('.sidebar');
const panel = document.querySelector('.sidebar-panel');
const strip = document.querySelector('.sidebar-strip');
const toggle = document.querySelector('.strip-toggle');

let userCollapsed = false; // true = intentional collapse

// --- Click toggle ---
toggle.addEventListener('click', () => {
  const isCollapsed = sidebar.classList.toggle('collapsed');
  userCollapsed = isCollapsed; // user intent
});

// --- Hover expand (desktop only) ---
strip.addEventListener('mouseenter', () => {
  if (!userCollapsed && window.innerWidth > 880) {
    sidebar.classList.remove('collapsed');
  }
});

strip.addEventListener('mouseleave', () => {
  if (!userCollapsed && window.innerWidth > 880) {
    sidebar.classList.add('collapsed');
  }
});

// --- Breakpoint behavior ---
function handleResize() {
  if (window.innerWidth <= 880) {
    sidebar.classList.add('collapsed');
    userCollapsed = false; // reset to passive
  } else {
    if (userCollapsed) sidebar.classList.add('collapsed');
    else sidebar.classList.remove('collapsed');
  }
}

// --- Mobile drawer toggle ---
toggle.addEventListener('click', () => {
  if (window.innerWidth <= 880) {
    sidebar.classList.toggle('drawer-open');
  }
});

// --- Clicking dim closes drawer ---
document.querySelector('.sidebar-dim').addEventListener('click', () => {
  sidebar.classList.remove('drawer-open');
});

window.addEventListener('resize', handleResize);
handleResize();
