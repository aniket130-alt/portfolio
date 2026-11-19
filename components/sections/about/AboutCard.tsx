import { MapPin } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";

/** Image card in About: uploaded image fills the card; otherwise the initials tile with a glow. */
export function AboutCard({
  image,
  alt,
  initials,
  caption,
}: {
  image: string | null;
  alt: string;
  initials: string;
  caption: string;
}) {
  return (
    <Reveal className="card relative grid aspect-[4/3] place-items-center overflow-hidden p-6 lg:aspect-square">
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} className="absolute inset-0 size-full object-cover" />
          {caption && (
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-bg/95 via-bg/60 to-transparent" />
          )}
        </>
      ) : (
        <>
          <div aria-hidden="true" className="absolute inset-x-6 bottom-10 h-16 rounded-[50%] border border-accent/40 blur-[1px]" />
          <div aria-hidden="true" className="absolute size-40 rounded-full bg-accent/20 blur-3xl" />
          <Monogram initials={initials} className="relative size-20 text-3xl" />
        </>
      )}
      {caption && (
        <p className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink/90">
          <MapPin className="size-3.5 shrink-0 text-accent-soft" aria-hidden="true" />
          {caption}
        </p>
      )}
    </Reveal>
  );
}
