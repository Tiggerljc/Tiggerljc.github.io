// router.js

async function loadPage(url) {
  let content = document.getElementById('content');
  if (!content) return;

  // Normalize URL
  if (!url.startsWith('/')) url = '/' + url;

  // Fade out
  content.classList.add('fade');

  try {
    // Fetch page
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Extract new content
    const newContent = doc.querySelector('#content');
    const meta = doc.querySelector('#page-meta');

    setTimeout(() => {
      if (!newContent) {
        content.classList.remove('fade');
        console.warn(`No #content found in ${url}`);
        return;
      }

      // Re-query in case content changed
      content = document.getElementById('content');
      if (!content) return;

      // Replace content
      content.replaceWith(newContent);
      
      // Update titlebar
      if (meta) {
        try {
          const data = JSON.parse(meta.textContent);
          document.dispatchEvent(new CustomEvent("page-title-changed", { detail: data }));
        } catch (e) {
          console.warn('Invalid page-meta JSON', e);
        }
      }

      // Scroll to top
      smoothScrollToTop();

      // Fade in
      newContent.classList.add('fade', 'visible');

      // Tell main.js that new content has loaded
      document.dispatchEvent(new Event("spa-page-loaded"));
    }, 250);
  } catch (err) {
    console.error(`Failed to load ${url}:`, err);
    content = document.getElementById('content');
    if (content) content.classList.remove('fade');
  }
}

// Intercept link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link || link.target === "_blank") return;

  const url = link.getAttribute('href');
  if (!url.startsWith('#/')) return;

  e.preventDefault();
  // Remove focus from links to prevent focus styles from sticking
  link.blur();
  location.hash = url;
});

// Smooth scroll
function smoothScrollToTop() {
  const start = document.documentElement.scrollTop;
  const duration = 350;
  const startTime = performance.now();

  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    document.documentElement.scrollTop = start * (1 - eased);
    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function handleRoute() {
  let hash = location.hash;

  if (!hash || hash === '#') {
    loadPage('/pages/home.html');
    return;
  }

  // Remove "#" or "#/"
  const path = hash.startsWith('#/') ? hash.slice(2) : hash.slice(1);

  loadPage("/" + path);
}

document.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);
