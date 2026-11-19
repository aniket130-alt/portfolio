import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Square icon-only button with an accessible label + tooltip. */
export function IconButton({
  label,
  children,
  ...props
}: { label: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-30"
      {...props}
    >
      {children}
    </button>
  );
}
