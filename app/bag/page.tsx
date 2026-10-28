import type { Metadata } from "next";
import { ShoppingBag } from "@/components/commerce/ShoppingBag";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Shopping Bag", robots: { index: false } };

export default function BagPage() {
  return (
    <div className="wrap pb-24 pt-14 max-md:pb-16 max-md:pt-8 lg:pt-20">
      <PageHeader title="Shopping Bag" description="Your picks, ready when you are." className="mb-12 max-md:mb-8" />
      <ShoppingBag />
    </div>
  );
}
