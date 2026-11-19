"use client";

import { LoaderCircle, Upload } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Field } from "../config/fields";
import { inputCls } from "../ui/styles";
import { uploadFile } from "./upload";

/** URL field + Upload button: validates and stores the file, then fills in its public URL. */
export function UploadInput({
  id, field: f, value, onChange, label, help, wide, onToast,
}: {
  id: string;
  field: Field;
  value: string;
  onChange: (v: string) => void;
  label: ReactNode;
  help: ReactNode;
  wide: string;
  onToast: (m: string, e?: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const isImage = f.accept?.startsWith("image");

  async function upload(file: File) {
    setBusy(true);
    const res = await uploadFile(file, f.folder ?? "uploads", f.accept ?? "");
    setBusy(false);
    if ("error" in res) return onToast(res.error, true);
    onChange(res.url);
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
