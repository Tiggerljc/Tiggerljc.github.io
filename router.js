// router.js

async function loadPage(url, push = true) {
  const content = document.getElementById('content');

  // Fade out
  content.classList.add('fade-out');

  // Fetch page
  const html = await fetch(url).then(r => r.text());
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Extract new content
  const newContent = doc.querySelector('#content');
  const meta = doc.querySelector('#page-meta');

  setTimeout(() => {
    // Replace content
    content.replaceWith(newContent);
    
    // Update titlebar
    if (meta) {
      const data = JSON.parse(meta.textContent);
      document.dispatchEvent(new CustomEvent("page-title-changed", { detail: data }));
    }

    // Scroll to top
    smoothScrollToTop();

    // Fade in
    newContent.classList.add('fade-in');

    // Tell main.js that new content has loaded
    document.dispatchEvent(new Event("spa-page-loaded"));

    // Update URL
    if (push) history.pushState({}, "", url);

  }, 250);
}

// Intercept link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link || link.target === "_blank") return;

  const url = link.getAttribute('href');
  if (!url.startsWith('/')) return;

  e.preventDefault();
  loadPage(url);
});

// Back/forward
window.addEventListener('popstate', () => {
  loadPage(location.pathname, false);
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

document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname === "/" || location.pathname === "/index.html") {
    loadPage("/home.html", false);
  } else {
    loadPage(location.pathname, false);
  }
});
