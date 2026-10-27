import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { ProductDetails } from "@/components/product/ProductDetails";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sarees/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name}, ${p.weaveName}`,
    description: `${p.tagline} ${p.weaveName} in ${p.color.toLowerCase()}.`,
    alternates: { canonical: `/sarees/${p.slug}` },
    openGraph: { title: `${p.name} · Kanchiberry`, description: p.tagline, type: "website" },
    // Structured product data (JSON-LD) is intentionally omitted until real prices and stock exist.
  };
}

export default async function ProductPage({ params }: PageProps<"/sarees/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  return (
    <>
      <nav aria-label="Breadcrumb" className="wrap hidden pt-8 text-[14px] text-ink-soft md:block">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/shop" className="hover:text-ink">
              Shop
            </Link>{" "}
            /
          </li>
          <li>
            <Link href={`/shop?weave=${p.weave}`} className="hover:text-ink">
              {p.weaveName}
            </Link>{" "}
            /
          </li>
          <li aria-current="page" className="text-ink">
            {p.name}
          </li>
        </ol>
      </nav>
      <ProductDetails product={p} />
    </>
  );
}
