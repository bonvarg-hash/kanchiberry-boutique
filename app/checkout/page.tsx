"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export default function CheckoutPage() {
  const { bag, subtotal, ready } = useStore();
  return (
    <div className="wrap max-w-4xl! pb-24 pt-14 lg:pt-20">
      <title>Checkout · Kanchiberry</title>
      <h1 className="serif text-[clamp(3rem,7vw,6rem)] font-light leading-[0.9]">Checkout</h1>
      <div className="notice mt-8" role="note">
        <strong>Payment is not integrated in this prototype.</strong> No order can be placed and no payment will be taken. Connect a payment
        provider (for example Razorpay or Stripe) and a shipping service before launch.
      </div>

      {ready && bag.length === 0 ? (
        <p className="mt-10 text-ink-soft">
          Your bag is empty. <Link href="/shop" className="underline">Browse the collection</Link>.
        </p>
      ) : (
        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_320px]">
          <section aria-labelledby="steps" className="space-y-4">
            <h2 id="steps" className="eyebrow">
              Steps to come
            </h2>
            {["Contact & delivery address", "Delivery method", "Payment"].map((s, i) => (
              <div key={s} className="flex items-center justify-between border border-sand bg-paper px-6 py-5">
                <span>
                  <span className="serif mr-3 italic text-berry">0{i + 1}</span>
                  {s}
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">Pending</span>
              </div>
            ))}
            <button type="button" className="btn btn-primary w-full" disabled aria-describedby="pay-note">
              Place Order
            </button>
            <p id="pay-note" className="text-[12px] text-ink-soft">
              Disabled until a payment integration exists.
            </p>
          </section>
          <aside aria-labelledby="order" className="self-start border border-sand bg-paper p-6">
            <h2 id="order" className="serif text-2xl">
              Your bag
            </h2>
            <ul className="mt-4 space-y-3 text-[14px]">
              {bag.map(({ product: p, qty, key, variant }) => (
                <li key={key} className="flex justify-between gap-4">
                  <span>
                    {p.name}
                    {variant ? ` · ${variant}` : ""} × {qty}
                  </span>
                  <span className="tabular-nums">{formatPrice(p.price * qty)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex justify-between border-t border-sand pt-4">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </p>
            <Link href="/bag" className="mt-4 inline-block text-[13px] underline">
              Edit bag
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
