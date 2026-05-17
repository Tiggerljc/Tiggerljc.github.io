import { loadComponent } from "/static/scripts/components.js";

// NAVBAR
loadComponent({
  target: "navbar",
  url: "/templates/components/navbar.html",
  callback: (root) => {
    const links = root.querySelector("#nav-links");
  },
});

// SIDEBAR
loadComponent({
  target: "sidebar",
  url: "/templates/components/sidebar.html",
  callback: (root) => {
    root.outerHTML = root.innerHTML;
    import("/static/scripts/sidebar.js");
  },
});

// TITLEBAR
loadComponent({
  target: "titlebar",
  url: "/templates/components/titlebar.html",
});

// FOOTER
loadComponent({
  target: "footer",
  url: "/templates/components/footer.html",
});
