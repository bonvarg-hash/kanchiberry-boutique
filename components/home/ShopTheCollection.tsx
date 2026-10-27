"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { Reveal } from "@/components/Reveal";

function Card({ p }: { p: Product }) {
  const { addToBag, inBag } = useStore();
  const [added, setAdded] = useState(false);
  const off = p.compareAtPrice && p.compareAtPrice > p.price ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  return (
    <article className="shop-card group flex h-full flex-col border border-sand bg-paper p-4 transition-shadow duration-500 hover:shadow-[0_24px_40px_-24px_rgba(25,14,20,0.35)]">
      <Link href={`/sarees/${p.slug}`} className="relative block overflow-hidden bg-sand-soft">
        {off > 0 && (
          <span className="absolute left-0 top-4 z-10 bg-[#190E14] px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-[#EEE9E0]">
            {off}% Off
          </span>
        )}
        <img src={p.images[0].src} alt={p.images[0].alt} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-cloth)] group-hover:scale-[1.04]" />
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-5 text-center">
        <Link href={`/sarees/${p.slug}`} className="text-[24px] leading-tight hover:underline" style={{ fontFamily: "var(--font-title)" }}>
          {p.name}
        </Link>
        <p className="mx-auto mt-2 max-w-[32ch] text-[16px] leading-relaxed text-ink-soft">{p.tagline}</p>
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
          {/* One of each saree per order: once added, the button links to the bag instead. */}
          {inBag(p.slug) ? (
            <Link
              href="/bag"
              className="inline-flex min-h-10 items-center gap-1.5 border border-[#190E14] px-4 text-[11px] uppercase tracking-[0.14em] text-[#190E14]"
            >
              <Check size={13} aria-hidden /> {added ? "Added" : "In Bag"}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                addToBag(p.slug);
                setAdded(true);
                setTimeout(() => setAdded(false), 2200);
              }}
              className="inline-flex min-h-10 items-center gap-1.5 bg-[#190E14] px-4 text-[11px] uppercase tracking-[0.14em] text-white"
            >
              Add to Bag
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ShopTheCollection({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="shop-title">
      <div className="wrap py-24 text-center lg:py-32">
        <h2 id="shop-title" className="section-title text-[#87264D]">
          Find Your <em className="shimmer text-[#4E3F47]">Perfect Drape</em>
          <br />
          Shop the Collection
        </h2>
        <p className="lede mx-auto mt-5 max-w-[56ch]!">Explore our edit of silk, brocade and handloom sarees, chosen for every kind of celebration.</p>
        <div className="mt-14 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 120} className="h-full">
              <Card p={p} />
            </Reveal>
          ))}
        </div>
        <Link href="/shop" className="text-link mt-12 text-[18px]">
          View all sarees <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
