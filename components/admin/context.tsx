"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { refreshSiteContent } from "@/app/actions";
import { browserClient } from "@/lib/supabase";

type Ctx = {
  toast: (msg: string, error?: boolean) => void;
  /** Purge the public page cache so edits show immediately. */
  refresh: () => Promise<void>;
  setDirty: (id: string, dirty: boolean) => void;
  hasDirty: () => boolean;
};

const AdminCtx = createContext<Ctx | null>(null);
export const useAdmin = () => {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("useAdmin outside provider");
  return c;
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ text: string; error: boolean; n: number } | null>(null);
  const dirty = useRef(new Set<string>());

  const toast = useCallback((text: string, error = false) => {
    setMsg((m) => ({ text, error, n: (m?.n ?? 0) + 1 }));
  }, []);

  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(() => setMsg(null), msg.error ? 5000 : 2400);
    return () => clearTimeout(id);
  }, [msg]);

  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => { if (dirty.current.size) e.preventDefault(); };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await browserClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    const res = await refreshSiteContent(token).catch(() => ({ ok: false }));
    if (!res.ok) toast("Saved, but the live page may take up to an hour to update.", true);
  }, [toast]);

  const setDirty = useCallback((id: string, d: boolean) => {
    if (d) dirty.current.add(id); else dirty.current.delete(id);
  }, []);
  const hasDirty = useCallback(() => dirty.current.size > 0, []);

  return (
    <AdminCtx.Provider value={{ toast, refresh, setDirty, hasDirty }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {msg && (
          <p key={msg.n} role="status"
            className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl ${
              msg.error ? "bg-danger text-bg" : "bg-ink text-bg"}`}>
            {msg.error ? <CircleAlert className="size-4" /> : <CircleCheck className="size-4" />}
            {msg.text}
          </p>
        )}
      </div>
    </AdminCtx.Provider>
  );
}
