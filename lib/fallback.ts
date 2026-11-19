// Empty content — used only if Supabase can't be reached or isn't configured.
// There is deliberately NO sample/personal data in code: everything shown on the
// site comes from Supabase. Empty sections are hidden automatically.
import type { Content } from "./types";

export const emptyContent: Omit<Content, "year" | "source" | "text"> = {
  profile: {
    id: 1,
    name: "",
    initials: "",
    role: "",
    headline: null,
    intro: null,
    about: null,
    location: null,
    email: null,
    phone: null,
    linkedin_url: null,
    github_url: null,
    instagram_url: null,
    x_url: null,
    status_badge: null,
    available: false,
    photo_url: null,
    cv_url: null,
    reply_note: null,
  },
  stats: [],
  skills: [],
  projects: [],
  experience: [],
  education: [],
};
