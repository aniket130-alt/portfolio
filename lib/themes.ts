// Colour themes selectable in Admin → Site text → Appearance.
// The CSS for each theme lives in app/globals.css under html[data-theme="<key>"].

export type Theme = {
  key: string;
  label: string;
  mode: "dark" | "light";
  /** Background and accent — used for the admin swatches, browser theme colour and favicon. */
  bg: string;
  accent: string;
  accentStrong: string;
  onAccent: string;
};

export const THEMES = [
  { key: "dark", label: "Navy & Blue", mode: "dark", bg: "#07101e", accent: "#2589ff", accentStrong: "#1660d6", onAccent: "#ffffff" },
  { key: "emerald", label: "White & Emerald", mode: "light", bg: "#ffffff", accent: "#059669", accentStrong: "#047857", onAccent: "#ffffff" },
  { key: "black", label: "White & Black", mode: "light", bg: "#ffffff", accent: "#111111", accentStrong: "#3f3f46", onAccent: "#ffffff" },
  { key: "blue", label: "White & Electric Blue", mode: "light", bg: "#ffffff", accent: "#1f6fff", accentStrong: "#1d4ed8", onAccent: "#ffffff" },
  { key: "lavender-dark", label: "Black & Lavender", mode: "dark", bg: "#0a0a0f", accent: "#a78bfa", accentStrong: "#7c5cf0", onAccent: "#0a0a0f" },
  { key: "lavender", label: "White & Lavender", mode: "light", bg: "#ffffff", accent: "#8b5cf6", accentStrong: "#6d28d9", onAccent: "#ffffff" },
] as const satisfies readonly Theme[];

export type ThemeKey = (typeof THEMES)[number]["key"];

/** The saved theme, or the default when the value is missing/unknown. */
export function getTheme(value: string | null | undefined): Theme {
  return THEMES.find((t) => t.key === value?.trim()) ?? THEMES[0];
}
