const themes = {
  orange: {
    accent: "#ff6a1a",
    strong: "#ff4500",
    soft: "rgba(255,69,0,0.18)",
    NavBg: "rgba(255,106,26,0.18)",
    NavBgStrong: "rgba(255,69,0,0.08)",
    buttonHover: "rgba(255,106,26,0.18)",
    buttonShadow: "rgba(255,106,26,0.22)",
    buttonBorder: "rgba(255,106,26,0.18)",
    bg: "#071014"
  },
  turquoise: {
    accent: "#00f7ff",
    strong: "#00d4e0",
    soft: "rgba(0,247,255,0.18)",
    NavBg: "rgba(0,247,255,0.18)",
    NavBgStrong: "rgba(0,212,224,0.08)",
    buttonHover: "rgba(0,247,255,0.18)",
    buttonShadow: "rgba(0,247,255,0.22)",
    buttonBorder: "rgba(0,247,255,0.18)",
    bg: "#071014"
  },
  purple: {
    accent: "#c77dff",
    strong: "#9d4edd",
    soft: "rgba(224,170,255,0.18)",
    NavBg: "rgba(199,125,255,0.18)",
    NavBgStrong: "rgba(157,78,221,0.08)",
    buttonHover: "rgba(199,125,255,0.18)",
    buttonShadow: "rgba(199,125,255,0.22)",
    buttonBorder: "rgba(199,125,255,0.18)",
    bg: "#071014"
  },
  green: {
    accent: "#39ff14",
    strong: "#2ecc71",
    soft: "rgba(125,255,106,0.18)",
    NavBg: "rgba(57,255,20,0.18)",
    NavBgStrong: "rgba(46,204,113,0.08)",
    buttonHover: "rgba(57,255,20,0.18)",
    buttonShadow: "rgba(57,255,20,0.22)",
    buttonBorder: "rgba(57,255,20,0.18)",
    bg: "#071014"
  },
  neon: {
    accent: "#ff2df7",
    strong: "#d100d1",
    soft: "rgba(255,45,247,0.18)",
    NavBg: "rgba(255,45,247,0.12)",
    NavBgStrong: "rgba(209,0,209,0.08)",
    buttonHover: "rgba(255,45,247,0.18)",
    buttonShadow: "rgba(255,45,247,0.24)",
    buttonBorder: "rgba(255,45,247,0.18)",
    bg: "#07030d"
  },
  electric: {
    accent: "#3cf0ff",
    strong: "#00b4dd",
    soft: "rgba(60,240,255,0.18)",
    NavBg: "rgba(60,240,255,0.12)",
    NavBgStrong: "rgba(0,180,221,0.08)",
    buttonHover: "rgba(60,240,255,0.18)",
    buttonShadow: "rgba(60,240,255,0.24)",
    buttonBorder: "rgba(60,240,255,0.18)",
    bg: "#061116"
  },
  acid: {
    accent: "#b1ff00",
    strong: "#86d900",
    soft: "rgba(177,255,0,0.18)",
    NavBg: "rgba(177,255,0,0.12)",
    NavBgStrong: "rgba(134,217,0,0.08)",
    buttonHover: "rgba(177,255,0,0.18)",
    buttonShadow: "rgba(177,255,0,0.22)",
    buttonBorder: "rgba(177,255,0,0.18)",
    bg: "#101306"
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
  document.documentElement.style.setProperty("--button-bg-hover", theme.buttonHover || theme.soft);
  document.documentElement.style.setProperty("--button-shadow", theme.buttonShadow || theme.soft);
  document.documentElement.style.setProperty("--button-border", theme.buttonBorder || theme.soft);

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
