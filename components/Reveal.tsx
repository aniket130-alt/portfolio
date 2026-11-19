"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Gentle fade/slide on first entry. Content is visible without JS and with
 * prefers-reduced-motion (handled in globals.css).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    // Already on screen at load → don't hide it.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) return;

    el.dataset.reveal = "pending";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.animationDelay = `${delay}ms`;
        el.dataset.reveal = "shown";
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
