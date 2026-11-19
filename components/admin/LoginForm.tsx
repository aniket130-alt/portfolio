"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { browserClient } from "@/lib/supabase";
import { inputCls } from "./ui/styles";

/** Email + password sign-in (Supabase Auth). AdminApp reacts to the session change. */
export function LoginForm() {
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
