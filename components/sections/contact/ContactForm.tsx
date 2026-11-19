"use client";

import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/app/actions";

type Labels = {
  title: string; name: string; email: string; message: string;
  submit: string; sending: string; success: string; error: string;
};

const input =
  "w-full rounded-[var(--radius-btn)] border border-line bg-surface-2/70 px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle transition-colors duration-200 hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-danger";

export function ContactForm({ labels }: { labels: Labels }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, { status: "idle" });
  const v = state.values;

  if (state.status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-[var(--radius-card)] border border-success/30 bg-success/10 p-5 text-sm text-ink">
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
        <p>{labels.success}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-4" aria-describedby={state.status === "error" ? "form-status" : undefined}>
      <h3 className="text-base font-semibold">{labels.title}</h3>

      {/* honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>Company <input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="cf-name" label={labels.name} error={state.errors?.name}>
          <input id="cf-name" name="name" required autoComplete="name" defaultValue={v?.name} className={input}
            aria-invalid={!!state.errors?.name} aria-describedby={state.errors?.name ? "cf-name-err" : undefined} />
        </Field>
        <Field id="cf-email" label={labels.email} error={state.errors?.email}>
          <input id="cf-email" name="email" type="email" required autoComplete="email" defaultValue={v?.email} className={input}
            aria-invalid={!!state.errors?.email} aria-describedby={state.errors?.email ? "cf-email-err" : undefined} />
        </Field>
      </div>
      <Field id="cf-message" label={labels.message} error={state.errors?.message}>
        <textarea id="cf-message" name="message" required rows={4} defaultValue={v?.message} className={`${input} resize-y`}
          aria-invalid={!!state.errors?.message} aria-describedby={state.errors?.message ? "cf-message-err" : undefined} />
      </Field>

      {state.status === "error" && !state.errors && (
        <p id="form-status" role="alert" className="flex items-center gap-2 text-sm text-danger">
          <CircleAlert className="size-4" aria-hidden="true" /> {labels.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto">
        {pending ? (
          <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> {labels.sending}</>
        ) : (
          <><Send className="size-4" aria-hidden="true" /> {labels.submit}</>
        )}
      </button>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted">{label}</label>
      {children}
      {error && <p id={`${id}-err`} className="text-xs text-danger">{error}</p>}
    </div>
  );
}
