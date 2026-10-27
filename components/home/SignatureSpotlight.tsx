import Link from "next/link";
import { Feather, Gem, Sparkles } from "lucide-react";
import { formatPrice, getProduct } from "@/lib/products";

/** Circular badge whose text slowly turns; purely decorative. */
function SpinBadge() {
  return (
    <svg viewBox="0 0 120 120" className="spin-badge size-24 sm:size-28" aria-hidden>
      <defs>
        <path id="badge-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth=".8" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth=".8" />
      <text fontSize="10.5" letterSpacing="3.2" fill="currentColor" style={{ textTransform: "uppercase" }}>
        <textPath href="#badge-circle">Handpicked · Kanchiberry · Signature ·</textPath>
      </text>
      <path d="M60 46l2.8 11.2L74 60l-11.2 2.8L60 74l-2.8-11.2L46 60l11.2-2.8Z" fill="currentColor" />
    </svg>
  );
}

const FEATURES = [
  { icon: Gem, text: "Broad gold zari border" },
  { icon: Feather, text: "Magenta pallu in zari stripes" },
  { icon: Sparkles, text: "Gold buttas across the body" },
];

export function SignatureSpotlight() {
  const p = getProduct("emerald-magenta-kanjivaram")!;
  return (
    <section aria-labelledby="spotlight-title" className="relative overflow-hidden py-20 lg:py-28">
      {/* vertical watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 rotate-90 select-none text-[110px] leading-none text-ink/[0.04] lg:block"
        style={{ fontFamily: "var(--font-title)" }}
      >
        Kanchiberry
      </span>

      <div className="wrap relative">
        <p className="eyebrow text-center">Signature drape of the week</p>
        <div className="relative mt-4 flex justify-center">
          <span aria-hidden className="absolute left-[6%] top-2 text-2xl text-ink">
            ✦
          </span>
          <h2
            id="spotlight-title"
            className="text-center text-[clamp(3.6rem,13vw,12.5rem)] leading-[0.9] tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Silk Saree
          </h2>
          <span className="absolute right-[2%] top-0 hidden text-ink md:block">
            <SpinBadge />
          </span>
        </div>

        <div className="relative -mt-[clamp(2rem,6vw,5.5rem)] grid items-end gap-10 md:grid-cols-[1fr_minmax(240px,34%)_1fr]">
          {/* left copy + CTA */}
          <div className="order-2 md:order-1 md:pb-6">
            <p className="max-w-[30ch] text-[16px] leading-relaxed text-ink-soft">
              Deep bottle-green silk, scattered with gold buttas and finished with a magenta pallu banded in zari. A drape made for the
              moments you&rsquo;ll want to remember.
            </p>
            <Link href={`/sarees/${p.slug}`} className="btn btn-primary mt-8">
              Shop Now <span aria-hidden>→</span>
            </Link>
          </div>

          {/* arched photo, rising over the title */}
          <figure className="order-1 mx-auto w-full max-w-[380px] md:order-2">
            <div className="spotlight-arch relative overflow-hidden rounded-t-full bg-sand-soft shadow-[0_40px_60px_-30px_rgba(25,14,20,0.45)]">
              <img src="/photos/kb-6.jpg" alt={p.images[1]?.alt ?? p.name} className="aspect-[3/4] w-full object-cover object-[50%_30%]" loading="lazy" />
            </div>
          </figure>

          {/* right features + price */}
          <div className="order-3 md:pb-6">
            <ul className="space-y-4">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[14px]">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/80">
                    <Icon size={15} strokeWidth={1.5} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-baseline gap-3">
              <span className="text-[12px] uppercase tracking-[0.16em] text-ink-soft">Price</span>
              <span className="text-[28px]" style={{ fontFamily: "var(--font-title)" }}>
                {formatPrice(p.price)}
              </span>
              <span className="tag-sample">Sample</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
