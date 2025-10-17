(async function(){
  const placeholder = document.getElementById('site-sidebar');
  if (!placeholder) return;

  try {
    const res = await fetch('/templates/sidebar.html', {cache:'no-store'});
    if (!res.ok) throw new Error('Sidebar load failed');
    const html = await res.text();
    placeholder.innerHTML = html;

    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.site-sidebar');

    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        const collapsed = sidebar.classList.toggle('collapsed');
        toggle.setAttribute('aria-expanded', !collapsed);
      });
    }
  } catch (err) {
    console.error(err);
  }
})();
