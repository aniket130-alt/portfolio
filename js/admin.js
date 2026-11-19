// Portfolio admin: Supabase Auth sign-in + editing of all content tables.
// Writes are protected by RLS (supabase/admin.sql) — this page is only the UI.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const $ = (sel, root = document) => root.querySelector(sel);
const BUCKET = "portfolio";

// ---------- Section definitions ----------
// type: text (default) | textarea | number | email | url | checkbox | upload
const SECTIONS = {
  profile: {
    label: "Profile",
    single: true,
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "initials", label: "Logo initials", required: true },
      { key: "role", label: "Job title", required: true },
      { key: "status_badge", label: "Status badge (empty hides it)" },
      { key: "intro", label: "Intro", type: "textarea", wide: true },
      { key: "location", label: "Location" },
      { key: "email", label: "Email", type: "email" },
      { key: "linkedin_url", label: "LinkedIn URL", type: "url", wide: true },
      { key: "photo_url", label: "Profile photo", type: "upload", folder: "profile", accept: "image/*", wide: true },
      { key: "cv_url", label: "CV (PDF)", type: "upload", folder: "cv", accept: "application/pdf", wide: true },
      { key: "reply_note", label: "Contact note", wide: true },
    ],
  },
  experience: {
    label: "Experience",
    item: "role",
    fields: [
      { key: "role", label: "Role", required: true },
      { key: "company", label: "Company", required: true },
      { key: "period", label: "Period (e.g. 2024 — Present)", required: true },
      { key: "summary", label: "One-line result", type: "textarea", wide: true },
    ],
  },
  skills: {
    label: "Skills",
    item: "skill",
    fields: [
      { key: "name", label: "Skill", required: true },
      { key: "level", label: "Level (0–100)", type: "number", min: 0, max: 100, required: true },
    ],
  },
  education: {
    label: "Education",
    item: "line",
    fields: [
      { key: "label", label: "Text", required: true },
      { key: "year", label: "Year (optional)" },
      { key: "is_degree", label: "Headline line (degree)", type: "checkbox" },
    ],
  },
  projects: {
    label: "Projects",
    item: "project",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "link_url", label: "Details link", type: "url" },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "image_url", label: "Image", type: "upload", folder: "projects", accept: "image/*", wide: true },
      { key: "published", label: "Published", type: "checkbox", default: true },
    ],
  },
};

// ---------- Small DOM helper (sets text via nodes, never innerHTML) ----------
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "value" || k === "checked" || k === "disabled" || k === "hidden" || k === "required") el[k] = v;
    else el.setAttribute(k, v === true ? "" : String(v));
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c);
  return el;
}

let toastTimer;
function toast(msg, isError = false) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.toggle("is-error", isError);
  t.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-on"), isError ? 5000 : 2200);
}

function show(id) {
  for (const v of ["not-configured", "login-view", "denied-view", "editor-view"]) {
    $(`#${v}`).hidden = v !== id;
  }
}

