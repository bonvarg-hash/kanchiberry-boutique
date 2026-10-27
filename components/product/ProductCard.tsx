"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export function ProductCard({ product: p, priority = false }: { product: Product; priority?: boolean }) {
  const { isWished, toggleWish } = useStore();
  const wished = isWished(p.slug);
  return (
    <article className="group relative">
      <Link href={`/sarees/${p.slug}`} className="block">
        <span className="weave-tile block aspect-[600/880]">
          <img src={p.images[0].src} alt={p.images[0].alt} loading={priority ? "eager" : "lazy"} />
        </span>
        <span className="mt-4 block">
          <span className="eyebrow block">{p.weaveName}</span>
          <span className="mt-1 block text-[26px] leading-tight" style={{ fontFamily: "var(--font-title)" }}>{p.name}</span>
          <span className="mt-1 block text-[18px]">
            {formatPrice(p.price)}{" "}
            {p.compareAtPrice && p.compareAtPrice > p.price && (
              <s className="text-[15px] text-ink-soft">
                <span className="sr-only">Was </span>
                {formatPrice(p.compareAtPrice)}
              </s>
            )}
          </span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => toggleWish(p.slug)}
        aria-pressed={wished}
        aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
        className="icon-btn absolute right-2 top-2 bg-paper/85"
      >
        <Heart size={17} strokeWidth={1.5} fill={wished ? "currentColor" : "none"} className={wished ? "text-berry" : ""} />
      </button>
    </article>
  );
}
