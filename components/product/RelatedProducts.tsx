import { ProductCard } from "./ProductCard";

export function RelatedProducts({ slugs }: { slugs: string[] }) {
  return (
    <section aria-labelledby="related-title" className="wrap border-t border-sand py-20">
      <h2 id="related-title" className="section-title mb-10 font-sans! text-[clamp(1.6rem,2.8vw,2.2rem)]!">
        You May Also Love
      </h2>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-3">
        {slugs.map((slug) => (
          <ProductCard key={slug} slug={slug} />
        ))}
      </div>
    </section>
  );
}
