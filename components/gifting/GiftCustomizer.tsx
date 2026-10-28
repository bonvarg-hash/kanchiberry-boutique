"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { Check, Truck } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import {
  ANSWERS_KEY,
  MESSAGE_SUGGESTIONS,
  OCCASIONS,
  PACKAGING,
  deliveryWindow,
  plainDescription,
  suitableFor,
  type GiftDetails,
  type Occasion,
  type Who,
} from "@/lib/gifting";
import { ProductGallery } from "@/components/product/ProductGallery";

const MAX_NOTE = 220;

/** Small drawings of the two packaging options (no product photography exists yet). */
function PackagingArt({ kind }: { kind: "signature" | "classic" }) {
  return kind === "signature" ? (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden>
      <rect x="18" y="26" width="84" height="44" rx="2" fill="#190e14" />
      <rect x="14" y="18" width="92" height="12" rx="2" fill="#2a1a23" />
      <rect x="56" y="18" width="8" height="52" fill="#87264d" />
      <path d="M60 18c-10-12-24-8-18 0s18 0 18 0Zm0 0c10-12 24-8 18 0s-18 0-18 0Z" fill="#87264d" />
      <text x="60" y="56" textAnchor="middle" fontSize="6" fill="#d9c08a" letterSpacing="1.2">KANCHIBERRY</text>
    </svg>
  ) : (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden>
      <rect x="18" y="26" width="84" height="44" rx="2" fill="#e1e1d5" stroke="#c1c1b5" />
      <rect x="14" y="20" width="92" height="10" rx="2" fill="#efefeb" stroke="#c1c1b5" />
      <path d="M30 26l30 14 30-14" fill="none" stroke="#f3f4ef" strokeWidth="6" opacity=".9" />
    </svg>
  );
}

function readAnswers(): { occasion: Occasion | null; who: Who | null } {
  try {
    const a = JSON.parse(sessionStorage.getItem(ANSWERS_KEY) ?? "{}").answers ?? {};
    return { occasion: a.occasion ?? null, who: a.who ?? null };
  } catch {
    return { occasion: null, who: null };
  }
}

/**
 * The gift options themselves: packaging, a personal note with a card preview, and
 * delivery to the recipient. "Continue to Checkout" adds the saree to the bag as a
 * gift. Used in the gift layer and, expanded on request, on every saree page.
 */
