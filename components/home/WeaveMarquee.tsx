"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { weaves } from "@/lib/weaves";

/**
 * Every weave the boutique sells, drifting slowly sideways. It is a real
 * scroll strip that loops endlessly both ways: swipe, drag, scroll or tab
 * through it and pick a weave. The drift pauses while you interact and is off
 * for reduced motion.
 */
export function WeaveMarquee() {
  const strip = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    // Three copies of the row; we always sit in the middle one, wrapping by one
    // row width in either direction, so scrolling never reaches an end.
    const rowW = () => el.scrollWidth / 3;
    let pos = rowW();
    el.scrollLeft = pos;
    const wrap = () => {
      const w = rowW();
      if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
      else if (el.scrollLeft > w * 1.5) el.scrollLeft -= w;
    };
    const onScroll = () => {
      wrap();
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft; // the visitor moved it
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      if (!reduce && visible && t > pausedUntil.current) {
        // keep a fractional position: scrollLeft alone rounds and would stall
        pos += dt * 0.06; // about 60px per second
        const w = rowW();
        if (pos > w * 1.5) pos -= w;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const hold = (ms = 2500) => (pausedUntil.current = performance.now() + ms);

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0" aria-hidden={hidden || undefined}>
      {weaves.map((w) => (
        <li key={w.slug} className="flex items-center">
          <Link
            href={`/shop?weave=${w.slug}`}
            tabIndex={hidden ? -1 : undefined}
            className="group flex min-h-11 items-center gap-3 px-5 sm:px-7"
          >
            <img
              src={w.photo.src}
              alt=""
              width={32}
              height={32}
              loading="lazy"
              className="size-8 rounded-full object-cover ring-1 ring-sand transition-transform duration-500 group-hover:scale-110"
            />
            <span className="whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.22em] text-ink-soft transition-colors group-hover:text-ink sm:text-[13px]">
              {w.name}
            </span>
          </Link>
          <span aria-hidden className="text-[10px] text-sage">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Weaves we offer" className="border-y border-sand bg-paper">
      <div
        ref={strip}
        className="flex overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerEnter={() => hold(1e9)}
        onPointerLeave={() => hold(800)}
        onPointerDown={() => hold(4000)}
        onTouchStart={() => hold(4000)}
        onTouchEnd={() => hold(2500)}
        onWheel={() => hold(2500)}
        onFocus={() => hold(1e9)}
        onBlur={() => hold(800)}
      >
        {row(true)}
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
