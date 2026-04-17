const themes = {
  orange: {
    accent: "#ff6a1a",
    strong: "#ff4500",
    soft: "rgba(255,69,0,0.18)",
    NavBg: "rgba(255,106,26,0.18)",
    NavBgStrong: "rgba(255,69,0,0.08)"

  },
  turquoise: {
    accent: "#00f7ff",
    strong: "#00d4e0",
    soft: "rgba(0,247,255,0.18)",
    NavBg: "rgba(0,247,255,0.18)",
    NavBgStrong: "rgba(0,212,224,0.08)"
  },
  purple: {
    accent: "#c77dff",
    strong: "#9d4edd",
    soft: "rgba(224,170,255,0.18)",
    NavBg: "rgba(199,125,255,0.18)",
    NavBgStrong: "rgba(157,78,221,0.08)"
  },
  green: {
    accent: "#39ff14",
    strong: "#2ecc71",
    soft: "rgba(125,255,106,0.18)",
    NavBg: "rgba(57,255,20,0.18)",
    NavBgStrong: "rgba(46,204,113,0.08)"
  }
};

function applyTheme(name) {
  const theme = themes[name];
  if (!theme) return;

  document.documentElement.style.setProperty("--theme-accent", theme.accent);
  document.documentElement.style.setProperty("--theme-strong", theme.strong);
  document.documentElement.style.setProperty("--theme-soft", theme.soft);
  document.documentElement.style.setProperty("--nav-bg", theme.NavBg);
  document.documentElement.style.setProperty("--nav-bg-strong", theme.NavBgStrong);

  // Update filler images with new theme colors
  updateFillerImages(theme);

  localStorage.setItem("site-theme", name);
}

const saved = localStorage.getItem("site-theme");
if (saved && themes[saved]) {
  applyTheme(saved);
} else {
  updateFillerImages(themes.orange);
}
