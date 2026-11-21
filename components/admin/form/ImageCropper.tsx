"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { X, ZoomIn, ZoomOut } from "lucide-react";

export type CropPreset = { label: string; aspect: number };

/** Longest side of the cropped image, in pixels (keeps uploads small and sharp enough for retina). */
const MAX_SIDE = 1600;

/**
 * Crop dialog: drag to position, zoom with the slider / wheel / pinch, pick an aspect.
 * Calls onDone with the cropped image as a new File (WebP, or PNG if the browser can't encode WebP).
 */
export function ImageCropper({
  file,
  presets,
  onDone,
  onOriginal,
  onCancel,
}: {
  file: File;
  presets: CropPreset[];
  onDone: (cropped: File) => void;
  onOriginal: () => void;
  onCancel: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [aspect, setAspect] = useState(presets[0]?.aspect ?? 1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    // Object URLs must be created/revoked as an effect; the image only renders once it exists.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onCancel();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [busy, onCancel]);

  async function apply() {
    if (!src || !area) return;
    setBusy(true);
    try {
      onDone(await cropToFile(src, area, file.name));
    } catch {
      setBusy(false);
      onOriginal(); // cropping failed (very old browser) — fall back to the original file
    }
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-title"
        className="card flex max-h-full w-full max-w-xl flex-col overflow-hidden bg-surface"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 id="crop-title" className="text-sm font-semibold">Crop image</h2>
          <button type="button" onClick={onCancel} disabled={busy} aria-label="Cancel"
            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink">
            <X className="size-4" />
          </button>
        </div>

        <div className="relative h-[min(60vh,420px)] bg-black">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              minZoom={1}
              maxZoom={4}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, px) => setArea(px)}
            />
          )}
        </div>

        <div className="space-y-4 p-4">
          {presets.length > 1 && (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Shape">
              {presets.map((p) => (
                <button key={p.label} type="button" role="radio" aria-checked={aspect === p.aspect}
                  onClick={() => setAspect(p.aspect)}
                  className={`min-h-9 rounded-lg border px-3 text-xs font-medium ${
                    aspect === p.aspect ? "border-accent bg-accent/10 text-ink" : "border-line text-muted hover:text-ink"
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <label className="flex items-center gap-3 text-muted">
            <ZoomOut className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Zoom</span>
            <input type="range" min={1} max={4} step={0.01} value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-accent" />
            <ZoomIn className="size-4 shrink-0" aria-hidden="true" />
          </label>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button type="button" className="mr-auto text-xs text-subtle underline-offset-2 hover:text-ink hover:underline"
              onClick={onOriginal} disabled={busy}>
              Upload without cropping
            </button>
            <button type="button" className="btn-outline min-h-10 px-4" onClick={onCancel} disabled={busy}>Cancel</button>
            <button type="button" className="btn-primary min-h-10 px-4" onClick={apply} disabled={busy || !area}>
              {busy ? "Cropping…" : "Crop & upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Draws the selected area onto a canvas (scaled to MAX_SIDE) and encodes it. */
async function cropToFile(src: string, area: Area, name: string): Promise<File> {
  const img = new Image();
  img.src = src;
  await img.decode();

  const scale = Math.min(1, MAX_SIDE / Math.max(area.width, area.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);

  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.92));
  // WebP keeps transparency (logos) and is small; some browsers silently fall back to PNG.
  let blob = await encode("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await encode("image/png");
  if (!blob) throw new Error("encode failed");

  const ext = blob.type === "image/webp" ? "webp" : "png";
  return new File([blob], `${name.replace(/\.[^.]+$/, "") || "image"}-cropped.${ext}`, { type: blob.type });
}
