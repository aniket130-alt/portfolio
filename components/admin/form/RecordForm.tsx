"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { useAdmin } from "../AdminContext";
import type { Field } from "../config/fields";
import { FieldInput } from "./FieldInput";
import { fromInput, toInput } from "./values";

/** Editable form for one record. Calls onSave with DB-ready values. */
export function RecordForm({
  fields,
  row,
  onSave,
  actions,
  isNew = false,
}: {
  fields: Field[];
  row: Record<string, unknown>;
  onSave: (values: Record<string, unknown>) => Promise<boolean>;
  actions?: ReactNode;
  isNew?: boolean;
}) {
  const { toast, setDirty } = useAdmin();
  const uid = useId();
  // Keyed on the values (not object identity) so parent re-renders don't wipe unsaved edits.
  const rowKey = JSON.stringify(fields.map((f) => [f.key, row[f.key]]));
  const initial = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.key, toInput(f, row[f.key])])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rowKey]
  );
  const [draft, setDraft] = useState(initial);
  const [base, setBase] = useState(initial);
  const [saving, setSaving] = useState(false);
  // Saved values changed (e.g. after Save) → reset the draft to them.
  if (base !== initial) {
    setBase(initial);
    setDraft(initial);
  }

  const dirty = isNew || fields.some((f) => draft[f.key] !== initial[f.key]);
  useEffect(() => {
    setDirty(uid, dirty);
    return () => setDirty(uid, false);
  }, [uid, dirty, setDirty]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setSaving(true);
    const values = Object.fromEntries(fields.map((f) => [f.key, fromInput(f, draft[f.key])]));
    const ok = await onSave(values);
    setSaving(false);
    if (ok) toast("Saved");
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <FieldInput key={f.key} field={f} idPrefix={uid} value={draft[f.key]} onToast={toast}
            onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <button type="submit" className="btn-primary min-h-10 px-4" disabled={saving || !dirty}>
          {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save
        </button>
        {dirty && <span className="text-xs font-medium text-accent-soft">{isNew ? "Not saved yet" : "Unsaved changes"}</span>}
        <span className="flex-1" />
        {actions}
      </div>
    </form>
  );
}
