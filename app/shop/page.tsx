import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop All Sarees",
  description: "Browse Kanjivaram, Banarasi, Paithani, Chanderi, Patola and handloom sarees. Filter by weave, colour, occasion and price.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  // Opened from the hero CTA, the page rises from the bottom over the homepage.
  return (
    <ViewTransition enter={{ "page-rise": "page-rise", default: "none" }} exit="none" default="none">
      <div className="min-h-screen bg-paper">
        <Suspense fallback={<div className="wrap min-h-[60vh] py-20" />}>
          <ShopView />
        </Suspense>
      </div>
    </ViewTransition>
  );
}
