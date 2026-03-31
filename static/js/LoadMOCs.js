async function loadMOCs() {
  const container = document.querySelector('.moc-grid');
  if (!container) return;

  // List of MOC pages (you will update this manually for now)
  const mocFiles = [
    '/Main/MOCs/moc-1.html',
    '/Main/MOCs/moc-2.html',
    '/Main/MOCs/moc-3.html',
    '/Main/MOCs/moc-4.html',
    '/Main/MOCs/moc-5.html',
    '/Main/MOCs/moc-6.html',
    '/Main/MOCs/moc-7.html',
    '/Main/MOCs/moc-8.html',
    '/Main/MOCs/moc-9.html',
    '/Main/MOCs/moc-10.html',
    '/Main/MOCs/moc-11.html',
    '/Main/MOCs/moc-12.html',
    '/Main/MOCs/moc-13.html',
    '/Main/MOCs/moc-14.html',
    '/Main/MOCs/moc-15.html',
    '/Main/MOCs/moc-16.html',
    '/Main/MOCs/moc-17.html',
    '/Main/MOCs/moc-18.html',
    '/Main/MOCs/moc-19.html',
    '/Main/MOCs/moc-20.html'
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
        <img src="${meta.image}" alt="${meta.title}">
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
