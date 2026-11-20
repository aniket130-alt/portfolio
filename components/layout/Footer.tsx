import { ArrowUp } from "lucide-react";
import type { SiteText } from "@/lib/siteText";
import { Monogram } from "@/components/ui/Monogram";

export function Footer({ name, initials, t }: { name: string; initials: string; t: SiteText }) {
  const note = t.footer_note.trim();
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col items-center gap-4 py-8 text-sm text-subtle sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Monogram initials={initials} className="size-7 text-[11px]" />
          {(name || note) && (
            <p>
              {name && <span className="font-medium text-ink">{name}</span>}
              {name && note && <span aria-hidden="true"> · </span>}
              {note}
            </p>
          )}
        </div>
        {t.footer_built_with.trim() && <p className="text-center">{t.footer_built_with}</p>}
        <a href="#top" className="inline-flex min-h-10 items-center gap-1.5 hover:text-ink">
          {t.footer_top} <ArrowUp className="size-4" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
