"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** The old gift finder now lives in the gift studio on /gifting. */
export default function GiftFinderRedirect() {
  const router = useRouter();
  useEffect(() => router.replace("/gifting"), [router]);
  return <div className="min-h-[70vh]" aria-busy="true" />;
}
