"use client";

import Link from "next/link";
import { formatPrice, getProduct, type Product } from "@/lib/products";
import { Check, Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";

/**
 * A saved saree, laid out like a Shopping Bag line: photo, weave, name, colour and
 * price, then one status button (Add to Cart, Sold Out or Already in Cart) beside
 * a Remove link.
 */
function WishRow({ p }: { p: Product }) {
  const { addToBag, inBag, toggleWish } = useStore();
  const added = inBag(p.slug);
  const soldOut = p.stock === 0;
  const sale = p.compareAtPrice && p.compareAtPrice > p.price;
  return (
    <li className="grid grid-cols-[96px_1fr] gap-5 py-6 sm:grid-cols-[120px_1fr_auto]">
      <Link href={`/sarees/${p.slug}`} className="block self-start bg-sand-soft">
        <img src={p.images[0].src} alt={p.name} loading="lazy" className="aspect-[600/880] w-full object-cover" />
      </Link>
      <div>
        <p className="eyebrow">{p.weaveName}</p>
        <Link href={`/sarees/${p.slug}`} className="mt-1 block font-sans text-[21px] leading-tight underline-offset-4 sm:text-[28px] hover:text-berry hover:underline">
          {p.name}
        </Link>
        <p className="mt-1 text-[13px] text-ink-soft">
          {p.color} · {formatPrice(p.price)}{" "}
          {sale && (
            <s className="text-[12px]">
              <span className="sr-only">Was </span>
              {formatPrice(p.compareAtPrice!)}
            </s>
          )}
        </p>
        <div className="mt-5 flex items-center gap-5">
          {soldOut ? (
            <button type="button" className="wish-row-btn" disabled>
              Sold Out
            </button>
          ) : added ? (
            <Link href="/bag" className="wish-row-btn is-in-cart" aria-label={`${p.name} is already in your cart. View cart`}>
              <Check size={14} strokeWidth={2} aria-hidden /> Already in Cart
            </Link>
          ) : (
            <button type="button" className="wish-row-btn" onClick={() => addToBag(p.slug)}>
              Add to Cart
            </button>
          )}
          <button type="button" onClick={() => toggleWish(p.slug)} className="ml-auto min-h-11 px-1 text-[13px] text-ink-soft underline hover:text-ink sm:ml-0" aria-label={`Remove ${p.name} from wishlist`}>
            Remove
          </button>
        </div>
      </div>
      <p className="col-start-2 text-[15px] tabular-nums sm:col-start-3 sm:text-right">{formatPrice(p.price)}</p>
    </li>
  );
}

export default function WishlistPage() {
  const { wishlist, ready } = useStore();
  const items = wishlist.flatMap((s) => {
    const p = getProduct(s);
    return p ? [p] : [];
  });

  return (
    <div className="wrap pb-24 pt-14 max-md:pb-16 max-md:pt-8 lg:pt-20">
      <title>Wishlist · Kanchiberry</title>
      <PageHeader title="Wishlist" description="Sarees you’ve saved, kept on this device." className="mb-12 max-md:mb-8" />
      {!ready ? (
        <div className="min-h-[30vh]" aria-busy="true" />
      ) : items.length === 0 ? (
        // Empty state: a quiet box under the page title, with a smaller heading so the
        // title stays the largest thing on the page.
        <div className="empty-state">
          <span className="empty-state-icon">
            <Heart size={22} strokeWidth={1.5} aria-hidden />
          </span>
          <p className="empty-state-title">Nothing saved yet</p>
          <p className="empty-state-text">Tap the heart on any saree to keep it here.</p>
          <Link href="/shop" className="btn btn-primary mt-7">
            Shop All Sarees
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-sand border-y border-sand">
          {items.map((p) => (
            <WishRow key={p.slug} p={p} />
          ))}
        </ul>
      )}
    </div>
  );
}
