"use client";

/**
 * Announcement bar for offers. PLACEHOLDER COPY: no real offers exist yet.
 * Replace OFFERS with approved promotions (or load them from the CMS) before launch.
 */
const OFFERS = [
  "Offer placeholder · Your seasonal announcement goes here",
  "Offer placeholder · Festive Edit preview message",
  "Offer placeholder · Shipping or packaging note, once policies are confirmed",
  "Offer placeholder · New arrivals announcement",
];

export function OfferBar() {
  const row = (hidden: boolean) => (
    <ul className="offer-row" aria-hidden={hidden || undefined}>
      {OFFERS.map((o) => (
        <li key={o} className="flex items-center gap-10 pr-10">
          {o}
          <span aria-hidden className="text-[#f1e9e4]/50">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="offer-bar bg-[#190E14] text-[11px] tracking-[0.14em] text-[#f1e9e4]">
      <div className="overflow-hidden py-2.5" aria-label="Offers" role="region">
        <div className="offer-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}
