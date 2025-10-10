document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("search");
  if (!search) return;
  const cards = Array.from(document.querySelectorAll(".post-card"));

  function matchCard(card, q) {
    q = q.trim().toLowerCase();
    if (!q) return true;
    const title = card.dataset.title || "";
    const tags = card.dataset.tags || "";
    return title.toLowerCase().includes(q) || tags.toLowerCase().includes(q);
  }

  search.addEventListener("input", (e) => {
    const q = e.target.value;
    cards.forEach(c => {
      c.style.display = matchCard(c, q) ? "" : "none";
    });
  });

  // keyboard shortcut: / focuses search
  window.addEventListener("keydown", (e) => {
    if (e.key === "/") {
      e.preventDefault();
      search.focus();
    }
  });
});
