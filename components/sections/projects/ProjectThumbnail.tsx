import { Layers } from "lucide-react";

/** 16:9 project image, or a gradient placeholder with the title when no image is uploaded. */
export function ProjectThumbnail({ image, title }: { image: string | null; title: string }) {
  return (
    <div className="relative aspect-video overflow-hidden border-b border-line bg-surface-2">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--color-accent)_28%,transparent),transparent_60%),linear-gradient(135deg,var(--color-art-1),var(--color-art-4))]">
          <div className="flex flex-col items-center gap-2 text-accent-soft/80">
            <Layers className="size-8" aria-hidden="true" />
            <span className="text-sm font-semibold text-ink/80">{title}</span>
          </div>
        </div>
      )}
    </div>
  );
}
