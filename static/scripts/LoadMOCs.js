async function loadMOCs() {
  const container = document.querySelector('.moc-grid');
  if (!container) return;

  // List of MOC pages (you will update this manually for now)
  const mocFiles = [
    '/pages/MOCs/moc-1.html',
    '/pages/MOCs/moc-2.html',
    '/pages/MOCs/moc-3.html',
    '/pages/MOCs/moc-4.html',
    '/pages/MOCs/moc-5.html',
    '/pages/MOCs/moc-6.html',
    '/pages/MOCs/moc-7.html',
    '/pages/MOCs/moc-8.html',
    '/pages/MOCs/moc-9.html',
    '/pages/MOCs/moc-10.html',
    '/pages/MOCs/moc-11.html',
    '/pages/MOCs/moc-12.html',
    '/pages/MOCs/moc-13.html',
    '/pages/MOCs/moc-14.html',
    '/pages/MOCs/moc-15.html',
    '/pages/MOCs/moc-16.html',
    '/pages/MOCs/moc-17.html',
    '/pages/MOCs/moc-18.html',
    '/pages/MOCs/moc-19.html',
    '/pages/MOCs/moc-20.html'
  ];

  for (const file of mocFiles) {
    const res = await fetch(file);
    const text = await res.text();

    // Extract the JSON metadata block
    const metaMatch = text.match(/<script id="moc-meta"[^>]*>([\s\S]*?)<\/script>/);
    if (!metaMatch) continue;

    const meta = JSON.parse(metaMatch[1]);

    // Build the card
    const card = document.createElement('a');
    card.className = 'moc-card';
    card.href = file;

    card.innerHTML = `
      <div class="moc-image">
        <div class="filler-img" data-alt="${meta.title}"></div>
      </div>
      <div class="moc-content">
        <h3>${meta.title}</h3>
        <p>${meta.description}</p>
      </div>
    `;

    container.appendChild(card);
  }
}

document.addEventListener('DOMContentLoaded', loadMOCs);
