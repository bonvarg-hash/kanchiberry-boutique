"use client";

import { useMemo, useState } from "react";
import { getProduct, type ProductImage } from "@/lib/products";
import { tintFilter } from "@/lib/colour";
import { ProductGallery } from "./ProductGallery";
import { ProductInformation } from "./ProductInformation";

/**
 * Product gallery and details sharing the selected colourway. The first
 * colourway shows the real photos; the others show the fabric-only photos
 * tinted to that colour (model shots are left out, since tinting would
 * recolour skin too), captioned as colour previews.
 */
/** Takes the saree's slug, not the saree, so server pages don't copy its details into their data. */
export function ProductView({ slug }: { slug: string }) {
  const p = getProduct(slug)!;
  const [variant, setVariant] = useState(0);
  // Direction of the last change: +1 picked a colour to the right, -1 to the left.
  const [dir, setDir] = useState(0);
  const choose = (i: number) => {
    if (i === variant) return;
    setDir(i > variant ? 1 : -1);
    setVariant(i);
  };
  const v = p.variants[variant] ?? p.variants[0];

  const { images, filter } = useMemo(() => {
    if (variant === 0) return { images: p.images, filter: undefined };
    const fabricOnly = [p.hangingViewImage, p.fabric?.body].filter((src, i, a): src is string => !!src && a.indexOf(src) === i);
    const previews: ProductImage[] = fabricOnly.map((src, i) => ({
      src,
      label: `${v.name} · colour preview${fabricOnly.length > 1 ? ` ${i + 1}` : ""}`,
      alt: `${p.name} fabric shown in ${v.name}, a colour preview`,
      credit: p.images[0]?.credit ? `${p.images[0].credit}, tinted` : undefined,
    }));
    return { images: previews, filter: tintFilter(p.variants[0].hex, v.hex) };
  }, [variant, p, v]);

  return (
    <>
      <div key={variant} className="min-w-0 max-md:order-1 lg:sticky lg:top-24 lg:self-start" data-swap={dir === 0 ? undefined : dir > 0 ? "right" : "left"}>
        <ProductGallery images={images} name={p.name} filter={filter} />
      </div>
      <ProductInformation product={p} variant={variant} onVariant={choose} />
    </>
  );
}
