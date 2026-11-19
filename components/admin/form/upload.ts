import { browserClient } from "@/lib/supabase";

/** Supabase Storage bucket for all uploads (see supabase/schema.sql, storage section). */
export const BUCKET = "portfolio";
/** Keep in sync with file_size_limit in supabase/schema.sql. */
export const MAX_BYTES = 5 * 1024 * 1024;

// MIME type → file extension. Only these can be uploaded (SVG excluded: it can contain scripts).
const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/avif";
export const PDF_ACCEPT = "application/pdf";

/** Checks the file's real contents (magic bytes), not just its name/extension. */
async function contentMatches(file: File, mime: string): Promise<boolean> {
  const b = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  switch (mime) {
    case "application/pdf": return ascii(0, 5) === "%PDF-";
    case "image/png": return b[0] === 0x89 && ascii(1, 4) === "PNG";
    case "image/jpeg": return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case "image/gif": return ascii(0, 4) === "GIF8";
    case "image/webp": return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
    case "image/avif": return ascii(4, 8) === "ftyp" && /avi[fs]/.test(ascii(8, 12));
    default: return false;
  }
}

/**
 * Validates (type, size, real contents) and uploads a file to `folder/<random>.<ext>`.
 * Returns the public URL, or an error message for the admin.
 */
export async function uploadFile(file: File, folder: string, accept: string): Promise<{ url: string } | { error: string }> {
  const allowedHere = accept.split(",").map((s) => s.trim());
  const ext = ALLOWED[file.type];
  if (!ext || !allowedHere.includes(file.type)) {
    const names = allowedHere.map((t) => ALLOWED[t]?.toUpperCase()).filter(Boolean).join(", ");
    return { error: `That file type isn't allowed here. Use ${names}.` };
  }
  if (file.size > MAX_BYTES) {
    return { error: `File is ${(file.size / 1048576).toFixed(1)} MB — the limit is ${MAX_BYTES / 1048576} MB.` };
  }
  if (!(await contentMatches(file, file.type))) {
    return { error: `This file isn't a real ${ext.toUpperCase()} (it may have been renamed). Please export it again.` };
  }

  // Random name: never trust the uploaded filename; the extension comes from the checked MIME type.
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const db = browserClient();
  const { error } = await db.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) return { error: `Upload failed: ${error.message}` };
  return { url: db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
}
