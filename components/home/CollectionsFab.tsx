"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { products } from "@/lib/products";
import { weaves } from "@/lib/weaves";
import { PRICE_BANDS } from "@/components/shop/CollectionFilters";

type Entry = { label: string; href: string; count: number };
const count = (test: (p: (typeof products)[number]) => boolean) => products.filter(test).length;

/** The menu's sections: collections, then the same ways in that the shop filters offer. */
const SECTIONS: { title: string; entries: Entry[] }[] = [
  {
    title: "Collections",
    entries: [
      { label: "All Sarees", href: "/shop", count: products.length },
      ...[...new Set(products.map((p) => p.collection))].map((c) => ({
        label: c,
        href: `/shop?q=${encodeURIComponent(c)}`,
        count: count((p) => p.collection === c),
      })),
    ],
  },
  {
    title: "By weave",
    entries: weaves.map((w) => ({ label: w.name, href: `/shop?weave=${w.slug}`, count: count((p) => p.weave === w.slug) })),
  },
  {
    title: "By occasion",
    entries: [...new Set(products.flatMap((p) => p.occasion))]
      .sort()
      .map((o) => ({ label: o, href: `/shop?occasion=${encodeURIComponent(o)}`, count: count((p) => p.occasion.includes(o)) })),
  },
  {
    title: "By price",
    entries: PRICE_BANDS.map((b) => ({ label: b.label, href: `/shop?price=${b.id}`, count: count((p) => p.price >= b.min && p.price < b.max) })),
  },
];

/**
 * Phones: the hero's "Discover the Collection" as a floating button at the bottom
 * right, just above the tab bar. It opens a scrolling menu of collections, weaves,
 * occasions and price ranges; choosing one opens the shop filtered to it. Escape,
 * the close button or a tap outside closes it.
 */
export function CollectionsFab() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  // Slides off to the right while the page is scrolled down, and back on scrolling up
  // (or near the top), matching the tab bar shrinking.
  const [tucked, setTucked] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 40) setTucked(false);
      else if (y - last > 6) setTucked(true);
      else if (last - y > 6) setTucked(false);
      else return;
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={root} className="collections-fab md:hidden" data-tucked={(tucked && !open) || undefined}>
      {open && (
        <nav id={id} aria-label="Collections" className="collections-fab-panel">
          <p className="collections-fab-title">Discover the collection</p>
          {/* Scrolls on its own within the panel; each section's heading stays in view. */}
          <div className="collections-fab-scroll">
            {SECTIONS.map((sec) => (
              <section key={sec.title} aria-label={sec.title}>
                <h2 className="collections-fab-heading">{sec.title}</h2>
                <ul>
                  {sec.entries.map((e) => (
                    <li key={e.href}>
                      <Link href={e.href} className="collections-fab-link" onClick={() => setOpen(false)}>
                        {e.label} <span className="text-ink-soft">{e.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </nav>
      )}
      <button
        ref={button}
        type="button"
        className="collections-fab-button"
        aria-label={open ? "Close collections" : "Discover the collection"}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Both icons stay mounted so the arrow can turn into the cross (and back). */}
        <span className="fab-icon fab-icon-open" aria-hidden>
          <ArrowUpRight size={22} strokeWidth={1.6} />
        </span>
        <span className="fab-icon fab-icon-close" aria-hidden>
          <X size={22} strokeWidth={1.6} />
        </span>
      </button>
    </div>
  );
}
