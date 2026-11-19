"use client";

import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Monogram } from "@/components/ui/Monogram";

export type NavLink = { href: string; label: string };

export function Navbar({
  name,
  initials,
  links: LINKS,
  cta,
}: {
  name: string;
  initials: string;
  links: NavLink[];
  cta: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  // Active section highlight
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [LINKS]);

  // Translucent background once scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mobile menu; lock page scroll while it's open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-[72px]" aria-label="Main">
        <a href="#home" className="flex items-center gap-3 font-semibold" onClick={close}>
          <Monogram initials={initials} className="size-9 text-sm" />
          <span className="text-[15px] tracking-tight">{name}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                  active === l.href ? "text-accent-soft" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
                {active === l.href && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent" aria-hidden="true" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contact" className="btn-outline hidden min-h-10 rounded-full px-4 sm:inline-flex">
            {cta} <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-line text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden"
      >
        <ul className="container-x flex flex-col py-3">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={close}
                aria-current={active === l.href ? "true" : undefined}
                className={`flex min-h-12 items-center rounded-lg px-3 text-base ${
                  active === l.href ? "bg-surface text-accent-soft" : "text-muted"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-2 px-1 pb-2">
            <a href="#contact" onClick={close} className="btn-primary w-full">
              {cta} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
