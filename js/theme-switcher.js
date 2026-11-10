(() => {
  "use strict";
  if (document.getElementById("portfolioThemeSwitcher")) return;

  const STORAGE_KEY = "portfolio-neon-theme";
  const themes = [
    { id: "cyberpunk", name: "Cyberpunk", colors: ["#00eaff", "#ff36d7", "#a855f7"] },
    { id: "matrix", name: "Verde Matrix", colors: ["#39ff14", "#00ffc6", "#c6ff00"] },
    { id: "electric", name: "Azul eléctrico", colors: ["#168bff", "#00e5ff", "#6941ff"] },
    { id: "sunset", name: "Naranja y rosa", colors: ["#ff6b00", "#ff38a8", "#ffd000"] },
    { id: "ultraviolet", name: "Ultravioleta", colors: ["#a855f7", "#ff4fd8", "#45eaff"] }
  ];

  let current = "cyberpunk";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (themes.some(theme => theme.id === saved)) current = saved;
  } catch (_error) {
    // The selector remains available even when browser storage is blocked.
  }

  const root = document.documentElement;
  root.dataset.neonTheme = current;

  // En páginas con encabezado, el selector comparte la fila de acciones y
  // nunca cubre el botón de inicio de sesión o los controles del panel.
  const headerActions = document.querySelector(".top-actions");
  const host = headerActions || document.body;
  const wrapper = document.createElement("div");
  wrapper.id = "portfolioThemeSwitcher";
  wrapper.className = headerActions
    ? "theme-switcher"
    : "theme-switcher theme-switcher-floating";
  // En login y registro no hay encabezado; allí se mantiene flotante.
  if (!headerActions) {
    wrapper.style.setProperty("position","fixed","important");
    wrapper.style.setProperty("top","16px","important");
    wrapper.style.setProperty("right","16px","important");
    wrapper.style.setProperty("z-index","2147483000","important");
    wrapper.style.setProperty("display","block","important");
    wrapper.style.setProperty("visibility","visible","important");
    wrapper.style.setProperty("opacity","1","important");
    wrapper.style.setProperty("pointer-events","auto","important");
  }

  wrapper.innerHTML =
    '<button id="themeSwitcherToggle" class="theme-switcher-toggle" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="themeSwitcherPanel">' +
      '<span class="theme-switcher-symbol" aria-hidden="true">✦</span><span>Cambiar tema</span><span class="theme-switcher-chevron" aria-hidden="true">⌄</span>' +
    '</button>' +
    '<section id="themeSwitcherPanel" class="theme-switcher-panel" role="dialog" aria-label="Seleccionar tema neón" hidden>' +
      '<div class="theme-switcher-heading"><div><strong>Temas neón</strong><small>Elige tu combinación favorita</small></div>' +
      '<button id="themeSwitcherClose" class="theme-switcher-close" type="button" aria-label="Cerrar selector">×</button></div>' +
      '<div id="themeSwitcherOptions" class="theme-switcher-options"></div>' +
      '<p class="theme-switcher-note">Tu elección se conservará al cambiar de página.</p>' +
    '</section>';

  // Mantiene el acceso (Iniciar sesión / Cerrar sesión) al extremo derecho.
  // El selector queda antes de los botones de acción y no se superpone con ellos.
  if (headerActions && host.firstChild) host.insertBefore(wrapper, host.firstChild);
  else host.appendChild(wrapper);

  const toggle = wrapper.querySelector("#themeSwitcherToggle");
  const panel = wrapper.querySelector("#themeSwitcherPanel");
  const options = wrapper.querySelector("#themeSwitcherOptions");
  const close = wrapper.querySelector("#themeSwitcherClose");

  function renderOptions() {
    options.innerHTML = "";
    themes.forEach(theme => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theme-option";
      button.dataset.theme = theme.id;
      button.setAttribute("aria-pressed", String(theme.id === current));

      const swatches = document.createElement("span");
      swatches.className = "theme-option-swatches";
      theme.colors.forEach(color => {
        const swatch = document.createElement("i");
        swatch.style.backgroundColor = color;
        swatches.appendChild(swatch);
      });

      const label = document.createElement("span");
      label.className = "theme-option-name";
      label.textContent = theme.name;

      const check = document.createElement("span");
      check.className = "theme-option-check";
      check.textContent = theme.id === current ? "✓" : "";

      button.append(swatches, label, check);
      button.addEventListener("click", () => applyTheme(theme.id));
      options.appendChild(button);
    });
  }

  function applyTheme(themeId) {
    if (!themes.some(theme => theme.id === themeId)) return;
    current = themeId;
    root.dataset.neonTheme = themeId;
    try {
      window.localStorage.setItem(STORAGE_KEY, themeId);
    } catch (_error) {
      // The selected theme still applies for this page view.
    }
    renderOptions();
    toggle.setAttribute("aria-label", "Cambiar tema. Tema actual: " + themes.find(theme => theme.id === themeId).name);
  }

  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  }

  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });
  close.addEventListener("click", closePanel);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
      toggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!wrapper.contains(event.target)) closePanel();
  });

  renderOptions();
  applyTheme(current);
})();