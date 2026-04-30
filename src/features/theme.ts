export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "mybourse-theme";

export function readStoredTheme(): Theme {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-bs-theme", theme);
  document.body.dataset.theme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function setupThemeToggle(): void {
  const button = document.getElementById("theme-toggle") as HTMLButtonElement | null;

  if (!button) {
    return;
  }

  const theme = readStoredTheme();
  button.textContent = theme === "dark" ? "Mode clair" : "Mode sombre";
  button.setAttribute("aria-pressed", String(theme === "dark"));

  button.addEventListener("click", () => {
    const nextTheme: Theme = readStoredTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    button.textContent = nextTheme === "dark" ? "Mode clair" : "Mode sombre";
    button.setAttribute("aria-pressed", String(nextTheme === "dark"));
  });
}
