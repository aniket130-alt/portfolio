"use client";

import type { Session } from "@supabase/supabase-js";
import { ExternalLink, LoaderCircle, LogOut, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { browserClient, supabaseConfigured } from "@/lib/supabase";
import { Monogram } from "../ui";
import { AdminProvider, useAdmin } from "./context";
import { MessagesView, ProfileEditor, SiteTextEditor } from "./Editors";
import { TABLES } from "./fields";
import { inputCls } from "./FieldInput";
import { TableEditor } from "./TableEditor";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "stats", label: "Stats" },
  { id: "education", label: "Education" },
  { id: "text", label: "Site text" },
  { id: "messages", label: "Messages" },
] as const;
type TabId = (typeof TABS)[number]["id"];

type View = "loading" | "login" | "denied" | "editor";

export function AdminApp() {
  return (
    <AdminProvider>
      <AdminInner />
    </AdminProvider>
  );
}

function AdminInner() {
  const [view, setView] = useState<View>("loading");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabaseConfigured) return;
    const db = browserClient();
    let checkedFor: string | null = null;

    const handle = async (s: Session | null) => {
      setSession(s);
      if (!s) { checkedFor = null; return setView("login"); }
      if (checkedFor === s.user.id) return;
      checkedFor = s.user.id;
      const { data, error } = await db.rpc("is_admin");
      setView(!error && data ? "editor" : "denied");
    };

    const { data: sub } = db.auth.onAuthStateChange((_e, s) => {
      // Don't await Supabase calls inside this callback (Supabase guidance).
      setTimeout(() => handle(s), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) {
    return (
      <Shell>
        <Panel title="Supabase isn't connected">
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code> (and to Vercel → Settings → Environment Variables), then restart.
        </Panel>
      </Shell>
    );
  }

  return (
    <Shell session={session}>
      {view === "loading" && <p className="flex items-center gap-2 text-sm text-muted"><LoaderCircle className="size-4 animate-spin" /> Loading…</p>}
      {view === "login" && <Login />}
      {view === "denied" && (
        <Panel title="No admin access" icon={<ShieldAlert className="size-5 text-danger" />}>
          You&apos;re signed in as <b className="text-ink">{session?.user.email}</b>, but this account isn&apos;t in the{" "}
          <code>admins</code> table. Add it with the query in <code>supabase/admin.sql</code>, then reload.
        </Panel>
      )}
      {view === "editor" && <Editor />}
    </Shell>
  );
}

function Shell({ children, session }: { children: React.ReactNode; session?: Session | null }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Monogram className="size-9 text-sm" />
            <span className="font-semibold">Portfolio Admin</span>
          </div>
          {session && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-subtle md:inline">{session.user.email}</span>
              <a href="/" target="_blank" className="btn-outline min-h-10 px-3"><ExternalLink className="size-4" /><span className="hidden sm:inline">View site</span></a>
              <button type="button" onClick={() => browserClient().auth.signOut()} className="btn-outline min-h-10 px-3">
                <LogOut className="size-4" /><span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="container-x py-8 md:py-10">{children}</main>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card mx-auto max-w-lg p-6 sm:p-8">
      <h1 className="flex items-center gap-2 text-xl font-bold">{icon}{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:text-ink">{children}</p>
    </section>
  );
}

function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await browserClient().auth.signInWithPassword({
      email: String(fd.get("email")).trim(),
      password: String(fd.get("password")),
    });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <section className="card mx-auto mt-6 max-w-sm p-6 sm:p-8">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="mt-1 text-sm text-muted">Use your Supabase admin account.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">Email</span>
          <input name="email" type="email" required autoComplete="username" className={inputCls} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">Password</span>
          <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
        </label>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy && <LoaderCircle className="size-4 animate-spin" />} Sign in
        </button>
      </form>
    </section>
  );
}

function Editor() {
  const { hasDirty } = useAdmin();
  const [tab, setTab] = useState<TabId>("profile");
  const [unread, setUnread] = useState(0);
  const onCount = useCallback((n: number) => setUnread(n), []);

  // Unread badge without opening the tab
  useEffect(() => {
    browserClient().from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false)
      .then(({ count }) => setUnread(count ?? 0));
  }, []);

  const go = (id: TabId) => {
    if (id === tab) return;
    if (hasDirty() && !confirm("You have unsaved changes. Leave this tab?")) return;
    setTab(id);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr] lg:gap-10">
      <nav aria-label="Sections" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
        <ul className="flex gap-1.5 lg:sticky lg:top-24 lg:flex-col">
          {TABS.map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => go(t.id)} aria-current={tab === t.id ? "page" : undefined}
                className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-xl px-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === t.id ? "bg-accent text-white" : "text-muted hover:bg-surface hover:text-ink"}`}>
                {t.label}
                {t.id === "messages" && unread > 0 && (
                  <span className={`rounded-full px-1.5 text-[11px] font-bold ${tab === t.id ? "bg-white text-accent" : "bg-accent text-white"}`}>{unread}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="tab-title">
        <h1 id="tab-title" className="mb-5 text-2xl font-bold tracking-tight">{TABS.find((t) => t.id === tab)?.label}</h1>
        {tab === "profile" && <ProfileEditor />}
        {tab === "text" && <SiteTextEditor />}
        {tab === "messages" && <MessagesView onCount={onCount} />}
        {tab in TABLES && <TableEditor key={tab} config={TABLES[tab]} />}
      </section>
    </div>
  );
}
