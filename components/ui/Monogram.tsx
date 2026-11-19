/** Initials tile (from Admin → Profile → Logo initials). Renders nothing without initials. */
export function Monogram({ initials, className = "size-9" }: { initials: string; className?: string }) {
  if (!initials.trim()) return null;
  return (
    <span
      className={`${className} relative grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-[#1660d6] font-extrabold tracking-tight text-white shadow-[0_6px_24px_-8px_rgb(37_137_255/0.9)]`}
      aria-hidden="true"
    >
      <span className="text-[0.95em] leading-none">{initials}</span>
    </span>
  );
}
