import { IMAGE_ACCEPT, PDF_ACCEPT } from "./FieldInput";
import { SKILL_CATEGORIES } from "@/lib/types";

export type FieldType =
  | "text" | "textarea" | "email" | "url" | "number" | "checkbox"
  | "upload" | "list" | "tags" | "select";

export type Field = {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  wide?: boolean;
  help?: string;
  options?: readonly string[];      // select
  accept?: string;                  // upload
  folder?: string;                  // upload → storage path prefix
  placeholder?: string;
};

export type TableConfig = {
  table: string;
  label: string;
  item: string;                     // singular, for "+ Add …"
  titleKey: string;                 // shown in collapsed card header
  subtitleKey?: string;
  fields: Field[];
  defaults?: Record<string, unknown>;
};

export const PROFILE_FIELDS: Field[] = [
  { key: "name", label: "Full name", required: true },
  { key: "initials", label: "Logo initials", required: true, help: "Shown in the monogram, e.g. AJ" },
  { key: "role", label: "Role", required: true, help: "Short job title, e.g. Full Stack Developer" },
  { key: "headline", label: "Hero role line", help: "e.g. Full Stack Developer | B.Tech CSE" },
  { key: "intro", label: "Hero intro", type: "textarea", wide: true },
  { key: "status_badge", label: "Availability badge text", help: "e.g. Available for opportunities" },
  { key: "available", label: "Show availability badge", type: "checkbox" },
  { key: "email", label: "Contact email", type: "email" },
  { key: "github_url", label: "GitHub URL", type: "url" },
  { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
  { key: "instagram_url", label: "Instagram URL (optional)", type: "url" },
  { key: "x_url", label: "X / Twitter URL (optional)", type: "url" },
  { key: "reply_note", label: "Contact invitation", type: "textarea", wide: true },
  { key: "cv_url", label: "Resume (PDF)", type: "upload", accept: PDF_ACCEPT, folder: "resume", wide: true },
];

/** Fields shown in the About section (same `profile` row, edited in the About tab). */
export const ABOUT_FIELDS: Field[] = [
  { key: "about", label: "About bio", type: "textarea", wide: true },
  {
    key: "photo_url", label: "About image (logo or photo)", type: "upload", accept: IMAGE_ACCEPT, folder: "about", wide: true,
    help: "Replaces the AJ mark in the About card. PNG or WebP with a transparent background works best for a logo. Max 5 MB.",
  },
  { key: "location", label: "Location", help: "Shown under the image, after your degree" },
];

export const TABLES: Record<string, TableConfig> = {
  stats: {
    table: "stats", label: "Stats", item: "stat", titleKey: "value", subtitleKey: "label",
    fields: [
      { key: "value", label: "Value", required: true, placeholder: "10+" },
      { key: "label", label: "Label", required: true, placeholder: "Projects" },
      { key: "icon", label: "Icon", type: "select", options: ["code", "briefcase", "graduation-cap", "star"] },
    ],
    defaults: { icon: "star" },
  },
  projects: {
    table: "projects", label: "Projects", item: "project", titleKey: "title", subtitleKey: "description",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "slug", label: "Slug", help: "For a future /projects/slug page" },
      { key: "description", label: "One-line value", type: "textarea", wide: true },
      { key: "features", label: "Key features", type: "list", wide: true, help: "One per line (2–4 work best)" },
      { key: "tags", label: "Stack tags", type: "tags", wide: true, help: "Comma separated, e.g. React, TypeScript, Go" },
      { key: "demo_url", label: "Live demo URL", type: "url", help: "Button only shows when set" },
      { key: "github_url", label: "GitHub URL", type: "url" },
      { key: "case_study_url", label: "Case study URL", type: "url" },
      { key: "image_url", label: "Thumbnail (16:9)", type: "upload", accept: IMAGE_ACCEPT, folder: "projects", wide: true },
      { key: "published", label: "Published", type: "checkbox" },
    ],
    defaults: { published: true, features: [], tags: [] },
  },
  experience: {
    table: "experience", label: "Experience", item: "role", titleKey: "role", subtitleKey: "company",
    fields: [
      { key: "role", label: "Role", required: true },
      { key: "company", label: "Company", required: true },
      { key: "period", label: "Date range", required: true, placeholder: "Jan 2026 — Jul 2026" },
      { key: "location", label: "Location" },
      { key: "bullets", label: "Impact bullets", type: "list", wide: true, help: "One per line (2–4)" },
      { key: "tags", label: "Technologies", type: "tags", wide: true, help: "Comma separated" },
      { key: "summary", label: "Extra summary (optional)", type: "textarea", wide: true },
    ],
    defaults: { bullets: [], tags: [] },
  },
  skills: {
    table: "skills", label: "Skills", item: "skill", titleKey: "name", subtitleKey: "category",
    fields: [
      { key: "name", label: "Skill", required: true },
      { key: "category", label: "Group", type: "select", options: SKILL_CATEGORIES, required: true },
      { key: "icon", label: "Logo slug", help: "From simpleicons.org, e.g. react, go, postgresql. Empty = generic icon" },
    ],
    defaults: { category: "Other" },
  },
  education: {
    table: "education", label: "Education", item: "entry", titleKey: "label", subtitleKey: "year",
    fields: [
      { key: "label", label: "Text", required: true, placeholder: "B.Tech, Computer Science & Engineering" },
      { key: "year", label: "Year" },
      { key: "is_degree", label: "Main degree (shown in About card)", type: "checkbox" },
    ],
    defaults: { is_degree: false },
  },
};
