import Link from "next/link";
import { ArrowRight, BadgePercent } from "lucide-react";
import { products, type WeaveSlug } from "@/lib/products";
import { weaves } from "@/lib/weaves";

const WEAVE_ROW: WeaveSlug[] = ["kanjivaram", "banarasi", "paithani", "patola", "chanderi"];

const Star = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z" fill="currentColor" />
  </svg>
);

/** Circular photo with a slowly turning "explore" ring beside it. */
function ExploreBadge() {
  return (
    <Link href="/shop" className="group flex items-center" aria-label="Explore the collection">
      <img src="/photos/kb-7.jpg" alt="" className="size-28 rounded-full object-cover object-top sm:size-32" />
      <span className="relative -ml-8 grid size-28 place-items-center rounded-full bg-paper sm:size-32">
        <svg viewBox="0 0 120 120" className="spin-badge absolute inset-1 text-ink" aria-hidden>
          <defs>
            <path id="explore-ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
          </defs>
          <text fontSize="10" letterSpacing="2.6" fill="currentColor" style={{ textTransform: "uppercase" }}>
            <textPath href="#explore-ring">Explore the weaves · Explore the weaves ·</textPath>
          </text>
        </svg>
        <span className="grid size-12 place-items-center rounded-full bg-[#87264D] text-paper transition-transform duration-500 group-hover:rotate-90 sm:size-14">
          <Star className="size-5" />
        </span>
      </span>
    </Link>
  );
}

/**
 * Editorial band: an oversized title with the cut-out model rising through it,
 * the festive offer on the left, a shop link on the right and the weaves below.
 */
export function SareeEditorial() {
  const count = (w: WeaveSlug) => products.filter((p) => p.weave === w).length;
  return (
    <section aria-labelledby="editorial-title" className="editorial overflow-hidden pt-16 lg:pt-24">
      <div className="wrap">
        <h2
          id="editorial-title"
          className="relative z-0 flex items-center justify-center gap-[0.18em] text-center text-[clamp(3.2rem,12vw,10.5rem)] uppercase leading-[0.9] tracking-[-0.02em] text-[#87264D]"
          style={{ fontFamily: "var(--font-title)" }}
        >
          <span>Silk</span>
          <span className="grid size-[0.8em] shrink-0 place-items-center rounded-full bg-[#190E14] text-paper" aria-hidden>
            <Star className="size-[0.45em]" />
          </span>
          <em className="shimmer text-[#4E3F47]">Stories</em>
        </h2>

        <div className="relative z-10 -mt-[4vw] grid items-end gap-12 lg:grid-cols-[1fr_minmax(0,1.3fr)_1fr] lg:gap-10">
          {/* Left: the offer */}
          <div className="order-2 lg:order-1 lg:self-center lg:pt-24">
            <p className="flex items-center gap-3 text-[clamp(2rem,3.4vw,2.9rem)] leading-none text-[#190E14]" style={{ fontFamily: "var(--font-title)" }}>
              <BadgePercent size={36} strokeWidth={1.6} aria-hidden />
              Up to 25% Off
            </p>
            <p className="mt-5 max-w-[34ch] text-[16px] leading-relaxed text-ink-soft">
              On our Festive Edit of handwoven Kanjivaram, Banarasi and Paithani silks.
            </p>
            <div className="mt-10">
              <ExploreBadge />
            </div>
            <svg viewBox="0 0 150 60" className="mt-8 hidden w-36 text-[#190E14] lg:ml-12 lg:block" aria-hidden>
              <path d="M4 52c30-4 18-34 34-30s-6 30 16 26 14-38 34-34-2 30 20 28 24-18 38-22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Centre: the cut-out on a berry panel */}
          <div className="relative order-1 mx-auto w-full max-w-[560px] lg:order-2 lg:-mt-[5vw]">
            <div className="editorial-panel absolute inset-x-0 bottom-0 top-[22%] rounded-t-[44px]" aria-hidden />
            <img
              src="/cutouts/saree-model.png"
              alt="A model in a violet Kanjivaram silk saree with a rose and gold zari border"
              className="relative z-10 mx-auto block w-[92%]"
            />
          </div>

          {/* Right: mark, arrow, link and note */}
          <div className="order-3 lg:self-center lg:pt-16">
            <div className="flex items-start justify-between gap-6">
              <svg viewBox="0 0 64 64" className="size-16 text-[#190E14]" aria-hidden>
                <path d="M32 2c2 16 14 28 30 30-16 2-28 14-30 30-2-16-14-28-30-30C18 30 30 18 32 2Z" fill="currentColor" />
                <path d="M32 32c1 8 7 14 15 15-8 1-14 7-15 15-1-8-7-14-15-15 8-1 14-7 15-15Z" fill="#87264D" transform="translate(9 9) scale(.7)" />
              </svg>
              <svg viewBox="0 0 120 80" className="hidden w-28 text-[#190E14] lg:block" aria-hidden>
                <path d="M114 14c-14-14-36-4-34 14 2 14-16 18-22 6S68 4 82 8M60 34C44 50 26 62 10 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 70l4-14M10 70l14-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <Link href="/shop" className="editorial-pill mt-10">
              Shop the Edit <ArrowRight size={18} strokeWidth={1.6} aria-hidden />
            </Link>
            <p className="mt-10 max-w-[38ch] text-[16px] leading-relaxed text-ink-soft">
              Temple borders, zari paisleys and pure silk bodies, each one woven by hand on a pit loom and finished with care. Find the
              drape you will keep for a lifetime.
            </p>
          </div>
        </div>
      </div>

      {/* Weaves strip */}
      <nav aria-label="Shop by weave" className="mt-16 border-t border-sand lg:mt-20">
        <ul className="wrap flex snap-x gap-10 overflow-x-auto py-8 [scrollbar-width:none] lg:justify-between lg:gap-6">
          {WEAVE_ROW.map((slug) => {
            const w = weaves.find((x) => x.slug === slug);
            if (!w) return null;
            const n = count(slug);
            return (
              <li key={slug} className="shrink-0 snap-start">
                <Link href={`/shop?weave=${slug}`} className="group flex items-center gap-3">
                  <img src={w.photo.src} alt="" className="size-12 rounded-full object-cover" />
                  <span className="text-[clamp(1.5rem,2.1vw,2.1rem)] uppercase leading-none tracking-[-0.01em] text-[#190E14] group-hover:text-[#87264D]" style={{ fontFamily: "var(--font-title)" }}>
                    {w.name.replace(/ Silk$/, "")}
                    <sup className="ml-1 align-super font-sans text-[15px] normal-case tracking-normal text-ink-soft">
                      {n}
                      <span className="sr-only"> {n === 1 ? "saree" : "sarees"}</span>
                    </sup>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
