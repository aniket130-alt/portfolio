import { loadContent } from "./content.js";

// Mobile menu toggle
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__menu");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menu.classList.toggle("is-open", open);
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => setMenu(false))
);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

// Load content from Supabase (falls back to the static HTML on any error)
try {
  await loadContent();
} catch (err) {
  console.warn("[portfolio] Could not load Supabase content:", err);
}

// Scroll reveal (also triggers skill-bar fill animation)
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Highlight the nav link for the section in view
const navLinks = document.querySelectorAll(".nav__link");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
