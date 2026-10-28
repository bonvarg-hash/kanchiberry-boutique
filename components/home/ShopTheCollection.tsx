"use client";

import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import { Reveal } from "@/components/Reveal";

/** Every card shares one layout: name and tagline each keep a two-line slot, so prices and buttons line up, and the button always reads View Details. */
function Card({ p }: { p: Product }) {
  const off = p.compareAtPrice && p.compareAtPrice > p.price ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  return (
    <article className="shop-card group flex h-full flex-col border border-sand bg-[#F3F4EF] p-4 transition-shadow duration-500 hover:shadow-[0_24px_40px_-24px_rgba(25,14,20,0.35)]">
      <Link href={`/sarees/${p.slug}`} className="relative block overflow-hidden bg-sand-soft" tabIndex={-1} aria-hidden>
        {off > 0 && (
          <span className="absolute left-0 top-4 z-10 bg-[#190E14] px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-[#EEE9E0]">
            {off}% Off
          </span>
        )}
        <img src={p.images[0].src} alt={p.images[0].alt} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-cloth)] group-hover:scale-[1.04]" />
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-5 text-center">
        <h3 className="flex min-h-[2.5em] items-center justify-center text-[24px] leading-tight" style={{ fontFamily: "var(--font-title)" }}>
          <span className="line-clamp-2">{p.name}</span>
        </h3>
        <p className="mx-auto mt-2 line-clamp-2 min-h-[3.25em] max-w-[32ch] text-[16px] leading-relaxed text-ink-soft">{p.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="text-[19px]">
            {formatPrice(p.price)}{" "}
            {p.compareAtPrice && p.compareAtPrice > p.price ? (
              <s className="text-[15px] text-ink-soft">
                <span className="sr-only">Was </span>
                {formatPrice(p.compareAtPrice)}
              </s>
            ) : (
              <span className="text-[15px] text-ink-soft">(sample)</span>
            )}
          </span>
          <Link
            href={`/sarees/${p.slug}`}
            aria-label={`View details of ${p.name}`}
            className="inline-flex min-h-11 shrink-0 items-center bg-[#190E14] px-4 text-[11px] uppercase tracking-[0.14em] text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ShopTheCollection({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="shop-title">
      <div className="wrap py-24 text-center max-md:py-16 lg:py-32">
        <h2 id="shop-title" className="section-title text-[#87264D]">
          Find Your <em className="shimmer text-[#4E3F47]">Perfect Drape</em>
          <br />
          Shop the Collection
        </h2>
        <p className="lede mx-auto mt-5 max-w-[56ch]! max-md:mt-3">Explore our edit of silk, brocade and handloom sarees, chosen for every kind of celebration.</p>
        {/* Phones: a swipeable row with the next card peeking in, instead of a long stack. */}
        <div className="mt-14 max-md:mt-8 grid gap-6 text-left max-sm:-mx-(--wrap-pad) max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-4 max-sm:overflow-x-auto max-sm:overflow-y-hidden max-sm:overscroll-x-contain max-sm:[touch-action:pan-x_pan-y] max-sm:scroll-px-(--wrap-pad) max-sm:px-(--wrap-pad) max-sm:pb-2 max-sm:[scrollbar-width:none] sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 120} className="h-full max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start">
              <Card p={p} />
            </Reveal>
          ))}
        </div>
        <Link href="/shop" className="text-link mt-12 text-[18px] max-md:mt-8">
          View all sarees <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
