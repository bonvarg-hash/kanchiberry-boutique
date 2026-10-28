"use client";

import Link from "next/link";
import { ShoppingBag as BagIcon } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export function ShoppingBag() {
  const { bag, subtotal, removeFromBag, ready } = useStore();

  if (!ready) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (bag.length === 0)
    return (
      <div className="empty-state">
        <span className="empty-state-icon">
          <BagIcon size={22} strokeWidth={1.5} aria-hidden />
        </span>
        <p className="empty-state-title">Your bag is empty</p>
        <p className="empty-state-text">Start at the rail and let a saree find you.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/#curated" className="btn btn-primary">
            Curated Picks
          </Link>
          <Link href="/shop" className="btn btn-ghost">
            Shop All Sarees
          </Link>
        </div>
      </div>
    );

  return (
    <div className="grid gap-12 max-md:gap-8 md:pb-28 lg:grid-cols-[1fr_380px] lg:pb-0">
      <ul className="divide-y divide-sand border-y border-sand">
        {bag.map(({ product: p, qty, key, variant }) => (
          <li key={key} className="grid grid-cols-[96px_1fr] gap-5 py-6 sm:grid-cols-[120px_1fr_auto]">
            <Link href={`/sarees/${p.slug}`} className="block bg-sand-soft">
              <img src={p.images[0].src} alt={p.name} className="aspect-[600/880] w-full object-cover" />
            </Link>
            <div>
              <p className="eyebrow">{p.weaveName}</p>
              <Link href={`/sarees/${p.slug}`} className="mt-1 block font-sans text-[21px] leading-tight underline-offset-4 sm:text-[28px] hover:text-berry hover:underline">
                {p.name}
              </Link>
              <p className="mt-1 text-[13px] text-ink-soft">
                {variant ?? p.color} · {formatPrice(p.price)} <span className="text-[11px]">(sample)</span>
              </p>
              <div className="mt-5 flex items-center gap-5">
                {/* One of each saree per order, so there's no quantity to change. */}
                <p className="text-[13px] text-ink-soft">Qty 1 · One per order</p>
                <button type="button" onClick={() => removeFromBag(key)} className="ml-auto min-h-11 px-1 text-[13px] text-ink-soft underline hover:text-ink sm:ml-0">
                  Remove
                </button>
              </div>
            </div>
            <p className="col-start-2 text-[15px] tabular-nums sm:col-start-3 sm:text-right">{formatPrice(p.price * qty)}</p>
          </li>
        ))}
      </ul>

      <aside aria-labelledby="summary-title" className="self-start border border-sand bg-white p-8">
        <h2 id="summary-title" className="font-sans text-3xl">
          Summary
        </h2>
        <dl className="mt-6 space-y-3 text-[15px]">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ink-soft">
            <dt>Shipping</dt>
            <dd>Not yet configured</dd>
          </div>
        </dl>
        <Link href="/checkout" className="btn btn-primary mt-8 w-full">
          Proceed to Checkout
        </Link>
        <p className="mt-4 text-[12px] text-ink-soft">Prices are sample values. Your bag is saved on this device.</p>
      </aside>
      {/* Tablets: subtotal and checkout stay in reach, above the bottom safe area. Phones
          leave it out: the summary's own checkout button sits just below the list. */}
      <div className="fixed inset-x-0 bottom-(--tabbar-h) z-30 hidden border-t border-sand bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:block lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="flex-1">
            <p className="text-[12px] uppercase tracking-[0.14em] text-ink-soft">Subtotal</p>
            <p className="text-[17px] tabular-nums">{formatPrice(subtotal)}</p>
          </div>
          <Link href="/checkout" className="btn btn-primary min-h-12 px-6">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
