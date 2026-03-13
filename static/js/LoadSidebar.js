// LoadSidebar.js
fetch('/templates/sidebar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('site-sidebar').innerHTML = html;

    // Now that the sidebar exists, load the behavior script
    const script = document.createElement('script');
    script.src = '/static/js/sidebar.js';
    document.body.appendChild(script);
  });
