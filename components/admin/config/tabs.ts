/** Admin sidebar tabs, in display order. */
export const TABS = [
  { id: "profile", label: "Profile" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "text", label: "Site text" },
  { id: "messages", label: "Messages" },
] as const;

export type TabId = (typeof TABS)[number]["id"];
