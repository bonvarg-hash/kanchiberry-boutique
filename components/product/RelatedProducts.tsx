import { ProductCard } from "./ProductCard";

export function RelatedProducts({ slugs }: { slugs: string[] }) {
  return (
    <section aria-labelledby="related-title" className="wrap border-t border-sand py-14 max-md:pb-28 md:py-20">
      <h2 id="related-title" className="section-title mb-6 font-sans! text-[clamp(1.6rem,2.8vw,2.2rem)]! md:mb-10">
        You May Also Love
      </h2>
      {/* Phones: a swipeable row with the next saree peeking in, instead of three full-width cards stacked. */}
      <div className="grid gap-x-6 gap-y-12 max-sm:-mx-(--wrap-pad) max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-4 max-sm:overflow-x-auto max-sm:overflow-y-hidden max-sm:overscroll-x-contain max-sm:[touch-action:pan-x_pan-y] max-sm:scroll-px-(--wrap-pad) max-sm:px-(--wrap-pad) max-sm:[scrollbar-width:none] sm:grid-cols-3">
        {slugs.map((slug) => (
          <div key={slug} className="max-sm:w-[62%] max-sm:shrink-0 max-sm:snap-start">
            <ProductCard slug={slug} />
          </div>
        ))}
      </div>
    </section>
  );
}
