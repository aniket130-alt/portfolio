"use client";

import { LoaderCircle, Upload } from "lucide-react";
import { useState } from "react";
import { browserClient } from "@/lib/supabase";
import type { Field } from "./fields";

export const inputCls =
  "w-full rounded-xl border border-line bg-surface-2/70 px-3 py-2.5 text-sm text-ink placeholder:text-subtle transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

const BUCKET = "portfolio";

/** Converts between DB values and what the input shows. */
export function toInput(f: Field, v: unknown): string | boolean {
  if (f.type === "checkbox") return Boolean(v);
  if (f.type === "list") return Array.isArray(v) ? v.join("\n") : "";
  if (f.type === "tags") return Array.isArray(v) ? v.join(", ") : "";
  return v == null ? "" : String(v);
}

export function fromInput(f: Field, v: string | boolean): unknown {
  if (f.type === "checkbox") return Boolean(v);
  const s = String(v);
  if (f.type === "list") return s.split("\n").map((x) => x.trim()).filter(Boolean);
  if (f.type === "tags") return s.split(",").map((x) => x.trim()).filter(Boolean);
  if (f.type === "number") return s.trim() === "" ? null : Number(s);
  return s.trim() === "" ? null : s.trim();
}

export function FieldInput({
  field: f,
  value,
  onChange,
  idPrefix,
  onToast,
}: {
  field: Field;
  value: string | boolean;
  onChange: (v: string | boolean) => void;
  idPrefix: string;
  onToast: (msg: string, error?: boolean) => void;
}) {
  const id = `${idPrefix}-${f.key}`;
  const wide = f.wide ? "sm:col-span-2" : "";
  const label = (
    <span className="text-xs font-medium text-muted">
      {f.label}
      {f.required && <span className="text-accent-soft"> *</span>}
    </span>
  );
  const help = f.help && <span className="text-[11px] text-subtle">{f.help}</span>;

  if (f.type === "checkbox") {
    return (
      <label htmlFor={id} className={`flex min-h-11 cursor-pointer items-center gap-3 self-end ${wide}`}>
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)}
          className="size-5 accent-[#2589ff]" />
        <span className="text-sm text-ink">{f.label}</span>
      </label>
    );
  }

  if (f.type === "upload") return <UploadInput id={id} field={f} value={String(value)} onChange={onChange} label={label} help={help} wide={wide} onToast={onToast} />;

  let control: React.ReactNode;
  if (f.type === "textarea" || f.type === "list") {
    control = (
      <textarea id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} required={f.required}
        rows={f.type === "list" ? 4 : 3} placeholder={f.placeholder} className={`${inputCls} resize-y`} />
    );
  } else if (f.type === "select") {
    const opts = f.options ?? [];
    const current = String(value);
    control = (
      <select id={id} value={current} onChange={(e) => onChange(e.target.value)} required={f.required} className={inputCls}>
        {!f.required && <option value="">—</option>}
        {current && !opts.includes(current) && <option value={current}>{current}</option>}
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  } else {
    control = (
      <input id={id} type={f.type === "email" || f.type === "url" || f.type === "number" ? f.type : "text"}
        value={String(value)} onChange={(e) => onChange(e.target.value)} required={f.required}
        placeholder={f.placeholder} className={inputCls} />
    );
  }

  return (
    <label htmlFor={id} className={`flex flex-col gap-1.5 ${wide}`}>
      {label}
      {control}
      {help}
    </label>
  );
}

function UploadInput({
  id, field: f, value, onChange, label, help, wide, onToast,
}: {
  id: string; field: Field; value: string; onChange: (v: string) => void;
  label: React.ReactNode; help: React.ReactNode; wide: string; onToast: (m: string, e?: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const isImage = f.accept?.startsWith("image");

  async function upload(file: File) {
    setBusy(true);
    const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${f.folder ?? "uploads"}/${Date.now()}-${safe}`;
    const db = browserClient();
    const { error } = await db.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
    setBusy(false);
    if (error) return onToast(`Upload failed: ${error.message}`, true);
    onChange(db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    onToast("Uploaded — click Save to keep it");
  }

  return (
    <div className={`flex flex-col gap-1.5 ${wide}`}>
      <label htmlFor={id}>{label}</label>
      <div className="flex items-center gap-2">
        {isImage && value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-11 shrink-0 rounded-lg object-cover ring-1 ring-line" />
        )}
        <input id={id} type="url" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="Upload a file or paste a URL" className={`${inputCls} min-w-0 flex-1`} />
        <label className="btn-outline relative min-h-10 shrink-0 cursor-pointer overflow-hidden px-3">
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}
          <span className="hidden sm:inline">{busy ? "Uploading…" : "Upload"}</span>
          <input type="file" accept={f.accept} className="absolute inset-0 cursor-pointer opacity-0" disabled={busy}
            aria-label={`Upload ${f.label}`}
            onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) upload(file); }} />
        </label>
      </div>
      {help}
    </div>
  );
}
