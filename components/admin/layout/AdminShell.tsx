"use client";

import type { Session } from "@supabase/supabase-js";
import { ExternalLink, LayoutDashboard, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { browserClient } from "@/lib/supabase";

/** Admin page frame: sticky header (signed-in email, View site, Sign out) + content area. */
export function AdminShell({ children, session }: { children: ReactNode; session?: Session | null }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-white">
              <LayoutDashboard className="size-5" aria-hidden="true" />
            </span>
            <span className="font-semibold">Portfolio Admin</span>
          </div>
          {session && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-subtle md:inline">{session.user.email}</span>
              <a href="/" target="_blank" className="btn-outline min-h-10 px-3">
                <ExternalLink className="size-4" />
                <span className="hidden sm:inline">View site</span>
              </a>
              <button type="button" onClick={() => browserClient().auth.signOut()} className="btn-outline min-h-10 px-3">
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="container-x py-8 md:py-10">{children}</main>
    </div>
  );
}
