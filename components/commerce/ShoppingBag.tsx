"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { MAX_QTY, useStore } from "@/lib/store";

export function ShoppingBag() {
  const { bag, subtotal, setQty, removeFromBag, ready } = useStore();

  if (!ready) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (bag.length === 0)
    return (
      <div className="border border-sand bg-paper p-12 text-center">
        <p className="serif text-4xl">Your bag is empty.</p>
        <p className="mt-3 text-ink-soft">Start at the rail and let a saree find you.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
    <div className="grid gap-12 pb-28 lg:grid-cols-[1fr_380px] lg:pb-0">
      <ul className="divide-y divide-sand border-y border-sand">
        {bag.map(({ product: p, qty, key, variant }) => (
          <li key={key} className="grid grid-cols-[96px_1fr] gap-5 py-6 sm:grid-cols-[120px_1fr_auto]">
            <Link href={`/sarees/${p.slug}`} className="block bg-sand-soft">
              <img src={p.images[0].src} alt={p.name} className="aspect-[600/880] w-full object-cover" />
            </Link>
            <div>
              <p className="eyebrow">{p.weaveName}</p>
              <Link href={`/sarees/${p.slug}`} className="serif mt-1 block text-[28px] leading-tight underline-offset-4 hover:text-berry hover:underline">
                {p.name}
              </Link>
              <p className="mt-1 text-[13px] text-ink-soft">
                {variant ?? p.color} · {formatPrice(p.price)} each <span className="text-[11px]">(sample)</span>
              </p>
              <div className="mt-5 flex items-center gap-5">
                <div className="flex items-center border border-sand" role="group" aria-label={`Quantity of ${p.name}`}>
                  <button type="button" className="grid size-11 place-items-center" onClick={() => setQty(key, qty - 1)} aria-label={qty === 1 ? `Remove ${p.name}` : "Decrease quantity"}>
                    <Minus size={14} />
                  </button>
                  <span className="w-7 text-center tabular-nums">{qty}</span>
                  <button type="button" className="grid size-11 place-items-center disabled:opacity-30" onClick={() => setQty(key, qty + 1)} disabled={qty >= MAX_QTY} aria-label="Increase quantity">
                    <Plus size={14} />
                  </button>
                </div>
                <button type="button" onClick={() => removeFromBag(key)} className="ml-auto min-h-11 px-1 text-[13px] text-ink-soft underline hover:text-ink sm:ml-0">
                  Remove
                </button>
              </div>
            </div>
            <p className="col-start-2 text-[15px] tabular-nums sm:col-start-3 sm:text-right">{formatPrice(p.price * qty)}</p>
          </li>
        ))}
      </ul>

      <aside aria-labelledby="summary-title" className="self-start border border-sand bg-paper p-8">
        <h2 id="summary-title" className="serif text-3xl">
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
      {/* Phones and tablets: subtotal and checkout stay in reach, above the bottom safe area */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
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
