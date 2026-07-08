// All JS for documentation loading and functions

function getPrimaryContent(root) {
  return root?.querySelector("#content-primary, .content-primary") || null;
}

function initDocsSection() {
  const currentPrimary = getPrimaryContent(document.querySelector("#content"));
  if (!currentPrimary) return;

  console.log("docs section initialized");
}

function loadDocsContent(event) {
  const detail = event?.detail || {};
  const doc = detail.doc;

  if (!doc) {
    initDocsSection();
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

function cleanupDocsSection() {
  document.removeEventListener("section-script-ready", initDocsSection);
  document.removeEventListener("sub-partial-load", loadDocsContent);
}

window.__sectionCleanup = cleanupDocsSection;
console.log("docs.js loaded!");
document.addEventListener("section-script-ready", initDocsSection);
document.addEventListener("sub-partial-load", loadDocsContent);
document.addEventListener("section-script-destroy", cleanupDocsSection);
