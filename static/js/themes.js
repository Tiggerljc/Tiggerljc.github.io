const themes = {
  orange: {
    accent: "#ff6a1a",
    strong: "#ff4500",
    soft: "#ff8a33"
  },
  turquoise: {
    accent: "#00f7ff",
    strong: "#00d4e0",
    soft: "#66fcff"
  },
  purple: {
    accent: "#c77dff",
    strong: "#9d4edd",
    soft: "#e0aaff"
  },
  green: {
    accent: "#39ff14",
    strong: "#2ecc71",
    soft: "#7dff6a"
  }
};

function applyTheme(name) {
  const theme = themes[name];
  if (!theme) return;

  document.documentElement.style.setProperty("--theme-accent", theme.accent);
  document.documentElement.style.setProperty("--theme-accent-strong", theme.strong);
  document.documentElement.style.setProperty("--theme-accent-soft", theme.soft);

  localStorage.setItem("site-theme", name);
}

const saved = localStorage.getItem("site-theme");
if (saved && themes[saved]) {
  applyTheme(saved);
}
