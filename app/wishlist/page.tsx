"use client";

import Link from "next/link";
import { getProduct } from "@/lib/products";
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
      <h1 className="serif text-[clamp(3rem,7vw,6rem)] font-light leading-[0.9]">Wishlist</h1>
      <p className="lede mt-4 mb-12">Saved on this device. Sign-in to sync across devices is not yet available.</p>
      {!ready ? (
        <div className="min-h-[30vh]" aria-busy="true" />
      ) : items.length === 0 ? (
        <div className="border border-sand bg-paper p-12 text-center">
          <p className="serif text-4xl">Nothing saved yet.</p>
          <p className="mt-3 text-ink-soft">Tap the heart on any saree to keep it here.</p>
          <Link href="/shop" className="btn btn-primary mt-8">
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