export function GiftForm({ product: p, onDone, compact = false }: { product: Product; onDone?: () => void; compact?: boolean }) {
  const { bag, addGift } = useStore();
  const router = useRouter();
  const existing = bag.find((l) => l.slug === p.slug)?.gift;
  const [{ occasion, who }] = useState(readAnswers);

  const [gift, setGift] = useState<GiftDetails>(
    () =>
      existing ?? {
        packaging: "signature",
        message: "",
        from: "",
        recipient: { name: "", phone: "", address: "", city: "", pin: "" },
        instructions: "",
        hidePrice: true,
        sendToRecipient: true,
        occasion,
        who,
      },
  );
  useEffect(() => {
    if (existing) setGift(existing);
    // only when the bag first loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(existing)]);

  const uid = useId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof GiftDetails>(k: K, v: GiftDetails[K]) => setGift((g) => ({ ...g, [k]: v }));
  const setR = (k: keyof GiftDetails["recipient"], v: string) => setGift((g) => ({ ...g, recipient: { ...g.recipient, [k]: v } }));

  const pack = PACKAGING.find((x) => x.id === gift.packaging)!;
  const total = p.price + pack.price;
  const window_ = useMemo(() => deliveryWindow(), []);
  const suggestions = MESSAGE_SUGGESTIONS[gift.occasion ?? "default"] ?? MESSAGE_SUGGESTIONS.default;
  const occasionLabel = OCCASIONS.find((o) => o.id === gift.occasion)?.label;

  const validate = () => {
    const e: Record<string, string> = {};
    const r = gift.recipient;
    if (!r.name.trim()) e.name = "Please add her name.";
    if (!/^[6-9]\d{9}$/.test(r.phone.replace(/\D/g, "").slice(-10))) e.phone = "Please add a 10-digit mobile number.";
    if (r.address.trim().length < 6) e.address = "Please add the full address.";
    if (!r.city.trim()) e.city = "Please add the city.";
    if (!/^\d{6}$/.test(r.pin.trim())) e.pin = "Please add a 6-digit PIN code.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) {
      document.getElementById(`${uid}-delivery`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    addGift(p.slug, { ...gift, message: gift.message.trim(), from: gift.from.trim() });
    onDone?.();
    router.push("/checkout");
  };

  const field = (id: keyof GiftDetails["recipient"], label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="gift-field">
      <span>{label}</span>
      <input value={gift.recipient[id]} onChange={(e) => setR(id, e.target.value)} aria-invalid={!!errors[id]} aria-describedby={errors[id] ? `${uid}-err-${id}` : undefined} {...props} />
      {errors[id] && (
        <span id={`${uid}-err-${id}`} className="gift-field-error">
          {errors[id]}
        </span>
      )}
    </label>
  );

  return (
    <div>
        {/* 1. Packaging */}
        <fieldset className={compact ? "mt-6" : "mt-10"}>
          <legend className="gift-legend">
            <span>1</span> Gift packaging
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PACKAGING.map((o) => (
              <label key={o.id} className="gift-choice">
                <input type="radio" name={`${uid}-packaging`} className="sr-only" checked={gift.packaging === o.id} onChange={() => set("packaging", o.id)} />
                <span className="block h-20 bg-[#F3F4EF] p-2">
                  <PackagingArt kind={o.id} />
                </span>
                <span className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="text-[15px]">{o.label}</span>
                  <span className="shrink-0 text-[14px] tabular-nums">{o.price ? `+ ${formatPrice(o.price)}` : "Included"}</span>
                </span>
                <span className="mt-1 block text-[13px] text-ink-soft">{o.line}</span>
                {gift.packaging === o.id && (
                  <span className="gift-option-check" aria-hidden>
                    <Check size={14} strokeWidth={2.2} />
                  </span>
                )}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-ink-soft">Packaging shown as illustrations; photographs to follow.</p>
        </fieldset>

        {/* 2. Personal note */}
        <fieldset className="mt-10">
          <legend className="gift-legend">
            <span>2</span> A personal note
          </legend>
          <p className="mt-3 text-[13px] text-ink-soft">What&rsquo;s the occasion?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button key={o.id} type="button" className="search-tag" aria-pressed={gift.occasion === o.id} onClick={() => set("occasion", o.id)}>
                {o.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-ink-soft">{occasionLabel ? `Ideas for ${occasionLabel.toLowerCase()}:` : "A few ideas:"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((m) => (
              <button key={m} type="button" className="search-tag text-left" aria-pressed={gift.message === m} onClick={() => set("message", m)}>
                {m}
              </button>
            ))}
          </div>
          <label className="gift-field mt-4">
            <span>Your message</span>
            <textarea rows={3} maxLength={MAX_NOTE} value={gift.message} placeholder="Write something from the heart…" onChange={(e) => set("message", e.target.value)} />
            <span className="text-right text-[12px] text-ink-soft">
              {gift.message.length}/{MAX_NOTE}
            </span>
          </label>
          <label className="gift-field">
            <span>From (optional)</span>
            <input value={gift.from} maxLength={40} placeholder="Your name" onChange={(e) => set("from", e.target.value)} />
          </label>
          {/* Card preview */}
          <div className="gift-card-preview mt-5" aria-label="Gift card preview">
            <p className="eyebrow text-[10px]!">Kanchiberry</p>
            <p className="mt-4 min-h-12 text-[18px] leading-snug" style={{ fontFamily: "var(--font-title)" }}>
              {gift.message.trim() || "Your message will appear here."}
            </p>
            {gift.from.trim() && <p className="mt-3 text-[14px] italic">— {gift.from.trim()}</p>}
          </div>
          <p className="mt-2 text-[12px] text-ink-soft">Your note is printed on a card and placed inside the gift.</p>
        </fieldset>

        {/* 3. Delivery */}
        <fieldset id={`${uid}-delivery`} className="mt-10 scroll-mt-24">
          <legend className="gift-legend">
            <span>3</span> Delivery
          </legend>
          <label className="gift-check mt-4">
            <input type="checkbox" checked={gift.sendToRecipient} onChange={(e) => set("sendToRecipient", e.target.checked)} />
            <span>Send the gift directly to her</span>
          </label>
          <p className="mt-3 text-[13px] text-ink-soft">{gift.sendToRecipient ? "Her delivery details" : "Delivery details"}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {field("name", gift.sendToRecipient ? "Her name" : "Name", { autoComplete: "name" })}
            {field("phone", "Mobile number", { inputMode: "tel", autoComplete: "tel", placeholder: "10 digits" })}
            <div className="sm:col-span-2">{field("address", "Address", { autoComplete: "street-address" })}</div>
            {field("city", "City", { autoComplete: "address-level2" })}
            {field("pin", "PIN code", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
          </div>
          <label className="gift-field mt-3">
            <span>Delivery instructions (optional)</span>
            <input value={gift.instructions} maxLength={140} placeholder="e.g. Please call before arriving" onChange={(e) => set("instructions", e.target.value)} />
          </label>
          <label className="gift-check mt-3">
            <input type="checkbox" checked={gift.hidePrice} onChange={(e) => set("hidePrice", e.target.checked)} />
            <span>Keep the price private (no prices inside the parcel)</span>
          </label>
          <div className="note note-plain mt-5">
            <Truck size={18} strokeWidth={1.6} aria-hidden className="mt-0.5 text-ink" />
            <div>
              <p className="text-[14px] font-medium text-ink">Estimated delivery: {window_}</p>
              <p className="mt-0.5">Free delivery in India. Exact dates will be confirmed once a shipping service is connected.</p>
            </div>
          </div>
        </fieldset>

        {/* Total and continue: sticky at the bottom of the layer */}
        <div className={compact ? "gift-total gift-total-inline" : "gift-total"}>
          <div className="leading-tight">
            <p className="text-[12px] text-ink-soft">
              Saree {formatPrice(p.price)} {pack.price ? `+ box ${formatPrice(pack.price)}` : ""}
            </p>
            <p className="mt-1 text-[22px] tabular-nums">{formatPrice(total)}</p>
          </div>
          <button type="button" className="btn btn-primary flex-1" onClick={submit}>
            {existing ? "Update Gift & Checkout" : "Continue to Checkout"}
          </button>
        </div>
    </div>
  );
}

/**
 * Gift options for a saree, shown in the slide-up layer when it is opened from
 * the gift finder: the saree, then the gift form.
 */
export function GiftCustomizer({ product: p, onDone }: { product: Product; onDone?: () => void }) {
  return (
    <div className="wrap grid gap-10 pb-6 pt-4 md:pt-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
        <ProductGallery images={p.images} name={p.name} />
      </div>

      <div className="min-w-0">
        <p className="eyebrow">Your gift</p>
        <h2 className="mt-3 text-[clamp(2rem,3.6vw,3rem)] leading-[1.05]" style={{ fontFamily: "var(--font-title)" }}>
          {p.name}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{plainDescription(p)}</p>
        <p className="mt-2 text-[13px] text-ink-soft">
          <span className="text-ink">Lovely for:</span> {suitableFor(p)}
        </p>
        <p className="mt-4 text-[22px] tabular-nums">{formatPrice(p.price)}</p>
        <Link href={`/sarees/${p.slug}`} data-full-page className="mt-2 inline-block text-[13px] text-ink-soft underline underline-offset-4 hover:text-ink">
          See full saree details
        </Link>

        <GiftForm product={p} onDone={onDone} />
      </div>
    </div>
  );
}
