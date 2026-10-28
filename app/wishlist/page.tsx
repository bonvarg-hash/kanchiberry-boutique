"use client";

import Link from "next/link";
import { getProduct } from "@/lib/products";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { wishlist, ready, addToBag, inBag } = useStore();
  const items = wishlist.flatMap((s) => {
    const p = getProduct(s);
    return p ? [p] : [];
  });

  return (
    <div className="wrap pb-24 pt-14 lg:pt-20">
      <title>Wishlist · Kanchiberry</title>
      <h1 className="font-sans text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.9] max-md:text-[46px]">Wishlist</h1>
      <p className="lede mt-4 mb-12">Saved on this device. Sign-in to sync across devices is not yet available.</p>
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
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <div key={p.slug}>
              <ProductCard product={p} />
              {inBag(p.slug) ? (
                <Link href="/bag" className="btn btn-ghost mt-4 min-h-11! w-full">
                  In Your Bag · View Bag
                </Link>
              ) : (
                <button type="button" className="btn btn-ghost mt-4 min-h-11! w-full" onClick={() => addToBag(p.slug)}>
                  Move to Bag
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
