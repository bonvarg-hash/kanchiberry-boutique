"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Gift } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { ORDER_KEY, PACKAGING, type GiftDetails } from "@/lib/gifting";

interface GiftOrder {
  id: string;
  placedAt: string;
  delivery: string;
  total: number;
  lines: { slug: string; name: string; price: number; image: string; gift: GiftDetails }[];
}

const TRACK = ["Order received", "Gift wrapped", "On its way", "Delivered"];

/** Confirmation after completing a gift (a preview order until payment and shipping are connected). */
export default function GiftConfirmedPage() {
  const [order, setOrder] = useState<GiftOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDER_KEY);
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* show the empty state */
    }
    setReady(true);
  }, []);

  if (!ready) return <div className="wrap min-h-[60vh]" aria-busy="true" />;

  if (!order)
    return (
      <div className="wrap pb-24 pt-14 max-md:pb-16 max-md:pt-8">
        <title>Gift confirmed · Kanchiberry</title>
        <div className="empty-state">
          <span className="empty-state-icon">
            <Gift size={22} strokeWidth={1.5} aria-hidden />
          </span>
          <p className="empty-state-title">No gift order yet</p>
          <p className="empty-state-text">When you complete a gift, its details will appear here.</p>
          <Link href="/gifting/find" className="btn btn-primary mt-7">
            Find the Perfect Gift
          </Link>
        </div>
      </div>
    );

  return (
    <div className="wrap max-w-4xl! pb-24 pt-14 max-md:pb-16 max-md:pt-8 lg:pt-20">
      <title>Gift confirmed · Kanchiberry</title>
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#87264D] text-white">
          <Check size={26} strokeWidth={2} aria-hidden />
        </span>
        <h1 className="mx-auto mt-6 max-w-[18ch] text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]" style={{ fontFamily: "var(--font-title)" }}>
          You&rsquo;ve made her day a little more special.
        </h1>
        <p className="mt-4 text-[15px] text-ink-soft">
          Order {order.id} · Expected delivery {order.delivery}
        </p>
        <p className="notice mx-auto mt-6 max-w-xl text-left" role="note">
          <strong>Preview order.</strong> Payment and shipping aren&rsquo;t connected in this prototype, so nothing has been charged or sent.
        </p>
      </div>

      {order.lines.map(({ slug, name, price, image, gift }) => {
        const pack = PACKAGING.find((x) => x.id === gift.packaging)!;
        return (
          <section key={slug} aria-label={`Gift: ${name}`} className="mt-12 grid gap-8 border-t border-sand pt-10 md:grid-cols-[220px_1fr]">
            <img src={image} alt="" className="aspect-[4/5] w-full object-cover max-md:max-w-[240px]" />
            <div className="min-w-0">
              <p className="eyebrow">Your gift</p>
              <p className="mt-2 text-[26px] leading-tight" style={{ fontFamily: "var(--font-title)" }}>
                {name}
              </p>
              <p className="mt-1 text-[14px] text-ink-soft">
                {formatPrice(price)} · {pack.label}
                {pack.price ? ` (+ ${formatPrice(pack.price)})` : ""}
              </p>
              <p className="mt-1 text-[14px] text-ink-soft">
                To {gift.recipient.name}, {gift.recipient.city} {gift.recipient.pin}
                {gift.hidePrice ? " · price kept private" : ""}
              </p>
              {gift.message && (
                <div className="gift-card-preview mt-6">
                  <p className="eyebrow text-[10px]!">Kanchiberry</p>
                  <p className="mt-4 text-[18px] leading-snug" style={{ fontFamily: "var(--font-title)" }}>
                    {gift.message}
                  </p>
                  {gift.from && <p className="mt-3 text-[14px] italic">— {gift.from}</p>}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Tracking: the steps a gift goes through; live status needs a shipping service */}
      <section aria-labelledby="track-title" className="mt-12 border-t border-sand pt-10">
        <h2 id="track-title" className="eyebrow">
          Order tracking
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-4">
          {TRACK.map((t, i) => (
            <li key={t} className="flex items-center gap-3 sm:flex-col sm:items-start">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[13px] ${i === 0 ? "bg-[#190E14] text-white" : "border border-sand text-ink-soft"}`}>
                {i === 0 ? <Check size={15} strokeWidth={2} aria-hidden /> : i + 1}
              </span>
              <span className={`text-[14px] ${i === 0 ? "" : "text-ink-soft"}`}>{t}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[13px] text-ink-soft">Live tracking will appear here once a shipping service is connected.</p>
      </section>

      <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
        <Link href="/gifting/find" className="btn btn-primary">
          Send Another Gift
        </Link>
        <Link href="/shop" className="text-link">
          Explore All Sarees <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
