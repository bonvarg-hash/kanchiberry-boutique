import { featuredProducts, products } from "@/lib/products";
import { weaves } from "@/lib/weaves";
import { StatRing } from "./StatRing";

/** Numbers come straight from the catalogue, so they stay true as it changes. */
export function CraftStats() {
  const editions = new Set(products.map((p) => p.collection)).size;
  return (
    <section aria-labelledby="stats-title" className="wrap overflow-x-clip py-16 text-center md:py-24 lg:py-32">
      <h2 id="stats-title" className="section-title text-[#87264D]">
        Woven <em className="shimmer text-[#4E3F47]">With Care</em>, One Thread at a Time
      </h2>
      <p className="lede mx-auto mt-5 max-w-[56ch]! max-md:mt-3">
        A boutique of weaves from across India, each chosen for its colour, its border and the way it falls.
      </p>
      <div className="relative mt-16 max-md:mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
        <span aria-hidden className="twinkle absolute left-1/2 top-[-34px] -translate-x-1/2 text-ink">
          ✦
        </span>
        <StatRing value={weaves.length} label="Weave traditions" start={-140} />
        <StatRing value={featuredProducts().length} label="Sarees on the rail" start={30} reverse />
        <StatRing value={editions} label="Curated edits" start={-60} />
        <span aria-hidden className="twinkle absolute bottom-[-34px] left-1/2 -translate-x-1/2 text-ink [animation-delay:1.6s]">
          ✦
        </span>
      </div>
    </section>
  );
}
