import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/lib/products";
import { weaves } from "@/lib/weaves";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore Kanchiberry by collection and by weave.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  const collections = [...new Set(products.map((p) => p.collection))].map((name) => ({
    name,
    items: products.filter((p) => p.collection === name),
  }));
  return (
    <div className="wrap pb-24 pt-14 max-md:pb-16 max-md:pt-8 lg:pt-20">
      <p className="eyebrow">Collections</p>
      <h1 className="serif mt-4 text-[clamp(3rem,8vw,7rem)] max-md:mt-3 font-light leading-[0.9]">Edits & Weaves</h1>

      <section aria-labelledby="edits" className="mt-16 max-md:mt-10">
        <h2 id="edits" className="eyebrow mb-8 max-md:mb-4">
          The edits
        </h2>
        <ul className="grid gap-10 max-md:gap-8 md:grid-cols-3">
          {collections.map((c) => (
            <li key={c.name}>
              <Link href={`/shop?q=${encodeURIComponent(c.name)}`} className="group block">
                <span className="flex h-72 gap-1 overflow-hidden bg-sand-soft p-4">
                  {/* A taste of each edit: its first five sarees. */}
                  {c.items.slice(0, 5).map((p) => (
                    <img key={p.slug} src={p.frontViewImage} alt="" className="h-full min-w-0 flex-1 object-cover transition-[flex] duration-700 group-hover:first:flex-[1.6]" />
                  ))}
                </span>
                <span className="serif mt-4 block text-3xl max-md:mt-3">{c.name}</span>
                <span className="text-[13px] text-ink-soft">
                  {c.items.length} sarees · {c.items.slice(0, 3).map((p) => p.name).join(", ")}
                  {c.items.length > 3 && ` and ${c.items.length - 3} more`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="by-weave" className="mt-24 max-md:mt-14">
        <h2 id="by-weave" className="eyebrow mb-8 max-md:mb-4">
          By weave
        </h2>
        <ul className="grid gap-x-6 gap-y-10 max-md:gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {weaves.map((w) => (
            <li key={w.slug}>
              <Link href={`/shop?weave=${w.slug}`} className="group block">
                <span className="weave-tile block aspect-[4/3]">
                  <img src={w.swatch} alt={w.swatchAlt} loading="lazy" />
                </span>
                <span className="serif mt-4 block text-[28px] max-md:mt-3">{w.name}</span>
                <span className="text-[14px] text-ink-soft">{w.line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
