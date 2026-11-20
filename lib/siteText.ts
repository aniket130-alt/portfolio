// Every piece of UI wording on the site, editable in Admin → "Site text".
// Values are stored in the Supabase table `site_text` (key → value); these are the defaults.

export type TextField = {
  key: string;
  label: string;
  group: string;
  default: string;
  type?: "text" | "textarea" | "toggle" | "theme";
};

export const TEXT_FIELDS = [
  // Appearance (theme keys/colours: lib/themes.ts)
  { group: "Appearance", key: "theme", label: "Colour theme", default: "dark", type: "theme" },

  // Navigation
  { group: "Navigation", key: "nav_home", label: "Home link", default: "Home" },
  { group: "Navigation", key: "nav_about", label: "About link", default: "About" },
  { group: "Navigation", key: "nav_projects", label: "Projects link", default: "Projects" },
  { group: "Navigation", key: "nav_experience", label: "Experience link", default: "Experience" },
  { group: "Navigation", key: "nav_skills", label: "Skills link", default: "Skills" },
  { group: "Navigation", key: "nav_contact", label: "Contact link", default: "Contact" },
  { group: "Navigation", key: "nav_cta", label: "Navbar button", default: "Let's Talk" },
  { group: "Navigation", key: "skip_link", label: "Skip-to-content link (keyboard users)", default: "Skip to content" },

  // Hero
  { group: "Hero", key: "hero_greeting", label: "Greeting before name", default: "Hi, I'm" },
  { group: "Hero", key: "hero_cta_primary", label: "Primary button", default: "View My Projects" },
  { group: "Hero", key: "hero_cta_resume", label: "Resume button", default: "Download Resume" },

  // Section headings (lead word + highlighted word)
  { group: "About", key: "about_lead", label: "Heading", default: "About" },
  { group: "About", key: "about_accent", label: "Heading (highlighted)", default: "Me" },

  { group: "Skills", key: "skills_lead", label: "Heading", default: "My" },
  { group: "Skills", key: "skills_accent", label: "Heading (highlighted)", default: "Skills" },
  { group: "Skills", key: "skills_sub", label: "Subtitle", default: "Technologies I work with, grouped by where I use them." },

  { group: "Projects", key: "projects_lead", label: "Heading", default: "My" },
  { group: "Projects", key: "projects_accent", label: "Heading (highlighted)", default: "Projects" },
  { group: "Projects", key: "projects_sub", label: "Subtitle", default: "Some of my featured work." },
  { group: "Projects", key: "project_demo_label", label: "Live demo button", default: "Live demo" },
  { group: "Projects", key: "project_github_label", label: "GitHub button", default: "GitHub" },
  { group: "Projects", key: "project_case_label", label: "Case study button", default: "Case study" },

  { group: "Experience", key: "experience_lead", label: "Heading", default: "Work" },
  { group: "Experience", key: "experience_accent", label: "Heading (highlighted)", default: "Experience" },
  { group: "Experience", key: "experience_sub", label: "Subtitle", default: "Internships and roles, most recent first." },

  // Contact
  { group: "Contact", key: "contact_lead", label: "Heading", default: "Get" },
  { group: "Contact", key: "contact_accent", label: "Heading (highlighted)", default: "In Touch" },
  { group: "Contact", key: "contact_heading", label: "Big line", default: "Let's build something amazing together." },
  { group: "Contact", key: "contact_email_button", label: "Email button", default: "Email Me" },
  { group: "Contact", key: "contact_phone_label", label: "Phone label (for screen readers)", default: "Call" },
  { group: "Contact", key: "form_title", label: "Form title", default: "Send a message" },
  { group: "Contact", key: "form_name", label: "Name field label", default: "Name" },
  { group: "Contact", key: "form_email", label: "Email field label", default: "Email" },
  { group: "Contact", key: "form_message", label: "Message field label", default: "Message" },
  { group: "Contact", key: "form_submit", label: "Send button", default: "Send message" },
  { group: "Contact", key: "form_err_name", label: "Error: name missing", default: "Please enter your name." },
  { group: "Contact", key: "form_err_email", label: "Error: invalid email", default: "Please enter a valid email address." },
  { group: "Contact", key: "form_err_message", label: "Error: message too short", default: "Please write at least 10 characters." },
  { group: "Contact", key: "form_sending", label: "Sending state", default: "Sending…" },
  { group: "Contact", key: "form_success", label: "Success message", default: "Thanks! Your message was sent. I'll get back to you soon.", type: "textarea" },
  { group: "Contact", key: "form_error", label: "Error message", default: "Something went wrong. Please try again or email me directly.", type: "textarea" },

  // Footer
  { group: "Footer", key: "footer_rights", label: "Rights text", default: "All rights reserved." },
  { group: "Footer", key: "footer_built_with", label: "Middle line (optional, e.g. Built with …)", default: "" },
  { group: "Footer", key: "footer_top", label: "Back to top link", default: "Back to top" },

  // SEO
  { group: "SEO", key: "seo_title", label: "Page title (empty = Name | Role from Profile)", default: "" },
  { group: "SEO", key: "seo_description", label: "Meta description (empty = hero intro)", type: "textarea", default: "" },

  // Section visibility
  { group: "Sections", key: "show_about", label: "Show About", default: "true", type: "toggle" },
  { group: "Sections", key: "show_projects", label: "Show Projects", default: "true", type: "toggle" },
  { group: "Sections", key: "show_experience", label: "Show Experience", default: "true", type: "toggle" },
  { group: "Sections", key: "show_skills", label: "Show Skills", default: "true", type: "toggle" },
  { group: "Sections", key: "show_contact_form", label: "Show contact form", default: "true", type: "toggle" },
  { group: "Sections", key: "show_hero_art", label: "Show hero illustration", default: "true", type: "toggle" },
] as const satisfies readonly TextField[];

export type TextKey = (typeof TEXT_FIELDS)[number]["key"];
export type SiteText = Record<TextKey, string>;

export const DEFAULT_TEXT = Object.fromEntries(TEXT_FIELDS.map((f) => [f.key, f.default])) as SiteText;

/** Defaults overlaid with whatever is saved in Supabase (empty values fall back to the default). */
export function mergeText(rows: { key: string; value: string | null }[] | null | undefined): SiteText {
  const out = { ...DEFAULT_TEXT };
  for (const r of rows ?? []) {
    if (r.key in out && typeof r.value === "string" && r.value.trim() !== "") {
      out[r.key as TextKey] = r.value;
    }
  }
  return out;
}

export const isOn = (v: string) => v.trim().toLowerCase() !== "false";
