import { relatedProducts, type Product } from "@/lib/products";
import { ProductView } from "./ProductView";
import { RelatedProducts } from "./RelatedProducts";

/** The body of a product page: gallery, details and related sarees. Shared by the page and the slide-up sheet. */
export function ProductDetails({ product: p }: { product: Product }) {
  return (
    <>
      <div className="wrap grid gap-8 pb-16 pt-4 max-md:pb-12 max-md:flex max-md:pt-0 max-md:flex-col max-md:gap-0 md:gap-10 md:pb-20 md:pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <ProductView slug={p.slug} />
      </div>
      <RelatedProducts slugs={relatedProducts(p).map((r) => r.slug)} />
    </>
  );
}
