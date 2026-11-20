"use client";

import { useEffect, useMemo, useState } from "react";
import { TEXT_FIELDS } from "@/lib/siteText";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "../AdminContext";
import type { Field } from "../config/fields";
import { RecordForm } from "../form/RecordForm";
import { Loading } from "../ui/EmptyState";
import { ErrorBox } from "../ui/ErrorBox";
import { ThemePicker } from "./ThemePicker";

type TextDef = (typeof TEXT_FIELDS)[number];
const kind = (f: TextDef) => ("type" in f ? f.type : "text");

/** Site text tab: every UI label, grouped; saved as key → value rows in `site_text`. */
export function SiteTextEditor() {
  const { toast, refresh } = useAdmin();
  const db = browserClient();
  const [saved, setSaved] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.from("site_text").select("key, value").then(({ data, error }) => {
      if (error) return setError(error.message);
      setSaved(Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""])));
    });
  }, [db]);

  const groups = useMemo(() => {
    const m = new Map<string, TextDef[]>();
    for (const f of TEXT_FIELDS) m.set(f.group, [...(m.get(f.group) ?? []), f]);
    return [...m.entries()];
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!saved) return <Loading />;

  async function saveGroup(values: Record<string, unknown>) {
    const rows = Object.entries(values).map(([key, v]) => ({
      key,
      value: typeof v === "boolean" ? String(v) : (v as string | null),
    }));
    const { error } = await db.from("site_text").upsert(rows);
    if (error) { toast(error.message, true); return false; }
    setSaved((s) => ({ ...s, ...Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""])) }));
    refresh();
    return true;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Every label on the site. Leave a field empty to use the default shown as placeholder.</p>
      {groups.map(([group, items]) => {
        const fields: Field[] = items.filter((f) => kind(f) !== "theme").map((f) => ({
          key: f.key,
          label: f.label,
          type: kind(f) === "toggle" ? "checkbox" : kind(f) === "textarea" ? "textarea" : "text",
          placeholder: f.default,
          wide: kind(f) === "textarea",
        }));
        const row = Object.fromEntries(
          items.map((f) => [f.key, kind(f) === "toggle" ? (saved[f.key] ?? f.default) !== "false" : saved[f.key] ?? ""])
        );
        return (
          <details key={group} className="card overflow-hidden" open={group === "Sections" || group === "Appearance"}>
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold sm:px-5">
              {group}
              <span className="text-xs font-normal text-subtle">{items.length} fields</span>
            </summary>
            <div className="border-t border-line p-4 sm:p-5">
              {group === "Appearance" ? (
                <ThemePicker value={saved.theme ?? ""} onSave={saveGroup} />
              ) : (
                <RecordForm fields={fields} row={row} onSave={saveGroup} />
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
