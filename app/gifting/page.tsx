import type { Metadata } from "next";
import GiftStudio from "@/components/gifting/studio/GiftStudio";

export const metadata: Metadata = {
  title: "Gifting",
  description: "You don't need to know sarees. You just need to know her. Choose, wrap and unbox a saree she'll love.",
  alternates: { canonical: "/gifting" },
};

/** Gifting: the immersive gift studio (discovery, 3D saree choice, wrapping, unboxing, checkout). */
export default function GiftingPage() {
  return <GiftStudio />;
}
