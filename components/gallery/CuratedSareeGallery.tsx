"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { SareeItem } from "./SareeItem";
import { RAIL_COUNT_EVENT } from "./RailEyebrow";

/**
 * The boutique rail. Each saree hangs side-on; hovering (or keyboard focus, or a
 * first tap on touch) turns it to face the viewer. Clicking it opens its
 * product page.
 */
export function CuratedSareeGallery({ products }: { products: Product[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  // The rail is filled end to end: when the viewport is wider than the collection, it repeats.
  const [count, setCount] = useState(products.length);
  const rail = Array.from({ length: count }, (_, i) => products[i % products.length]);
  const scroller = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastPointer = useRef<{ type: string; at: number }>({ type: "mouse", at: 0 });

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el.parentElement!);
      const rest = parseFloat(cs.getPropertyValue("--rest-w"));
      const per = rest + parseFloat(cs.getPropertyValue("--gap"));
      // Keep room for one saree to open (it widens to --open-w plus its margins),
      // so a saree opened at the right end is never cropped by the rail's edge.
      const room = parseFloat(cs.getPropertyValue("--open-w")) + 44 - rest;
      const needed = Math.floor((el.clientWidth - 44 - room) / per);
      const total = Math.max(products.length, needed || 0);
      setCount(total);
      // The eyebrow counts what actually hangs (the desktop rail repeats sarees to fill its width).
      if (el.offsetParent) window.dispatchEvent(new CustomEvent(RAIL_COUNT_EVENT, { detail: total }));
      updateEdges();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [products.length, updateEdges]);

  // Pause the wind animation while the rail is off screen.
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-idle", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Touch: tapping anywhere outside the rail lets the focused saree rest again.
  useEffect(() => {
    if (open === null) return;
    const onDown = (e: globalThis.PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if (!(e.target as Element).closest?.("[data-saree]")) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const center = (i: number) => {
    setTimeout(() => items.current[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }), 380);
  };

  const handlersFor = (i: number) => ({
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => setOpen(i), 70);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => setOpen((cur) => (cur === i ? null : cur)), 140);
    },
    onPointerDown: (e: PointerEvent) => {
      lastPointer.current = { type: e.pointerType, at: Date.now() };
    },
    onFocus: () => {
      // A tap focuses the link on some browsers; let the click decide instead.
      const recentTouch = lastPointer.current.type !== "mouse" && Date.now() - lastPointer.current.at < 600;
      if (!recentTouch) setOpen(i);
    },
    onBlur: (e: React.FocusEvent) => {
      if (!(e.relatedTarget as Element | null)?.closest?.("[data-saree]")) setOpen((cur) => (cur === i ? null : cur));
    },
    onClick: (e: MouseEvent) => {
      // A click (or Enter) follows the link straight to the product page.
      // On touch there is no hover, so the first tap turns the saree and the second opens it.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const touch = e.detail > 0 && lastPointer.current.type !== "mouse";
      if (touch && open !== i) {
        e.preventDefault();
        setOpen(i);
        center(i);
      }
    },
  });

  
  return (
    <div ref={root} className="rack">
      <p id="rack-help" className="sr-only">
        Use Tab to move along the rail. Each saree turns to face you when focused; press Enter to open its details.
      </p>
      <div ref={scroller} className="rack-scroller" onScroll={updateEdges}>
        <div
          className={`rack-track${open !== null ? " has-open" : ""}`}
          role="list"
          aria-describedby="rack-help"
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse") return;
            clearTimeout(hoverTimer.current);
            hoverTimer.current = setTimeout(() => setOpen(null), 140);
          }}
        >
          <span className="rack-rail" aria-hidden />
          {rail.map((p, i) => (
            <div role={i < products.length ? "listitem" : undefined} key={`${p.slug}-${i}`} className="contents">
              <SareeItem
                ref={(el) => {
                  items.current[i] = el;
                }}
                product={p}
                index={i}
                open={open === i}
                duplicate={i >= products.length}
                {...handlersFor(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Count and scroll controls under the rail */}
      <div className="wrap mt-4 flex items-center justify-between gap-6">
        <span />
        <div className="flex gap-3">
          <button type="button" className="rack-arrow" aria-label="Scroll rail left" disabled={edges.start} onClick={() => scrollBy(-1)}>
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <button type="button" className="rack-arrow" aria-label="Scroll rail right" disabled={edges.end} onClick={() => scrollBy(1)}>
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
