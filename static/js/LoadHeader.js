(async function(){
  const placeholder = document.getElementById('site-header');
  if (!placeholder) return;
  try {
    const res = await fetch('/templates/header.html', {cache:'no-store'});
    if (!res.ok) throw new Error('Failed to load header');
    const html = await res.text();
    placeholder.innerHTML = html;

    // wire up mobile toggle
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const shown = links.classList.toggle('show');
        toggle.setAttribute('aria-expanded', shown ? 'true' : 'false');
      });
      // close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!placeholder.contains(e.target) && links.classList.contains('show')) {
          links.classList.remove('show');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  } catch (err) {
    // silent fail; header optional
    console.error(err);
  }
})();
