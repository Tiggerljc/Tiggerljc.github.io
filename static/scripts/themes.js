let themes = {};

const themesReady = fetch('/static/resources/themes.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load themes.json: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    themes = data;

    const saved = localStorage.getItem('site-theme');
    if (saved && themes[saved]) {
      applyTheme(saved);
    } else if (themes.orange) {
      updateFillerImages(themes.orange);
    }
  })
  .catch((error) => {
    console.error(error);
    applyTheme("orange");
  });

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
