"use client";

import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "../AdminContext";
import { EmptyState, Loading } from "../ui/EmptyState";
import { ErrorBox } from "../ui/ErrorBox";
import { IconButton } from "../ui/IconButton";

type Message = { id: number; name: string; email: string; message: string; is_read: boolean; created_at: string };

/** Messages tab: contact-form submissions — reply, mark read/unread, delete. */
export function MessagesView({ onCount }: { onCount?: (unread: number) => void }) {
  const { toast } = useAdmin();
  const db = browserClient();
  const [msgs, setMsgs] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.from("contact_messages").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) return setError(error.message);
      setMsgs(data as Message[]);
    });
  }, [db]);
  useEffect(() => {
    if (msgs) onCount?.(msgs.filter((m) => !m.is_read).length);
  }, [msgs, onCount]);

  if (error) return <ErrorBox message={error} />;
  if (!msgs) return <Loading />;
  if (!msgs.length) return <EmptyState>No messages yet. Messages sent through the contact form appear here.</EmptyState>;

  const toggleRead = async (m: Message) => {
    const { error } = await db.from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
    if (error) return toast(error.message, true);
    setMsgs((ms) => ms!.map((x) => (x.id === m.id ? { ...x, is_read: !m.is_read } : x)));
  };
  const remove = async (m: Message) => {
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
            <a href={`mailto:${m.email}`} className="btn-outline min-h-10 px-3">
              <Mail className="size-4" /> Reply
            </a>
            <IconButton label={m.is_read ? "Mark unread" : "Mark read"} onClick={() => toggleRead(m)}>
              {m.is_read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
            </IconButton>
            <IconButton label="Delete" onClick={() => remove(m)}>
              <Trash2 className="size-4 text-danger" />
            </IconButton>
          </div>
          <p className="mt-3 text-sm whitespace-pre-wrap text-muted">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}
