"use client";

import { useRef, useState } from "react";
import type { ProductImage } from "@/lib/products";

/**
 * Tablet and desktop: thumbnails in a column beside a viewer that scrolls
 * vertically, one image per snap. Phones: a full-width carousel you swipe
 * sideways, with dots, so it never fights the page's own vertical scroll.
 */
export function ProductGallery({ images, name, filter }: { images: ProductImage[]; name: string; filter?: string }) {
  const tint = filter ? { filter } : undefined;
  const [active, setActive] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const swipe = useRef<HTMLDivElement>(null);

  const show = (i: number) => {
    setActive(i);
    strip.current?.scrollTo({ top: strip.current.clientHeight * i, behavior: "smooth" });
    swipe.current?.scrollTo({ left: swipe.current.clientWidth * i, behavior: "smooth" });
  };

  return (
    <section aria-label={`${name} images`} className="min-w-0 lg:sticky lg:top-24 lg:self-start">
      {/* Phones */}
      <div className="-mx-[clamp(16px,4vw,64px)] md:hidden">
        <div
          ref={swipe}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-sand-soft [scrollbar-width:none]"
          aria-roledescription="carousel"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== active) setActive(i);
          }}
        >
          {images.map((img, i) => (
            <figure
              key={img.label}
              className="w-full shrink-0 snap-center"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${images.length}: ${img.label}`}
            >
              <img src={img.src} alt={img.alt} style={tint} className="aspect-[4/5] w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-2 flex justify-center" role="tablist" aria-label="Choose image">
            {images.map((img, i) => (
              <button
                key={img.label}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Image ${i + 1}: ${img.label}`}
                onClick={() => show(i)}
                className="grid size-11 place-items-center"
              >
                <span className={`block h-1.5 rounded-full transition-all ${active === i ? "w-6 bg-ink" : "w-1.5 bg-ink/30"}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tablet and desktop */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[84px_1fr] gap-4">
          <ul className="flex flex-col gap-3" role="tablist" aria-label="Choose image">
            {images.map((img, i) => (
              <li key={img.label}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-current={active === i}
                  aria-label={img.label}
                  className="thumb block bg-sand-soft"
                  onClick={() => show(i)}
                >
                  <img src={img.src} alt="" style={tint} width={84} height={110} className="h-[110px] w-[84px] object-cover" />
                </button>
              </li>
            ))}
          </ul>
          <div
            ref={strip}
            className="aspect-[600/880] snap-y snap-mandatory overflow-y-auto overscroll-y-contain bg-sand-soft [scrollbar-width:none]"
            onScroll={(e) => {
              const el = e.currentTarget;
              const i = Math.round(el.scrollTop / el.clientHeight);
              if (i !== active) setActive(i);
            }}
          >
            {images.map((img, i) => (
              <figure key={img.label} className="h-full w-full snap-start snap-always" aria-hidden={active !== i}>
                <img src={img.src} alt={img.alt} style={tint} className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
