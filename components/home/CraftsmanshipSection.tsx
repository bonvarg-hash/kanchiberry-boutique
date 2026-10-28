import Link from "next/link";
import { craftPhotos } from "@/lib/craft";

const COLLAGE = [
  { p: craftPhotos.kanchipuramLoom, span: "row-span-2" },
  { p: craftPhotos.banarasiWarp, span: "col-span-2" },
  { p: craftPhotos.patolaLoom, span: "" },
  { p: craftPhotos.cottonLoom, span: "" },
];

export function CraftsmanshipSection() {
  return (
    <section aria-labelledby="craft-title" className="wrap grid gap-8 py-16 md:grid-cols-12 md:gap-x-12 md:gap-y-8 md:py-24 lg:py-36">
      <figure className="order-2 md:order-none md:col-span-7 md:row-span-2 md:self-center">
        {/* A collage of weaving techniques from across India */}
        <div className="grid h-[clamp(300px,44vw,560px)] grid-cols-3 grid-rows-2 gap-2 sm:gap-3">
          {COLLAGE.map((c) => (
            <div key={c.p.src} className={`collage-tile relative overflow-hidden bg-sand-soft ${c.span}`}>
              <img src={c.p.src} alt={c.p.alt} loading="lazy" className="size-full object-cover" />
              <span className="absolute bottom-2 left-2 bg-paper/90 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-ink sm:text-[11px]">{c.p.label}</span>
            </div>
          ))}
        </div>
        <figcaption className="mt-3 text-[11px] leading-relaxed tracking-[0.04em] text-ink-soft">
          Weaving across India. Photos via Wikimedia Commons:{" "}
          {COLLAGE.map((c, i) => (
            <span key={c.p.src}>
              {i > 0 && "; "}
              {c.p.credit} ({c.p.license})
            </span>
          ))}
          .
        </figcaption>
      </figure>
      <div className="order-1 md:order-none md:col-span-5 md:self-end md:pl-6">
        <p className="eyebrow">The art behind the drape</p>
        <h2 id="craft-title" className="section-title mt-5 max-md:mt-3 text-[#87264D]">
          Not Just Worn.
          <br />
          <em className="shimmer text-[#4E3F47]">Cherished.</em>
        </h2>
      </div>
      <div className="order-3 md:order-none md:col-span-5 md:self-start md:pl-6">
        <p className="max-w-[44ch] text-[16px] leading-relaxed text-ink-soft">
          Every weave carries the patience of its maker, the memory of a tradition, and the beauty of something made to be treasured.
        </p>
        <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-ink-soft">
          We choose each saree for its textile character: the hand of the silk, the rhythm of a border, the way a pallu falls.
        </p>
        <Link href="/our-story" className="text-link mt-10 max-md:mt-6">
          Discover Our Story <span aria-hidden>→</span>
        </Link>
        <p className="mt-6 max-md:mt-3 text-[11px] text-ink-soft">Proposed brand copy, subject to approval.</p>
      </div>
    </section>
  );
}
