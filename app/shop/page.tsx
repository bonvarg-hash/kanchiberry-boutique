import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop All Sarees",
  description: "Browse Kanjivaram, Banarasi, Paithani, Chanderi, Patola and handloom sarees. Filter by weave, colour, occasion and price.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="wrap min-h-[60vh] py-20" />}>
      <ShopView />
    </Suspense>
  );
}
