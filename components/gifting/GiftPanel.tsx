"use client";

import { useId, useState } from "react";
import { ChevronDown, Gift } from "lucide-react";
import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { GiftForm } from "./GiftForm";

/**
 * On every saree page: "Sending this as a gift?" Opening it reveals the gift options
 * (packaging, a personal note, delivery to her) in place. Open already when the
 * saree is in the bag as a gift, so its details can be edited.
 */
export function GiftPanel({ product: p }: { product: Product }) {
  const { bag } = useStore();
  const isGift = Boolean(bag.find((l) => l.slug === p.slug)?.gift);
  const [open, setOpen] = useState(false);
  const id = useId();
  const expanded = open || isGift;

  return (
    <section className="gift-panel mt-6 max-md:order-8" aria-labelledby={`${id}-q`}>
      <button
        type="button"
        id={`${id}-q`}
        className="gift-panel-toggle"
        aria-expanded={expanded}
        aria-controls={`${id}-body`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#F3F4EF] text-[#87264D]">
          <Gift size={19} strokeWidth={1.6} aria-hidden />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[16px] leading-tight">{isGift ? "This saree is a gift" : "Sending this as a gift?"}</span>
          <span className="mt-0.5 block text-[13px] text-ink-soft">Gift box, a personal note and delivery straight to her</span>
        </span>
        <ChevronDown size={18} strokeWidth={1.5} aria-hidden className={`shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
      </button>
      <div id={`${id}-body`} className="gift-panel-body" data-open={expanded || undefined} hidden={!expanded}>
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <GiftForm product={p} compact />
        </div>
      </div>
    </section>
  );
}
