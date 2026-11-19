"use client";

import { ChevronDown, ChevronUp, EyeOff, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "../AdminContext";
import type { TableConfig } from "../config/fields";
import { RecordForm } from "../form/RecordForm";
import { EmptyState, Loading } from "../ui/EmptyState";
import { ErrorBox } from "../ui/ErrorBox";
import { IconButton } from "../ui/IconButton";

type Row = Record<string, unknown> & { id?: number; sort_order?: number; _key: string };
let tmp = 0;

export function TableEditor({ config: c }: { config: TableConfig }) {
  const { toast, refresh, hasDirty } = useAdmin();
  const db = browserClient();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    db.from(c.table).select("*").order("sort_order").order("id").then(({ data, error }) => {
      if (error) return setError(error.message);
      setRows((data ?? []).map((r) => ({ ...r, _key: `db-${r.id}` })));
    });
  }, [db, c.table]);

  if (error) return <ErrorBox message={error} />;
  if (!rows) return <Loading />;

  const add = () => {
    const key = `new-${++tmp}`;
    const sort = Math.max(0, ...rows.map((r) => Number(r.sort_order ?? 0))) + 1;
    setRows([...rows, { ...(c.defaults ?? {}), sort_order: sort, _key: key }]);
    setOpen(key);
  };

  const save = (row: Row) => async (values: Record<string, unknown>) => {
    const res = row.id
      ? await db.from(c.table).update(values).eq("id", row.id).select().single()
      : await db.from(c.table).insert({ ...values, sort_order: row.sort_order ?? 0 }).select().single();
    if (res.error) { toast(res.error.message, true); return false; }
    setRows((rs) => rs!.map((r) => (r._key === row._key ? { ...res.data, _key: row._key } : r)));
    refresh();
    return true;
  };

  const remove = async (row: Row) => {
    if (row.id) {
      if (!confirm(`Delete this ${c.item}? This can't be undone.`)) return;
      const { error } = await db.from(c.table).delete().eq("id", row.id);
      if (error) return toast(error.message, true);
      toast("Deleted");
      refresh();
    }
    setRows((rs) => rs!.filter((r) => r._key !== row._key));
  };

  const move = async (i: number, dir: -1 | 1) => {
    const a = rows[i], b = rows[i + dir];
    if (!a?.id || !b?.id) return toast("Save new items before reordering.", true);
    if (hasDirty()) return toast("Save your changes before reordering.", true);
    const sa = Number(a.sort_order ?? 0);
    const sb = Number(b.sort_order ?? 0) === sa ? sa + dir : Number(b.sort_order ?? 0);
    const r1 = await db.from(c.table).update({ sort_order: sb }).eq("id", a.id);
    const r2 = r1.error ? r1 : await db.from(c.table).update({ sort_order: sa }).eq("id", b.id);
    if (r1.error || r2.error) return toast((r1.error ?? r2.error)!.message, true);
    const next = [...rows];
    next[i] = { ...b, sort_order: sa };
    next[i + dir] = { ...a, sort_order: sb };
    setRows(next);
    refresh();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{rows.length} {rows.length === 1 ? c.item : `${c.item}s`} · order here = order on the site</p>
        <button type="button" onClick={add} className="btn-primary min-h-10 px-4">
          <Plus className="size-4" /> Add {c.item}
        </button>
      </div>

      {rows.length === 0 && (
        <EmptyState>No {c.item}s yet.</EmptyState>
      )}

      <ul className="space-y-3">
        {rows.map((r, i) => {
          const isOpen = open === r._key || !r.id;
          const title = String(r[c.titleKey] ?? "") || `New ${c.item}`;
          const sub = c.subtitleKey ? r[c.subtitleKey] : null;
          const hidden = r.published === false;
          return (
            <li key={r._key} className={`card overflow-hidden ${hidden ? "opacity-70" : ""}`}>
              <div className="flex items-center gap-2 p-3 pl-4">
                <button type="button" onClick={() => setOpen(isOpen ? null : r._key)} aria-expanded={isOpen}
                  className="flex min-h-10 min-w-0 flex-1 items-center gap-3 text-left">
                  <ChevronDown className={`size-4 shrink-0 text-subtle transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{title}</span>
                    {sub ? <span className="block truncate text-xs text-subtle">{String(sub)}</span> : null}
                  </span>
                  {hidden && <span className="chip shrink-0"><EyeOff className="size-3" /> Hidden</span>}
                  {!r.id && <span className="chip shrink-0 border-accent/40 text-accent-soft">New</span>}
                </button>
                <IconButton label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ChevronUp className="size-4" /></IconButton>
                <IconButton label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)}><ChevronDown className="size-4" /></IconButton>
              </div>
              {isOpen && (
                <div className="border-t border-line p-4 sm:p-5">
                  <RecordForm
                    fields={c.fields}
                    row={r}
                    isNew={!r.id}
                    onSave={save(r)}
                    actions={
                      <button type="button" onClick={() => remove(r)}
                        className="btn min-h-10 border border-danger/30 px-3 text-danger hover:border-danger">
                        <Trash2 className="size-4" /> {r.id ? "Delete" : "Discard"}
                      </button>
                    }
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
