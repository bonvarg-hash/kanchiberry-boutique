"use client";

import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { useOpenProduct } from "@/components/product/ProductSheet";

/**
 * An image-led saree tile for All Collections: the photo leads, with a small
 * caption beneath. On desktop a quiet "View details" appears on hover; a click or
 * tap opens the saree as a layer that slides up from the bottom.
 */
/** `href` overrides the link, e.g. the gift finder opens the saree in gift mode. */
export function SareeTile({ p, priority = false, href }: { p: Product; priority?: boolean; href?: string }) {
  const openProduct = useOpenProduct();
  const { isWished, toggleWish } = useStore();
  const wished = isWished(p.slug);
  const sale = p.compareAtPrice && p.compareAtPrice > p.price;
  return (
    <article className="saree-tile group relative">
      <Link
        href={href ?? `/sarees/${p.slug}`}
        className="block"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          if (openProduct(e.currentTarget.href)) e.preventDefault();
        }}
      >
        <span className="relative block aspect-[4/5] overflow-hidden bg-sand-soft">
          <img
            src={p.images[0].src}
            alt={p.images[0].alt}
            loading={priority ? "eager" : "lazy"}
            className="size-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-cloth)] group-hover:scale-[1.03]"
          />
          {/* Desktop: a subtle call to action on hover. */}
          <span className="saree-tile-cta" aria-hidden>
            View details <ArrowUpRight size={14} strokeWidth={1.6} />
          </span>
        </span>
        <span className="mt-3 block truncate text-[14px] sm:text-[15px]">{p.name}</span>
        <span className="mt-1 flex items-baseline gap-2 tabular-nums">
          <span className="text-[14px] sm:text-[15px]">
            {sale && <span className="sr-only">Now </span>}
            {formatPrice(p.price)}
          </span>
          {sale && (
            <s className="text-[12px] text-ink-soft sm:text-[13px]">
              <span className="sr-only">Was </span>
              {formatPrice(p.compareAtPrice!)}
            </s>
          )}
        </span>
        <span className="mt-0.5 block text-[12px] text-ink-soft">{p.weaveName}</span>
      </Link>
      <button
        type="button"
        onClick={() => toggleWish(p.slug)}
        aria-pressed={wished}
        aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
        className="saree-tile-wish"
        data-on={wished || undefined}
      >
        <Heart size={16} strokeWidth={1.5} fill={wished ? "currentColor" : "none"} aria-hidden />
      </button>
    </article>
  );
}
