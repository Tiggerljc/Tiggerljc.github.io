// All JS for blog loading and functions

function getPrimaryContent(root) {
  return root?.querySelector("#content-primary, .content-primary") || null;
}

function initBlogSection() {
  const currentPrimary = getPrimaryContent(document.querySelector("#content"));
  if (!currentPrimary) return;

  console.log("blogs section initialized");
}

function loadBlogContent(event) {
  const detail = event?.detail || {};
  const doc = detail.doc;

  if (!doc) {
    initBlogSection();
    return;
  }

  const currentPrimary = getPrimaryContent(document.querySelector("#content"));
  const newPrimary = getPrimaryContent(doc);

  if (!currentPrimary || !newPrimary) {
    console.warn(
      "Could not find the current or incoming content-primary wrapper.",
    );
    return;
  }

  const importedPrimary = document.importNode(newPrimary, true);
  currentPrimary.replaceWith(importedPrimary);
  document.dispatchEvent(new Event("spa-page-loaded"));
}

function cleanupBlogSection() {
  document.removeEventListener("section-script-ready", initBlogSection);
  document.removeEventListener("sub-partial-load", loadBlogContent);
}

window.__sectionCleanup = cleanupBlogSection;
console.log("blogs.js loaded!");
document.addEventListener("section-script-ready", initBlogSection);
document.addEventListener("sub-partial-load", loadBlogContent);
document.addEventListener("section-script-destroy", cleanupBlogSection);
