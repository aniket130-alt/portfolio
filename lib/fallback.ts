// Draft content from the blueprint. Used when Supabase isn't reachable or the
// v2 columns don't exist yet, so the site always renders. Real content lives in Supabase.
import type { Content } from "./types";

export const fallbackContent: Omit<Content, "year" | "source" | "text"> = {
  profile: {
    id: 1,
    name: "Aniket Jindal",
    initials: "AJ",
    role: "Full Stack Developer",
    headline: "Full Stack Developer | B.Tech CSE",
    intro:
      "I build modern, scalable and real-time web applications with React, TypeScript, Golang and PostgreSQL.",
    about:
      "I'm a software developer with a foundation in computer science and hands-on experience building web applications. I enjoy solving practical problems, working across frontend and backend systems, and turning ideas into reliable products.",
    location: "Delhi, India",
    email: null,
    linkedin_url: null,
    github_url: null,
    instagram_url: null,
    x_url: null,
    status_badge: "Available for opportunities",
    available: true,
    photo_url: null,
    cv_url: null,
    reply_note: "Available for developer roles, collaborations and freelance projects.",
  },
  stats: [
    { id: 1, value: "10+", label: "Projects", icon: "code", sort_order: 1 },
    { id: 2, value: "6+ Months", label: "Experience", icon: "briefcase", sort_order: 2 },
    { id: 3, value: "B.Tech", label: "CSE", icon: "graduation-cap", sort_order: 3 },
  ],
  skills: [
    ["React", "Frontend", "react"],
    ["Next.js", "Frontend", "nextdotjs"],
    ["TypeScript", "Frontend", "typescript"],
    ["JavaScript", "Frontend", "javascript"],
    ["Tailwind CSS", "Frontend", "tailwindcss"],
    ["Golang", "Backend", "go"],
    ["Node.js", "Backend", "nodedotjs"],
    ["REST APIs", "Backend", null],
    ["PostgreSQL", "Database", "postgresql"],
    ["Supabase", "Database", "supabase"],
    ["Git", "Tools / DevOps", "git"],
    ["GitHub", "Tools / DevOps", "github"],
    ["Docker", "Tools / DevOps", "docker"],
    ["Linux", "Tools / DevOps", "linux"],
    ["Vercel", "Tools / DevOps", "vercel"],
    ["Python", "Other", "python"],
    ["Testing", "Other", null],
    ["API integration", "Other", null],
    ["Geospatial / maps", "Other", "openstreetmap"],
  ].map(([name, category, icon], i) => ({
    id: i + 1,
    name: name as string,
    category: category as string,
    icon: icon as string | null,
    sort_order: i + 1,
  })),
  projects: [
    {
      id: 1, title: "Live Bus Tracker", slug: "live-bus-tracker",
      description: "Real-time fleet monitoring with GPS tracking, geofencing and route deviation insights.",
      features: ["Live GPS tracking", "Geofencing alerts", "Route deviation insights"],
      tags: ["React", "TypeScript", "Go", "PostgreSQL"],
      image_url: null, demo_url: null, github_url: null, case_study_url: null, published: true, sort_order: 1,
    },
    {
      id: 2, title: "Coffee-Hub", slug: "coffee-hub",
      description: "Coffee shop website with product browsing and online ordering flows.",
      features: ["Product browsing", "Ordering flow"],
      tags: ["React", "TypeScript", "Supabase"],
      image_url: null, demo_url: null, github_url: null, case_study_url: null, published: true, sort_order: 2,
    },
    {
      id: 3, title: "Workforce Platform", slug: "workforce-platform",
      description: "Attendance, tasks, leave and expense workflows with role-based access.",
      features: ["Attendance & leave", "Tasks & expenses", "Role-based access"],
      tags: ["React", "Go", "PostgreSQL"],
      image_url: null, demo_url: null, github_url: null, case_study_url: null, published: true, sort_order: 3,
    },
    {
      id: 4, title: "AutoNest", slug: "autonest",
      description: "Car marketplace concept for comparing vehicles and connecting buyers with dealers.",
      features: ["Vehicle comparison", "Buyer–dealer connection"],
      tags: ["Next.js", "TypeScript"],
      image_url: null, demo_url: null, github_url: null, case_study_url: null, published: true, sort_order: 4,
    },
  ],
  experience: [
    {
      id: 1, role: "Software Engineer Intern", company: "Aeoru Enterprises Pvt. Ltd.", location: null,
      period: "Jan 2026 — Jul 2026", summary: null,
      bullets: [
        "Built real-time fleet tracking with geofencing.",
        "Worked on location processing for live vehicle positions.",
        "Built dashboards with React and TypeScript on a Golang backend.",
      ],
      tags: ["React", "TypeScript", "Go", "PostgreSQL"], sort_order: 1,
    },
    {
      id: 2, role: "Web Development Intern", company: "Sanskrit e Solutions & Services Pvt. Ltd.", location: null,
      period: "Add dates", summary: null,
      bullets: ["Wrote testing scripts.", "Contributed to web development and testing."],
      tags: ["Testing", "Web"], sort_order: 2,
    },
    {
      id: 3, role: "Web Development Intern", company: "CodSoft", location: null,
      period: "Add dates", summary: null,
      bullets: ["Built mini projects with HTML, CSS and JavaScript."],
      tags: ["HTML", "CSS", "JavaScript"], sort_order: 3,
    },
  ],
  education: [
    { id: 1, label: "B.Tech, Computer Science & Engineering", year: null, is_degree: true, sort_order: 1 },
  ],
};
