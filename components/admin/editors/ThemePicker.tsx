"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { THEMES, getTheme } from "@/lib/themes";

/** Appearance → colour theme: swatch cards, saved as the `theme` site_text key. */
export function ThemePicker({
  value,
  onSave,
}: {
  value: string;
  onSave: (values: Record<string, unknown>) => Promise<boolean>;
}) {
  const current = getTheme(value).key;
  const [picked, setPicked] = useState<string>(current);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await onSave({ theme: picked });
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div role="radiogroup" aria-label="Colour theme" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((t) => {
          const on = picked === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setPicked(t.key)}
              className={`flex min-h-14 items-center gap-3 rounded-xl border px-3 text-left text-sm transition-colors ${
                on ? "border-accent bg-accent/10 font-semibold" : "border-line hover:border-line-strong"
              }`}
            >
              <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
                <span className="size-6 rounded-full border border-black/15" style={{ background: t.bg }} />
                <span className="size-6 rounded-full border border-black/15" style={{ background: t.accent }} />
              </span>
              <span className="flex-1">{t.label}</span>
              {on && <Check className="size-4 text-accent-soft" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="btn-primary" onClick={save} disabled={saving || picked === current}>
          {saving ? "Saving…" : "Save theme"}
        </button>
        {picked === current && <span className="text-xs text-subtle">This theme is live.</span>}
      </div>
    </div>
  );
}
