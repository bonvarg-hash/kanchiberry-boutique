"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gift } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ORDER_KEY, PACKAGING, deliveryWindow, packagingPrice } from "@/lib/gifting";

export default function CheckoutPage() {
  const { bag, subtotal, giftTotal, ready } = useStore();
  const router = useRouter();
  const gifts = bag.filter((l) => l.gift);
  const isGift = gifts.length > 0;

  // Payment isn't connected yet: completing a gift saves a preview order on this device and shows the confirmation.
  const completeGift = () => {
    const order = {
      id: `KB-${Date.now().toString(36).toUpperCase()}`,
      placedAt: new Date().toISOString(),
      delivery: deliveryWindow(),
      lines: gifts.map((l) => ({ slug: l.slug, name: l.product.name, price: l.product.price, image: l.product.images[0].src, gift: l.gift! })),
      total: gifts.reduce((n, l) => n + l.product.price + packagingPrice(l.gift), 0),
    };
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      /* the confirmation will show its empty state */
    }
    router.push("/gifting/confirmed");
  };

  return (
    <div className="wrap max-w-5xl! pb-24 pt-14 max-md:pb-16 max-md:pt-8 lg:pt-20">
      <title>Checkout · Kanchiberry</title>
      <h1 className="serif text-[clamp(3rem,7vw,6rem)] font-light leading-[0.9]">Checkout</h1>
      <div className="notice mt-8 max-md:mt-6" role="note">
        <strong>Payment is not integrated in this prototype.</strong> No payment will be taken.{" "}
        {isGift ? "Completing a gift creates a preview order on this device only." : "No order can be placed."} Connect a payment provider (for example
        Razorpay or Stripe) and a shipping service before launch.
      </div>

      {ready && bag.length === 0 ? (
        <p className="mt-10 text-ink-soft">
          Your bag is empty. <Link href="/shop" className="underline">Browse the collection</Link> or{" "}
          <Link href="/gifting" className="underline">find a gift</Link>.
        </p>
      ) : (
        <div className="mt-12 grid gap-12 max-md:mt-8 max-md:gap-8 md:grid-cols-[1fr_340px]">
          <section aria-labelledby="steps" className="min-w-0 space-y-4">
            {isGift ? (
              <>
                <h2 id="steps" className="eyebrow">
                  Your gift
                </h2>
                {gifts.map(({ product: p, gift, key }) => {
                  const pack = PACKAGING.find((x) => x.id === gift!.packaging)!;
                  return (
                    <article key={key} className="border border-sand bg-[#F3F4EF] p-5 sm:p-6">
                      <div className="flex gap-4">
                        <img src={p.images[0].src} alt="" className="aspect-[4/5] w-20 shrink-0 object-cover sm:w-24" />
                        <div className="min-w-0">
                          <p className="text-[18px] leading-tight">{p.name}</p>
                          <p className="mt-1 text-[14px] tabular-nums text-ink-soft">{formatPrice(p.price)}</p>
                          <Link href={`/sarees/${p.slug}?gift=1`} className="mt-2 inline-block text-[13px] underline underline-offset-4">
                            Edit gift
                          </Link>
                        </div>
                      </div>
                      <dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-sand pt-5 text-[14px] sm:grid-cols-2">
                        <div>
                          <dt className="text-ink-soft">Packaging</dt>
                          <dd>
                            {pack.label} {pack.price ? `(+ ${formatPrice(pack.price)})` : "(included)"}
                            {gift!.ribbon && <span className="block text-ink-soft">{gift!.ribbon} ribbon{gift!.cardDesign ? `, ${gift!.cardDesign} card` : ""}</span>}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-ink-soft">Delivering to</dt>
                          <dd>
                            {gift!.recipient.name}, {gift!.recipient.city} {gift!.recipient.pin}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-ink-soft">Personal note</dt>
                          <dd className="italic">{gift!.message ? `“${gift!.message}”${gift!.from ? ` — ${gift!.from}` : ""}` : "No note"}</dd>
                        </div>
                        <div>
                          <dt className="text-ink-soft">Estimated delivery</dt>
                          <dd>{deliveryWindow()}</dd>
                        </div>
                        <div>
                          <dt className="text-ink-soft">Price</dt>
                          <dd>{gift!.hidePrice ? "Kept private from her" : "Shown on the invoice"}</dd>
                        </div>
                        {gift!.instructions && (
                          <div className="sm:col-span-2">
                            <dt className="text-ink-soft">Delivery instructions</dt>
                            <dd>{gift!.instructions}</dd>
                          </div>
                        )}
                      </dl>
                    </article>
                  );
                })}
                <button type="button" className="btn btn-primary btn-shimmer w-full" onClick={completeGift}>
                  <Gift size={17} strokeWidth={1.6} aria-hidden /> Complete Your Gift
                </button>
                <p className="text-[12px] text-ink-soft">Preview only: no payment is taken and nothing will be shipped.</p>
              </>
            ) : (
              <>
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
              </>
            )}
          </section>
          <aside aria-labelledby="order" className="self-start border border-sand bg-white p-6">
            <h2 id="order" className="font-sans text-2xl">
              Order summary
            </h2>
            <ul className="mt-4 space-y-3 text-[14px]">
              {bag.map(({ product: p, qty, key, variant, gift }) => (
                <li key={key} className="flex justify-between gap-4">
                  <span>
                    {p.name}
                    {variant ? ` · ${variant}` : ""} × {qty}
                    {gift && <span className="block text-[12px] text-ink-soft">Gift for {gift.recipient.name || "her"}</span>}
                  </span>
                  <span className="tabular-nums">{formatPrice(p.price * qty)}</span>
                </li>
              ))}
              {giftTotal > 0 && (
                <li className="flex justify-between gap-4">
                  <span>Gift packaging</span>
                  <span className="tabular-nums">{formatPrice(giftTotal)}</span>
                </li>
              )}
              <li className="flex justify-between gap-4 text-ink-soft">
                <span>Delivery</span>
                <span>Free (In India)</span>
              </li>
            </ul>
            <p className="mt-6 flex items-baseline justify-between border-t border-sand pt-4">
              <span>Total</span>
              <span className="text-[22px] tabular-nums">{formatPrice(subtotal)}</span>
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
