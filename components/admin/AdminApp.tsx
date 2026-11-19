"use client";

import type { Session } from "@supabase/supabase-js";
import { LoaderCircle, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { browserClient, supabaseConfigured } from "@/lib/supabase";
import { AdminProvider } from "./AdminContext";
import { Dashboard } from "./Dashboard";
import { AdminShell } from "./layout/AdminShell";
import { LoginForm } from "./LoginForm";
import { Panel } from "./ui/Panel";

type View = "loading" | "login" | "denied" | "editor";

/** Admin entry point: tracks the Supabase session and shows login / denied / dashboard. */
export function AdminApp() {
  return (
    <AdminProvider>
      <AdminGate />
    </AdminProvider>
  );
}

function AdminGate() {
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
      <AdminShell>
        <Panel title="Supabase isn't connected">
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code> (and
          to Vercel → Settings → Environment Variables), then restart.
        </Panel>
      </AdminShell>
    );
  }

  return (
    <AdminShell session={session}>
      {view === "loading" && (
        <p className="flex items-center gap-2 text-sm text-muted">
          <LoaderCircle className="size-4 animate-spin" /> Loading…
        </p>
      )}
      {view === "login" && <LoginForm />}
      {view === "denied" && (
        <Panel title="No admin access" icon={<ShieldAlert className="size-5 text-danger" />}>
          You&apos;re signed in as <b className="text-ink">{session?.user.email}</b>, but this account isn&apos;t in the{" "}
          <code>admins</code> table. Add it with the query at the end of <code>supabase/schema.sql</code>, then reload.
        </Panel>
      )}
      {view === "editor" && <Dashboard />}
    </AdminShell>
  );
}
