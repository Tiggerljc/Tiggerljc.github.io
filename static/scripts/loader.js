import { loadComponent } from "/static/scripts/components.js";

// HEADER
loadComponent({
  target: "site-header",
  url: "/templates/components/header.html",
  callback: (root) => {
    const toggle = root.querySelector("#nav-toggle");
    const links = root.querySelector("#nav-links");

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const shown = links.classList.toggle("show");
        toggle.setAttribute("aria-expanded", shown);
      });

      document.addEventListener("click", (e) => {
        if (!root.contains(e.target) && links.classList.contains("show")) {
          links.classList.remove("show");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  }
});

// SIDEBAR
loadComponent({
  target: "site-sidebar",
  url: "/templates/components/sidebar.html",
  callback: (root) => {
    root.outerHTML = root.innerHTML;
    import("/static/scripts/sidebar.js");
  }
});

// TITLEBAR
loadComponent({
  target: "site-titlebar",
  url: "/templates/components/titlebar.html"
});

// FOOTER
loadComponent({
  target: "site-footer",
  url: "/templates/components/footer.html"
});
