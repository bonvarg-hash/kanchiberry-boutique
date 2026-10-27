"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Outline pill link whose arrow turns to point at the cursor wherever it is on the
 * page, with a soft glow that follows the pointer across the pill. On touch and
 * with reduced motion the arrow simply points right.
 */
export function CursorCta({ href, children }: { href: string; children: ReactNode }) {
  const link = useRef<HTMLAnchorElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    let turned = 0; // running angle, so the arrow always takes the short way round
    const update = () => {
      frame = 0;
      const a = link.current;
      const d = dot.current;
      if (!a || !d) return;
      const c = d.getBoundingClientRect();
      const angle = Math.atan2(y - (c.top + c.height / 2), x - (c.left + c.width / 2));
      turned += Math.atan2(Math.sin(angle - turned), Math.cos(angle - turned));
      d.style.setProperty("--cta-angle", `${turned}rad`);
      const r = a.getBoundingClientRect();
      a.style.setProperty("--cta-x", `${x - r.left}px`);
      a.style.setProperty("--cta-y", `${y - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Link ref={link} href={href} transitionTypes={["page-rise"]} className="cursor-cta shrink-0">
      <span>{children}</span>
      <span ref={dot} className="cursor-cta-dot" aria-hidden>
        <ArrowRight size={20} strokeWidth={1.8} />
      </span>
    </Link>
  );
}
