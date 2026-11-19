/** Keyboard users can jump past the navbar. Label from Admin → Site text. */
export function SkipLink({ label, target = "#main" }: { label: string; target?: string }) {
  return (
    <a
      href={target}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
    >
      {label}
    </a>
  );
}
