"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { SareeItem } from "./SareeItem";
import { useOpenProduct } from "@/components/product/ProductSheet";

const noop = () => {};

/**
 * Touch version of the rail (phones and small tablets). Three sarees across the
 * screen: the centred one faces you and its neighbours are turned slightly.
 * Swipe to browse (snap-to-item); tap a neighbour to bring it to the centre;
 * tap the centred saree or the CTA to slide its details up over the page.
 */
export function MobileSareeCarousel({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const frame = useRef(0);
  const openProduct = useOpenProduct();
  const openDetails = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (openProduct((e.currentTarget as HTMLAnchorElement).href)) e.preventDefault();
  };

  const goTo = useCallback((i: number, smooth = true) => {
    const n = Math.max(0, Math.min(products.length - 1, i));
    const el = items.current[n];
    const sc = scroller.current;
    if (!el || !sc) return;
    sc.scrollTo({ left: el.offsetLeft + el.offsetWidth / 2 - sc.clientWidth / 2, behavior: smooth ? "smooth" : "auto" });
    setActive(n);
  }, [products.length]);

  // Whichever saree is nearest the centre after a swipe becomes the focused one.
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const sc = scroller.current;
      if (!sc) return;
      const mid = sc.scrollLeft + sc.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      items.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
    });
  };

  // Open on the second saree so three are in view from the start, not one with an empty gap beside it.
  useEffect(() => {
    if (products.length > 2) goTo(1, false);
    return () => cancelAnimationFrame(frame.current);
  }, [goTo, products.length]);

  const p = products[active];

  return (
    <div className="rack rack-m">
      <p id="rack-m-help" className="sr-only">
        Swipe or use the previous and next buttons to browse. The centred saree faces you; activate it to open its details.
      </p>
      <div ref={scroller} className="rack-m-scroller" onScroll={onScroll} aria-describedby="rack-m-help">
        <div className="rack-m-track" role="list">
          <span className="rack-rail" aria-hidden />
          {products.map((prod, i) => (
            <div role="listitem" key={prod.slug} className="rack-m-slot" aria-current={i === active || undefined}>
              <SareeItem
                ref={(el) => {
                  items.current[i] = el;
                }}
                product={prod}
                index={i}
                open={i === active}
                onPointerEnter={noop}
                onPointerLeave={noop}
                onPointerDown={noop}
                onFocus={() => i !== active && goTo(i)}
                onBlur={noop}
                onClick={(e: MouseEvent) => {
                  // First tap brings a neighbour to the centre; tapping the centred saree opens it.
                  if (i !== active) {
                    e.preventDefault();
                    goTo(i);
                  } else openDetails(e);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Selected saree: always visible, updates as you browse */}
      <div className="wrap mt-2">
        <div aria-live="polite">
          <p className="eyebrow">
            {p.weaveName} · {p.color}
          </p>
          <p className="mt-1 text-[26px] leading-tight" style={{ fontFamily: "var(--font-title)" }}>
            {p.name}
          </p>
          <p className="mt-1 text-[15px]">
            {formatPrice(p.price)} <span className="text-[11px] text-ink-soft">(sample price)</span>
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[12px] text-ink-soft">Swipe or tap to browse</p>
          <div className="flex items-center gap-1">
            <button type="button" className="rack-arrow size-11!" aria-label="Previous saree" disabled={active === 0} onClick={() => goTo(active - 1)}>
              <ArrowLeft size={17} strokeWidth={1.5} />
            </button>
            <span className="w-14 text-center text-[12px] tabular-nums tracking-[0.12em] text-ink-soft" aria-hidden>
              {String(active + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="rack-arrow size-11!"
              aria-label="Next saree"
              disabled={active === products.length - 1}
              onClick={() => goTo(active + 1)}
            >
              <ArrowRight size={17} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <Link href={`/sarees/${p.slug}`} onClick={openDetails} className="btn btn-primary mt-4 w-full whitespace-nowrap">
          Explore This Saree <span aria-hidden>→</span>
        </Link>
        <p className="sr-only" aria-live="polite">
          Saree {active + 1} of {products.length}
        </p>
      </div>
    </div>
  );
}
