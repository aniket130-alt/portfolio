"use server";

import { updateTag } from "next/cache";
import { CONTENT_TAG, getContent } from "@/lib/content";
import { serverClient, supabaseConfigured } from "@/lib/supabase";

export type ContactState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: { name: string; email: string; message: string };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Contact form → public.contact_messages (insert-only for visitors, see supabase/schema.sql). */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const values = { name, email, message };

  // Honeypot: real people never fill the hidden "company" field.
  if (String(formData.get("company") ?? "")) return { status: "success" };

  const { text: t } = await getContent(); // wording editable in Admin → Site text
  const errors: ContactState["errors"] = {};
  if (name.length < 2 || name.length > 100) errors.name = t.form_err_name;
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = t.form_err_email;
  if (message.length < 10 || message.length > 5000) errors.message = t.form_err_message;
  if (Object.keys(errors).length) return { status: "error", errors, values };

  if (!supabaseConfigured) return { status: "error", values };
  const { error } = await serverClient().from("contact_messages").insert({ name, email, message });
  if (error) {
    console.error("[contact] insert failed:", error.message);
    return { status: "error", values };
  }
  return { status: "success" };
}

/**
 * Called by the admin page after every save so the public page updates immediately.
 * Verifies the caller's Supabase session is an admin before purging the cache.
 */
export async function refreshSiteContent(accessToken: string): Promise<{ ok: boolean }> {
  if (!supabaseConfigured || !accessToken) return { ok: false };
  const { data: isAdmin, error } = await serverClient(accessToken).rpc("is_admin");
  if (error || !isAdmin) return { ok: false };
  updateTag(CONTENT_TAG);
  return { ok: true };
}
