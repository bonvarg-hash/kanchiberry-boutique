import type { Metadata } from "next";
import { ShoppingBag } from "@/components/commerce/ShoppingBag";

export const metadata: Metadata = { title: "Shopping Bag", robots: { index: false } };

export default function BagPage() {
  return (
    <div className="wrap pb-24 pt-14 lg:pt-20">
      <h1 className="serif mb-12 text-[clamp(3rem,7vw,6rem)] font-light leading-[0.9]">Shopping Bag</h1>
      <ShoppingBag />
    </div>
  );
}
