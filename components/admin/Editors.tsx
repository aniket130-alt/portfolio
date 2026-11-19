"use client";

import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { TEXT_FIELDS } from "@/lib/siteText";
import { useAdmin } from "./context";
import { ABOUT_FIELDS, PROFILE_FIELDS, TABLES, type Field } from "./fields";
import { RecordForm } from "./RecordForm";
import { ErrorBox, IconBtn, TableEditor } from "./TableEditor";

/* ---------------- Profile (single row) ---------------- */
export function ProfileEditor({ fields = PROFILE_FIELDS }: { fields?: Field[] }) {
  const { toast, refresh } = useAdmin();
  const db = browserClient();
  const [row, setRow] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.from("profile").select("*").eq("id", 1).maybeSingle().then(({ data, error }) => {
      if (error) setError(error.message);
      else setRow(data ?? { id: 1 });
    });
  }, [db]);

  if (error) return <ErrorBox message={error} />;
  if (!row) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div className="card p-4 sm:p-6">
      <RecordForm
        fields={fields}
        row={row}
        onSave={async (values) => {
          const { data, error } = await db.from("profile").upsert({ id: 1, ...values }).select().single();
          if (error) { toast(error.message, true); return false; }
          setRow(data);
          refresh();
          return true;
        }}
      />
    </div>
  );
}

/* ---------------- About section: bio/image/location + stats + degree ---------------- */
export function AboutEditor() {
  return (
    <div className="space-y-10">
      <AdminSubsection title="Bio & image" sub="The text and image in the About card.">
        <ProfileEditor fields={ABOUT_FIELDS} />
      </AdminSubsection>
      <AdminSubsection title="Stats" sub="The numbers next to your bio, e.g. 10+ Projects.">
        <TableEditor config={TABLES.stats} />
      </AdminSubsection>
      <AdminSubsection title="Education" sub="The entry marked “Main degree” is shown under the About image.">
        <TableEditor config={TABLES.education} />
      </AdminSubsection>
      <p className="text-sm text-subtle">The section heading (“About Me”) is under Site text → About.</p>
    </div>
  );
}

function AdminSubsection({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-4 text-sm text-muted">{sub}</p>
      {children}
    </section>
  );
}

/* ---------------- Site text (key → value) ---------------- */
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
    const m = new Map<string, (typeof TEXT_FIELDS)[number][]>();
    for (const f of TEXT_FIELDS) m.set(f.group, [...(m.get(f.group) ?? []), f]);
    return [...m.entries()];
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!saved) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Every label on the site. Leave a field empty to use the default shown as placeholder.
      </p>
      {groups.map(([group, items]) => {
        const fields: Field[] = items.map((f) => ({
          key: f.key,
          label: f.label,
          type: "type" in f && f.type === "toggle" ? "checkbox" : "type" in f && f.type === "textarea" ? "textarea" : "text",
          placeholder: f.default,
          wide: "type" in f && f.type === "textarea",
        }));
        const row = Object.fromEntries(
          items.map((f) => [
            f.key,
            "type" in f && f.type === "toggle" ? (saved[f.key] ?? f.default) !== "false" : saved[f.key] ?? "",
          ])
        );
        return (
          <details key={group} className="card group overflow-hidden" open={group === "Sections"}>
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold sm:px-5">
              {group}
              <span className="text-xs font-normal text-subtle">{items.length} fields</span>
            </summary>
            <div className="border-t border-line p-4 sm:p-5">
              <RecordForm
                fields={fields}
                row={row}
                onSave={async (values) => {
                  const upserts = Object.entries(values).map(([key, v]) => ({
                    key,
                    value: typeof v === "boolean" ? String(v) : (v as string | null),
                  }));
                  const { error } = await db.from("site_text").upsert(upserts);
                  if (error) { toast(error.message, true); return false; }
                  setSaved((s) => ({ ...s, ...Object.fromEntries(upserts.map((u) => [u.key, u.value ?? ""])) }));
                  refresh();
                  return true;
                }}
              />
            </div>
          </details>
        );
      })}
    </div>
  );
}

/* ---------------- Contact messages ---------------- */
type Msg = { id: number; name: string; email: string; message: string; is_read: boolean; created_at: string };

export function MessagesView({ onCount }: { onCount?: (unread: number) => void }) {
  const { toast } = useAdmin();
  const db = browserClient();
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.from("contact_messages").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) return setError(error.message);
      setMsgs(data as Msg[]);
    });
  }, [db]);
  useEffect(() => { if (msgs) onCount?.(msgs.filter((m) => !m.is_read).length); }, [msgs, onCount]);

  if (error) return <ErrorBox message={error} />;
  if (!msgs) return <p className="text-sm text-muted">Loading…</p>;
  if (!msgs.length) return <p className="rounded-2xl border border-dashed border-line-strong p-8 text-center text-sm text-muted">No messages yet. Messages sent through the contact form appear here.</p>;

  const toggle = async (m: Msg) => {
    const { error } = await db.from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
    if (error) return toast(error.message, true);
    setMsgs((ms) => ms!.map((x) => (x.id === m.id ? { ...x, is_read: !m.is_read } : x)));
  };
  const remove = async (m: Msg) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await db.from("contact_messages").delete().eq("id", m.id);
    if (error) return toast(error.message, true);
    setMsgs((ms) => ms!.filter((x) => x.id !== m.id));
    toast("Deleted");
  };

  return (
    <ul className="space-y-3">
      {msgs.map((m) => (
        <li key={m.id} className={`card p-4 sm:p-5 ${m.is_read ? "opacity-75" : "border-accent/40"}`}>
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {!m.is_read && <span className="mr-2 inline-block size-2 rounded-full bg-accent align-middle" aria-label="Unread" />}
                {m.name} <span className="font-normal text-muted">· {m.email}</span>
              </p>
              <p className="text-xs text-subtle">{new Date(m.created_at).toLocaleString()}</p>
            </div>
            <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} className="btn-outline min-h-10 px-3">
              <Mail className="size-4" /> Reply
            </a>
            <IconBtn label={m.is_read ? "Mark unread" : "Mark read"} onClick={() => toggle(m)}>
              {m.is_read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
            </IconBtn>
            <IconBtn label="Delete" onClick={() => remove(m)}><Trash2 className="size-4 text-danger" /></IconBtn>
          </div>
          <p className="mt-3 text-sm whitespace-pre-wrap text-muted">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}