// ---------- Boot ----------
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  show("not-configured");
} else {
  const { createClient } = await import(
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm"
  );
  start(createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
}

function start(db) {
  let current = "profile";
  let booted = false;

  // ----- Auth -----
  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = $("button[type=submit]", form);
    $("#login-error").textContent = "";
    btn.disabled = true;
    const { error } = await db.auth.signInWithPassword({
      email: form.email.value.trim(),
      password: form.password.value,
    });
    btn.disabled = false;
    if (error) $("#login-error").textContent = error.message;
    else form.reset();
  });

  $("#sign-out").addEventListener("click", () => db.auth.signOut());

  db.auth.onAuthStateChange((_event, session) => {
    // Supabase advises against awaiting other Supabase calls inside this callback.
    setTimeout(() => onSession(session), 0);
  });

  async function onSession(session) {
    $("#user-bar").hidden = !session;
    if (!session) {
      booted = false;
      show("login-view");
      return;
    }
    $("#user-email").textContent = session.user.email ?? "";
    if (booted) return;
    const { data: isAdmin, error } = await db.rpc("is_admin");
    if (error || !isAdmin) {
      if (error) console.warn("[admin]", error);
      show("denied-view");
      return;
    }
    booted = true;
    show("editor-view");
    renderTabs();
    openSection(current);
  }

  // ----- Tabs -----
  const hasUnsaved = () => !!document.querySelector("#panel [data-dirty='1']");
  window.addEventListener("beforeunload", (e) => {
    if (hasUnsaved()) e.preventDefault();
  });

  function renderTabs() {
    $("#tabs").replaceChildren(
      ...Object.entries(SECTIONS).map(([key, s]) =>
        h("button", {
          class: "admin-tab", type: "button", role: "tab",
          "aria-selected": String(key === current),
          onclick: () => {
            if (key === current) return;
            if (hasUnsaved() && !confirm("You have unsaved changes. Leave this tab?")) return;
            current = key;
            renderTabs();
            openSection(key);
          },
        }, s.label)
      )
    );
  }

  // ----- Section rendering -----
  async function openSection(key) {
    const s = SECTIONS[key];
    const panel = $("#panel");
    panel.replaceChildren(h("p", { class: "admin-muted" }, "Loading…"));

    let query = db.from(key).select("*");
    query = s.single ? query.eq("id", 1) : query.order("sort_order").order("id");
    const { data, error } = await query;
    if (key !== current) return; // switched tabs while loading
    if (error) {
      panel.replaceChildren(h("p", { class: "admin-error" }, error.message));
      return;
    }

    if (s.single) {
      panel.replaceChildren(
        h("div", { class: "admin-panel__head" }, h("h2", {}, s.label)),
        rowCard(key, data[0] ?? { id: 1 }, { isNew: !data[0] })
      );
      return;
    }

    const rows = data;
    const list = h("div", { class: "admin-list" });
    const redraw = () =>
      list.replaceChildren(
        ...(rows.length
          ? rows.map((r, i) => rowCard(key, r, { index: i, rows, redraw, isNew: !r.id }))
          : [h("p", { class: "admin-empty" }, `No ${s.label.toLowerCase()} yet.`)])
      );
    redraw();

    panel.replaceChildren(
      h("div", { class: "admin-panel__head" },
        h("h2", {}, s.label),
        h("button", {
          class: "btn btn--primary btn--sm", type: "button",
          onclick: () => {
            const blank = { sort_order: Math.max(0, ...rows.map((r) => r.sort_order ?? 0)) + 1 };
            for (const f of s.fields) if (f.type === "checkbox") blank[f.key] = !!f.default;
            rows.push(blank);
            redraw();
            list.lastElementChild?.querySelector("input, textarea")?.focus();
          },
        }, `+ Add ${s.item}`)
      ),
      list
    );
  }

  // One editable card per row.
  function rowCard(table, row, { index, rows, redraw, isNew }) {
    const s = SECTIONS[table];
    const form = h("form", { class: "card admin-row" });
    const dirty = h("span", { class: "dirty-dot", hidden: !isNew }, isNew ? "Not saved yet" : "Unsaved changes");
    const markDirty = () => { form.dataset.dirty = "1"; dirty.hidden = false; };
    if (isNew) form.dataset.dirty = "1";
    form.addEventListener("input", markDirty);

    const saveBtn = h("button", { class: "btn btn--primary btn--sm", type: "submit" }, "Save");
    const actions = [saveBtn, dirty, h("span", { class: "spacer" })];

    if (!s.single) {
      const move = (dir) => async () => {
        const j = index + dir;
        const other = rows[j];
        if (hasUnsaved() || !row.id || !other?.id) return toast("Save your changes before reordering.", true);
        // Swap sort_order values; if they're equal, nudge so the order actually changes.
        const a = row.sort_order;
        const b = other.sort_order === a ? a + dir : other.sort_order;
        const r1 = await db.from(table).update({ sort_order: b }).eq("id", row.id);
        const r2 = r1.error ? r1 : await db.from(table).update({ sort_order: a }).eq("id", other.id);
        if (r1.error || r2.error) return toast((r1.error || r2.error).message, true);
        row.sort_order = b;
        other.sort_order = a;
        [rows[index], rows[j]] = [rows[j], rows[index]];
        redraw();
      };
      actions.push(
        h("button", { class: "btn btn--outline btn--icon", type: "button", "aria-label": "Move up", disabled: index === 0, onclick: move(-1) }, "↑"),
        h("button", { class: "btn btn--outline btn--icon", type: "button", "aria-label": "Move down", disabled: index === rows.length - 1, onclick: move(1) }, "↓"),
        h("button", {
          class: "btn btn--danger btn--sm", type: "button",
          onclick: async () => {
            if (row.id) {
              if (!confirm("Delete this item? This can't be undone.")) return;
              const { error } = await db.from(table).delete().eq("id", row.id);
              if (error) return toast(error.message, true);
              toast("Deleted");
            }
            rows.splice(index, 1);
            redraw();
          },
        }, row.id ? "Delete" : "Discard")
      );
    }

    form.append(
      h("div", { class: "admin-row__fields" }, s.fields.map((f) => fieldEl(f, row[f.key], markDirty))),
      h("div", { class: "admin-row__actions" }, actions)
    );

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const values = readForm(form, s.fields);
      saveBtn.disabled = true;
      let res;
      if (s.single) {
        res = await db.from(table).upsert({ id: 1, ...values }).select().single();
      } else if (row.id) {
        res = await db.from(table).update(values).eq("id", row.id).select().single();
      } else {
        res = await db.from(table).insert({ ...values, sort_order: row.sort_order ?? 0 }).select().single();
      }
      saveBtn.disabled = false;
      if (res.error) return toast(res.error.message, true);
      Object.assign(row, res.data);
      delete form.dataset.dirty;
      dirty.hidden = true;
      dirty.textContent = "Unsaved changes";
      toast("Saved");
      if (isNew && redraw) redraw(); // swaps Discard → Delete and enables reordering
    });

    return form;
  }

  function fieldEl(f, value, markDirty) {
    const label = h("span", { class: "field__label" }, f.label, f.required ? h("span", { class: "req" }, " *") : null);
    const cls = "field" + (f.wide ? " field--wide" : "");

    if (f.type === "checkbox") {
      return h("label", { class: "field field--check" },
        h("input", { type: "checkbox", name: f.key, checked: !!value }), label);
    }
    if (f.type === "textarea") {
      return h("label", { class: cls }, label,
        h("textarea", { name: f.key, required: f.required, value: value ?? "" }));
    }
    if (f.type === "upload") return uploadField(f, value, label, cls, markDirty);

    return h("label", { class: cls }, label,
      h("input", {
        type: ["number", "email", "url"].includes(f.type) ? f.type : "text",
        name: f.key, required: f.required, min: f.min, max: f.max,
        value: value ?? "",
      }));
  }

  // URL input + "Upload" button: stores the file in the bucket and fills in its public URL.
  function uploadField(f, value, label, cls, markDirty) {
    const isImage = f.accept?.startsWith("image");
    const preview = h("img", { class: "upload__preview", alt: "", hidden: !(isImage && value) });
    if (isImage && value) preview.src = value;
    const urlInput = h("input", { type: "url", name: f.key, value: value ?? "", placeholder: "Upload a file or paste a URL" });
    urlInput.addEventListener("input", () => {
      if (!isImage) return;
      preview.hidden = !urlInput.value;
      if (urlInput.value) preview.src = urlInput.value;
    });

    const btnText = document.createTextNode("Upload");
    const fileInput = h("input", { type: "file", accept: f.accept, "aria-label": `Upload ${f.label}` });
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) return;
      btnText.data = "Uploading…";
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const path = `${f.folder}/${Date.now()}-${safeName}`;
      const { error } = await db.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
      btnText.data = "Upload";
      fileInput.value = "";
      if (error) return toast(`Upload failed: ${error.message}`, true);
      const { data } = db.storage.from(BUCKET).getPublicUrl(path);
      urlInput.value = data.publicUrl;
      if (isImage) { preview.src = data.publicUrl; preview.hidden = false; }
      markDirty();
      toast("Uploaded — click Save to keep it");
    });

    return h("div", { class: cls }, label,
      h("div", { class: "upload" },
        preview, urlInput,
        h("span", { class: "btn btn--outline btn--sm upload__btn" }, btnText, fileInput)));
  }

  function readForm(form, fields) {
    const out = {};
    for (const f of fields) {
      const el = form.elements[f.key];
      if (f.type === "checkbox") out[f.key] = el.checked;
      else if (f.type === "number") out[f.key] = el.value === "" ? null : Number(el.value);
      else {
        const v = el.value.trim();
        out[f.key] = v === "" ? null : v;
      }
    }
    return out;
  }
}
