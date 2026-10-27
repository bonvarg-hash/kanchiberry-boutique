"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * A stat in a ringed circle. When it scrolls into view the accent arc draws in,
 * the number counts up, and the arc then drifts slowly around the circle.
 */
export function StatRing({ value, label, start, reverse = false }: { value: number; label: string; start: number; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setInView(true);
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / dur);
          setShown(Math.round(value * (1 - Math.pow(1 - k, 3))));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div ref={ref} className="stat-ring relative grid size-[170px] place-items-center sm:size-[190px]" data-in={inView || undefined}>
      <div className="stat-orbit absolute inset-0" style={{ "--start": `${start}deg`, animationDirection: reverse ? "reverse" : "normal" } as CSSProperties}>
        <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
          <circle cx="100" cy="100" r="96" fill="var(--color-paper)" stroke="var(--color-sand)" strokeWidth="1" />
          <circle className="stat-arc" cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="relative text-center">
        <p className="text-[clamp(2.6rem,5vw,3.4rem)] leading-none tabular-nums" style={{ fontFamily: "var(--font-title)" }}>
          <span aria-hidden>{shown}</span>
          <span className="sr-only">{value}</span>
        </p>
        <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-ink-soft">{label}</p>
      </div>
    </div>
  );
}
