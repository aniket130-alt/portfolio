"use client";

import { useCallback, useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "./AdminContext";
import { TABLES } from "./config/fields";
import { TABS, type TabId } from "./config/tabs";
import { AboutEditor } from "./editors/AboutEditor";
import { MessagesView } from "./editors/MessagesView";
import { ProfileEditor } from "./editors/ProfileEditor";
import { SiteTextEditor } from "./editors/SiteTextEditor";
import { TableEditor } from "./editors/TableEditor";

/** Signed-in admin view: sidebar tabs + the selected editor. */
export function Dashboard() {
  const { hasDirty } = useAdmin();
  const [tab, setTab] = useState<TabId>("profile");
  const [unread, setUnread] = useState(0);
  const onCount = useCallback((n: number) => setUnread(n), []);

  // Unread badge without opening the Messages tab
  useEffect(() => {
    browserClient()
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
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
              <button
                type="button"
                onClick={() => go(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-xl px-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === t.id ? "bg-accent text-on-accent" : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                {t.label}
                {t.id === "messages" && unread > 0 && (
                  <span className={`rounded-full px-1.5 text-[11px] font-bold ${tab === t.id ? "bg-on-accent text-accent" : "bg-accent text-on-accent"}`}>
                    {unread}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="tab-title">
        <h1 id="tab-title" className="mb-5 text-2xl font-bold tracking-tight">
          {TABS.find((t) => t.id === tab)?.label}
        </h1>
        {tab === "profile" && <ProfileEditor />}
        {tab === "about" && <AboutEditor />}
        {tab === "text" && <SiteTextEditor />}
        {tab === "messages" && <MessagesView onCount={onCount} />}
        {(tab === "projects" || tab === "experience" || tab === "skills") && <TableEditor key={tab} config={TABLES[tab]} />}
      </section>
    </div>
  );
}
