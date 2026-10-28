"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { useOpenProduct } from "@/components/product/ProductSheet";

/** When the Festive Edit offer closes: a seven-day offer from 27 October (placeholder, India time). */
const OFFER_ENDS = new Date("2026-11-03T23:59:59+05:30").getTime();

/** Two columns of photos drifting vertically in opposite directions, looping. */
const COLUMNS = [
  [
    {
      src: "/photos/kb-6.jpg",
      alt: "A model in a bottle-green Kanjivaram silk saree with a gold temple necklace",
    },
    {
      src: "/photos/kb-16.jpg",
      alt: "Close view of a rose and gold zari border on violet silk",
    },
    {
      src: "/photos/kb-18.jpg",
      alt: "A model in a black and gold striped silk saree with a jasmine garland",
    },
    {
      src: "/photos/kb-11.jpg",
      alt: "A model in a violet and rose Kanjivaram holding a brass hand mirror",
    },
  ],
  [
    {
      src: "/photos/kb-9.jpg",
      alt: "The pleats of a striped black and gold Kanjivaram saree",
    },
    {
      src: "/photos/kb-21.jpg",
      alt: "A model in a black and gold striped silk saree, smiling over her shoulder",
    },
    {
      src: "/photos/kb-14.jpg",
      alt: "A model seated in a violet silk saree with a pink zari border",
    },
    {
      src: "/photos/kb-12.jpg",
      alt: "A model leaning on a ledge in a violet silk saree with a rose-pink border",
    },
  ],
].map((col) =>
  col.map((photo) => ({
    ...photo,
    product: products.find((p) => p.images.some((i) => i.src === photo.src)),
  })),
);

const split = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
};

/** Photo collage beside a live countdown to the end of the festive offer. */
export function FestiveCountdown() {
  // Rendered empty on the server and filled in once the clock is known, so the
  // static page never shows a stale time.
  const openProduct = useOpenProduct();
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(OFFER_ENDS - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  const ended = left !== null && left <= 0;
  const t = split(left ?? 0);
  const units = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.minutes },
    { label: "Seconds", value: t.seconds },
  ];

  return (
    <section aria-labelledby="festive-title" className="bg-mist">
      <div className="wrap grid gap-14 max-md:gap-10 pt-16 lg:grid-cols-2 lg:gap-20 lg:pt-0">
        <div className="photo-loop relative h-[clamp(440px,110vw,640px)] lg:h-auto">
          <div className="photo-loop-grid grid grid-cols-2 gap-4 sm:gap-5">
            {COLUMNS.map((col, c) => (
              <div
                key={c}
                className={`photo-loop-col ${c % 2 ? "is-down" : ""}`}
              >
                {/* The column three times over, so moving it by a third of its height loops seamlessly. */}
                {[0, 1, 2].map((copy) =>
                  col.map((p) => {
                    // Only the first copy is announced and focusable; the others close the loop.
                    const repeat = copy > 0;
                    const img = (
                      <img
                        src={p.src}
                        alt={repeat ? "" : p.alt}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover"
                      />
                    );
                    if (!p.product)
                      return (
                        <div key={`${copy}-${p.src}`} className="mb-4 sm:mb-5">
                          {img}
                        </div>
                      );
                    return (
                      <Link
                        key={`${copy}-${p.src}`}
                        href={`/sarees/${p.product.slug}`}
                        className="loop-tile group mb-4 sm:mb-5"
                        tabIndex={repeat ? -1 : undefined}
                        aria-hidden={repeat ? true : undefined}
                        onClick={(e) => {
                          if (
                            e.metaKey ||
                            e.ctrlKey ||
                            e.shiftKey ||
                            e.button !== 0
                          )
                            return;
                          if (openProduct(e.currentTarget.href))
                            e.preventDefault();
                        }}
                      >
                        {img}
                        <span className="loop-tile-cap">
                          {p.product.name}{" "}
                          <ArrowRight size={15} strokeWidth={1.6} aria-hidden />
                        </span>
                      </Link>
                    );
                  }),
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="self-center pb-24 max-md:pb-16 text-center lg:py-[188px]">
          <h2 id="festive-title" className="section-title text-[#87264D]">
            Up to <em className="shimmer text-[#4E3F47]">25% Off</em>
            <br />
            the Festive Silk Edit
          </h2>
          {ended ? (
            <p className="lede mx-auto mt-8 max-md:mt-3">
              The festive offer has ended. Thank you for shopping the edit.
            </p>
          ) : (
            <div
              role="timer"
              aria-live="off"
              aria-label="Time left in the offer"
              className="mt-10 flex justify-center gap-2 sm:gap-4"
            >
              {units.map((u) => (
                <div
                  key={u.label}
                  className="grid w-[76px] place-items-center bg-[#F3F4EF] px-2 pb-4 pt-5 sm:w-[112px]"
                >
                  <span className="text-[clamp(2rem,4vw,3.4rem)] leading-none tabular-nums text-[#190E14]">
                    {left === null ? "--" : String(u.value).padStart(2, "0")}
                  </span>
                  <span className="mt-3 text-[11px] uppercase tracking-[0.14em] sm:text-[13px] sm:tracking-[0.16em] text-ink-soft">
                    {u.label}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-8 text-[15px] text-ink-soft">
            More exclusive offers for Kanchiberry members.
          </p>
          <Link href="/shop" className="btn btn-primary btn-shimmer mt-8">
            Shop the Edit
          </Link>
        </div>
      </div>
    </section>
  );
}
