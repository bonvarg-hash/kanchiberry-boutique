import type { Metadata } from "next";
import { ShoppingBag } from "@/components/commerce/ShoppingBag";

export const metadata: Metadata = { title: "Shopping Bag", robots: { index: false } };

export default function BagPage() {
  return (
    <div className="wrap pb-24 pt-14 lg:pt-20">
      <h1 className="mb-12 font-sans text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.9]">Shopping Bag</h1>
      <ShoppingBag />
    </div>
  );
}
