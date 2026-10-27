"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

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
  const [paused, setPaused] = useState(false);
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
    <div className="offer-bar relative bg-[#190E14] text-[11px] tracking-[0.14em] text-[#f1e9e4]" data-paused={paused}>
      <div className="overflow-hidden py-2.5" aria-label="Offers" role="region">
        <div className="offer-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        aria-label={paused ? "Resume offers" : "Pause offers"}
        className="motion-only absolute right-0 top-0 grid h-full w-9 place-items-center bg-[#190E14] text-[#f1e9e4]/75 hover:text-[#f1e9e4]"
      >
        {paused ? <Play size={11} /> : <Pause size={11} />}
      </button>
    </div>
  );
}
