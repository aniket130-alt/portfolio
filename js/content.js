// Loads portfolio content from Supabase and renders it into the page.
// If Supabase isn't configured or a request fails, the static HTML stays as-is.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

// Only allow http(s), mailto and same-page/relative links in hrefs and srcs.
const safeUrl = (u) => {
  const s = String(u ?? "").trim();
  if (!s) return "";
  if (/^(https?:|mailto:|#|\/|\.\/|[\w-]+\/)/i.test(s) && !/^javascript:/i.test(s)) return s;
  return "";
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function renderProfile(p) {
  if (!p) return;
  $$('[data-field="name"]').forEach((el) => (el.textContent = p.name));
  $$('[data-field="initials"]').forEach((el) => (el.textContent = p.initials));
  $$('[data-field="role"]').forEach((el) => (el.textContent = p.role));
  $$('[data-field="intro"]').forEach((el) => (el.textContent = p.intro ?? ""));
  $$('[data-field="location"]').forEach((el) => (el.textContent = p.location ?? ""));

  const badge = $('[data-field="status_badge"]');
  if (badge) {
    badge.textContent = p.status_badge ?? "";
    badge.hidden = !p.status_badge;
  }

  if (p.email) {
    $$('[data-link="email"]').forEach((el) => {
      el.href = `mailto:${p.email}`;
      if (el.dataset.showText !== undefined) el.textContent = p.email;
    });
  }

  const linkedin = safeUrl(p.linkedin_url);
  if (linkedin) {
    $$('[data-link="linkedin"]').forEach((el) => {
      el.href = linkedin;
      el.textContent = linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    });
  }

  const cv = safeUrl(p.cv_url);
  if (cv) $$('[data-link="cv"]').forEach((el) => (el.href = cv));

  const photo = safeUrl(p.photo_url);
  const photoBox = $(".hero__photo");
  if (photo && photoBox) {
    photoBox.innerHTML = `<img src="${esc(photo)}" alt="${esc(p.name)}" />`;
    photoBox.removeAttribute("role");
    photoBox.removeAttribute("aria-label");
  }

  const reply = $('[data-field="reply_note"]');
  if (reply && p.reply_note) reply.textContent = p.reply_note;

  document.title = `${p.name} — ${p.role}`;
  $('meta[name="description"]')?.setAttribute(
    "content",
    `Portfolio of ${p.name}, ${p.role}. Experience, projects and skills.`
  );
}

function renderExperience(rows) {
  const list = $("#experience-list");
  if (!list || !rows?.length) return;
  list.innerHTML = rows
    .map(
      (r) => `
      <li class="timeline__item">
        <h3 class="timeline__role">${esc(r.role)}</h3>
        <p class="timeline__org">${esc(r.company)} · ${esc(r.period)}</p>
        ${r.summary ? `<p class="timeline__desc">${esc(r.summary)}</p>` : ""}
      </li>`
    )
    .join("");
}

function renderSkills(rows) {
  const list = $("#skills-list");
  if (!list || !rows?.length) return;
  list.innerHTML = rows
    .map((r) => {
      const level = Math.max(0, Math.min(100, Number(r.level) || 0));
      return `
      <li class="skill" style="--level: ${level}%">
        <div class="skill__head"><span>${esc(r.name)}</span><span>${level}%</span></div>
        <div class="skill__bar"><div class="skill__fill"></div></div>
      </li>`;
    })
    .join("");
}

function renderEducation(rows) {
  const box = $("#education-body");
  if (!box || !rows?.length) return;
  box.innerHTML = rows
    .map((r) => {
      const text = r.year ? `${esc(r.label)} · ${esc(r.year)}` : esc(r.label);
      return `<p class="${r.is_degree ? "education__degree" : "education__item"}">${text}</p>`;
    })
    .join("");
}

function renderProjects(rows) {
  const grid = $("#projects-grid");
  if (!grid || !rows?.length) return;
  grid.innerHTML = rows
    .map((r) => {
      const img = safeUrl(r.image_url);
      const link = safeUrl(r.link_url);
      const external = /^https?:/i.test(link);
      return `
      <article class="project reveal">
        <div class="project__img">${
          img ? `<img src="${esc(img)}" alt="${esc(r.title)}" loading="lazy" />` : "<span>[Project image]</span>"
        }</div>
        <div class="project__body">
          <h3 class="project__title">${esc(r.title)}</h3>
          ${r.description ? `<p class="project__desc">${esc(r.description)}</p>` : ""}
          ${
            link
              ? `<a href="${esc(link)}" class="project__link"${
                  external ? ' target="_blank" rel="noopener"' : ""
                }>View details <span aria-hidden="true">→</span></a>`
              : ""
          }
        </div>
      </article>`;
    })
    .join("");
}

export async function loadContent() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return; // not configured: keep static HTML

  const { createClient } = await import(
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm"
  );
  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });

  const [profile, experience, skills, education, projects] = await Promise.all([
    db.from("profile").select("*").eq("id", 1).maybeSingle(),
    db.from("experience").select("*").order("sort_order"),
    db.from("skills").select("*").order("sort_order"),
    db.from("education").select("*").order("sort_order"),
    db.from("projects").select("*").order("sort_order"),
  ]);

  // Render each section independently so one failure doesn't blank the others.
  const sections = [
    [profile, renderProfile],
    [experience, renderExperience],
    [skills, renderSkills],
    [education, renderEducation],
    [projects, renderProjects],
  ];
  for (const [res, render] of sections) {
    if (res.error) console.warn("[portfolio] Supabase:", res.error.message);
    else render(res.data);
  }
}
