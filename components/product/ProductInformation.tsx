"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Heart } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

type Tab = { id: string; label: string; content: React.ReactNode };

/**
 * Product information. From tablet width: accessible tabs (click, or arrow keys,
 * Home and End). On phones: stacked sections that open with a tap, which beats a
 * row of tabs running off the edge of the screen.
 */
function InfoTabs({ tabs }: { tabs: Tab[] }) {
  return (
    <>
      <div className="mt-10 border-t border-sand max-md:order-10 md:hidden">
        {tabs.map((t, i) => (
          <details key={t.id} className="info-acc group border-b border-sand" open={i === 0}>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[15px] [&::-webkit-details-marker]:hidden">
              {t.label}
              <ChevronDown size={18} strokeWidth={1.5} aria-hidden className="shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="pb-6 text-[15px] leading-relaxed text-ink-soft">{t.content}</div>
          </details>
        ))}
      </div>
      <div className="hidden md:block">
        <Tabs tabs={tabs} />
      </div>
    </>
  );
}

function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex gap-6 overflow-x-auto border-b border-sand [scrollbar-width:none]"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(active + 1);
          else if (e.key === "ArrowLeft") go(active - 1);
          else if (e.key === "Home") go(0);
          else if (e.key === "End") go(tabs.length - 1);
          else return;
          e.preventDefault();
        }}
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`info-tab relative shrink-0 whitespace-nowrap pb-3 pt-1 text-[14px] tracking-[0.04em] transition-colors ${
              active === i ? "text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== i}
          tabIndex={0}
          className="info-panel pt-6 text-[16px] leading-relaxed text-ink-soft"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}

export function ProductInformation({ product: p, variant = 0, onVariant }: { product: Product; variant?: number; onVariant?: (i: number) => void }) {
  const { addToBag, isWished, toggleWish, inBag, bag } = useStore();
  const [added, setAdded] = useState(false);
  // One of each saree per order: once it's in the bag, the buy button turns into a
  // link to the bag instead of adding another.
  const inBagLine = bag.find((l) => l.slug === p.slug);
  const isInBag = inBag(p.slug);
  const wished = isWished(p.slug);
  const colour = p.variants[variant] ?? p.variants[0];
  const variantName = p.variants.length > 1 ? colour.name : undefined;
  const add = () => {
    addToBag(p.slug, 1, variantName);
    setAdded(true);
  };
  const photoCredit = p.images.find((i) => i.credit && i.credit !== "Kanchiberry")?.credit;
  // Phones: the Add to Bag row is pinned to the bottom edge for the whole visit to a
  // saree, so the tab bar steps aside while a saree is open.
  useEffect(() => {
    document.documentElement.dataset.buybar = "";
    return () => {
      delete document.documentElement.dataset.buybar;
    };
  }, []);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2600);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <section aria-labelledby="pdp-title" className="min-w-0 max-md:contents lg:pt-6">
      {/* Phones: this column's pieces join the photos in one stack (display: contents) and
          are reordered: name and price above the photos, then colour, description and
          details below, with Add to Bag pinned to the bottom edge. Wider screens keep the
          written order beside the photos. */}
      <p className="eyebrow max-md:order-1">
        {p.weaveName} · {p.collection}
      </p>
      <h1 id="pdp-title" className="serif mt-3 text-[clamp(2.5rem,6vw,5rem)] font-light leading-[0.92] max-md:order-2">
        {p.name}
      </h1>
      <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-ink-soft max-md:order-9 max-md:mt-6">{p.description}</p>
      {p.variants.length > 1 && (
        <fieldset className="mt-10 max-md:order-6 max-md:mt-6">
          <legend className="text-[13px] text-ink-soft">
            Colour: <span className="ml-1 inline-flex items-center rounded-md border border-sand px-2 py-0.5 text-[13px] text-ink" aria-live="polite">{colour.name}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {p.variants.map((v, i) => (
              <label key={v.name} className="cursor-pointer" title={v.name}>
                <input type="radio" name={`colour-${p.slug}`} className="peer sr-only" checked={variant === i} onChange={() => onVariant?.(i)} />
                <span
                  className="block size-11 rounded-full ring-1 ring-sand ring-offset-2 ring-offset-paper transition peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-berry hover:ring-ink/50"
                  style={
                    i === 0 && p.fabric
                      ? { backgroundImage: `url("${p.fabric.body}")`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { background: `linear-gradient(135deg, ${v.hex} 0 62%, ${v.accent ?? v.hex} 62% 70%, ${v.hex} 70%)` }
                  }
                />
                <span className="sr-only">{v.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 max-md:order-3 max-md:mt-3">
        <p className="flex items-baseline gap-3 leading-none max-md:hidden">
          <span className="text-[30px]">{formatPrice(p.price)}</span>
          {p.compareAtPrice && p.compareAtPrice > p.price && (
            <s className="text-[20px] text-ink-soft/70">
              <span className="sr-only">Was </span>
              {formatPrice(p.compareAtPrice)}
            </s>
          )}
        </p>
        {p.stock !== undefined && p.stock > 0 && p.stock <= 3 && (
          <span className="inline-flex items-center gap-2 rounded-md border border-[#c69a3c]/60 bg-[#fbf6ec] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#8a5a12]">
            <span className="size-1.5 rounded-full bg-[#c0392b] motion-safe:animate-pulse" aria-hidden />
            Only {p.stock} left in stock
          </span>
        )}
      </div>
      {/* Phones: save to wishlist sits just below the photos. */}
      <div className="flex justify-end max-md:order-5 max-md:mt-3 md:hidden">
        <button
          type="button"
          className="btn btn-ghost wish-btn min-h-11 gap-2 px-4 text-[12px]"
          aria-pressed={wished}
          onClick={() => toggleWish(p.slug)}
        >
          <Heart size={17} strokeWidth={1.5} aria-hidden /> {wished ? "Saved to wishlist" : "Save to wishlist"}
        </button>
      </div>
      {/* Phones: a bottom bar with the price on the left (the earlier price small and
          struck through above it) and the bag button on the right. */}
      <div className="mt-5 flex flex-wrap items-stretch gap-3 max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-50 max-md:mt-0 max-md:flex-nowrap max-md:items-center max-md:gap-4 max-md:border-t max-md:border-sand max-md:bg-paper/95 max-md:px-4 max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-md:pt-3 max-md:backdrop-blur">
        <p className="flex shrink-0 flex-col leading-none md:hidden">
          {p.compareAtPrice && p.compareAtPrice > p.price && (
            <s className="text-[14px] text-ink-soft">
              <span className="sr-only">Was </span>
              {formatPrice(p.compareAtPrice)}
            </s>
          )}
          <span className="mt-1.5 text-[24px] font-medium">
            <span className="sr-only">Now </span>
            {formatPrice(p.price)}
          </span>
        </p>
        {isInBag ? (
          <Link href="/bag" className="btn btn-primary min-w-0 flex-1 basis-40 max-md:basis-auto">
            <Check size={16} aria-hidden /> <span className="md:hidden">View Bag</span>
            <span className="max-md:hidden">In Your Bag · View Bag</span>
          </Link>
        ) : (
          <button type="button" className="btn btn-primary min-w-0 flex-1 basis-40 max-md:basis-auto" onClick={add}>
            Add to Bag
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost wish-btn px-4 max-md:hidden"
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWish(p.slug)}
        >
          <Heart size={18} strokeWidth={1.5} />
        </button>
      </div>
      <p role="status" className="mt-3 min-h-5 text-[13px] max-md:order-7 max-md:mt-4">
        {added ? (
          <>Added to your bag.</>
        ) : isInBag && inBagLine?.variant && variantName && inBagLine.variant !== variantName ? (
          <span className="text-ink-soft">
            Already in your bag in {inBagLine.variant}. To choose {variantName} instead, remove it from your bag first.
          </span>
        ) : (
          <span className="text-ink-soft">One per order. Each saree is handwoven, so every piece is one of a kind.</span>
        )}
      </p>
      <p className="text-[12px] text-ink-soft max-md:order-8">Delivery estimates and PIN code checks will appear once a shipping service is connected.</p>

      <InfoTabs
        tabs={[
          {
            id: "details",
            label: "Product Details",
            content: (
              <>
                <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 text-[14px]">
                  <dt>Weave</dt>
                  <dd className="text-ink">{p.weaveName}</dd>
                  <dt>Colour</dt>
                  <dd className="text-ink">{colour.name}</dd>
                  <dt>Length</dt>
                  <dd className="text-ink">{p.length}</dd>
                  <dt>Occasion</dt>
                  <dd className="text-ink">{p.occasion.join(", ")}</dd>
                  <dt>Blouse</dt>
                  <dd className="text-ink">{p.blousePiece}</dd>
                  <dt>Availability</dt>
                  <dd className="text-ink">Sample listing, not available for purchase</dd>
                </dl>
                <p className="mt-4 text-[13px]">Product code {p.id.toUpperCase()}. Measurements are illustrative.</p>
                {/* Openly licensed photos must stay credited; this is the only place it shows. */}
                {photoCredit && <p className="mt-2 text-[13px]">Photos: {photoCredit}.</p>}
              </>
            ),
          },
          {
            id: "fabric",
            label: "Fabric & Craftsmanship",
            content: (
              <>
                <p>{p.craftDetails}</p>
                <p className="mt-3">
                  Read more in <Link href={`/art-of-weaving#${p.weave}`} className="underline">The Art of Weaving</Link>.
                </p>
              </>
            ),
          },
          {
            id: "care",
            label: "Care Instructions",
            content: (
              <ul className="list-disc space-y-1 pl-5">
                {p.careInstructions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            ),
          },
          {
            id: "shipping",
            label: "Shipping & Returns",
            content: <p>Shipping and returns policies are pending and will be published before launch. No delivery timelines are promised in this prototype.</p>,
          },
        ]}
      />


    </section>
  );
}
