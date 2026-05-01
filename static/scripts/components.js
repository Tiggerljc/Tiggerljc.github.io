/**
 * Generic component loader
 * Loads HTML into a target element, optionally runs a callback,
 * and optionally loads a behavior script.
 */
export async function loadComponent({
  target,
  url,
  script = null,
  callback = null,
  cache = "no-store"
}) {
  const el = document.getElementById(target);
  if (!el) return; // Lazy loading: only load if present

  try {
    const res = await fetch(url, { cache });
    if (!res.ok) throw new Error(`Failed to load ${url}`);

    const html = await res.text();
    el.innerHTML = html;

    // Load behavior script if provided
    if (script) {
      const s = document.createElement("script");
      s.src = script;
      document.body.appendChild(s);
    }

    // Run callback if provided
    if (callback) callback(el);

  } catch (err) {
    console.error(`Component load error (${target}):`, err);
  }
}
