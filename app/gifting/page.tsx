import type { Metadata } from "next";
import Link from "next/link";
import { Gift, PenLine, Ribbon } from "lucide-react";

export const metadata: Metadata = {
  title: "Gifting",
  description: "Gift-wrapped sarees, handwritten notes and gift cards from Kanchiberry. Launching soon.",
  alternates: { canonical: "/gifting" },
};

const COMING = [
  { Icon: Ribbon, title: "Gift-wrapped sarees", text: "Folded in tissue and boxed, ready to hand over." },
  { Icon: PenLine, title: "A handwritten note", text: "Your message, written by hand and tucked inside." },
  { Icon: Gift, title: "Gift cards", text: "Let them choose their own drape, in any amount." },
];

/** Gifting: a launching-soon page until the gifting edit is ready. */
export default function GiftingPage() {
  return (
    <div className="wrap pb-24 pt-14 max-md:pb-16 max-md:pt-8 lg:pt-20">
      <header>
        {/* Phones: the same title type as Shop, Wishlist and Bag. Desktop: the serif hero title. */}
        <h1 className="font-sans text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.9] max-md:text-[42px] md:[font-family:var(--font-title)] md:text-[clamp(3.2rem,9vw,8.5rem)] md:leading-[0.88] md:tracking-[-0.015em]">
          Gifting
        </h1>
        <p className="page-header-desc">Sarees to give, for the people you love.</p>
      </header>

      <section aria-labelledby="soon-title" className="mt-10 max-w-3xl border border-sand bg-white p-6 max-md:mt-8 sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-md border border-[#c69a3c]/60 bg-[#fbf6ec] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#8a5a12]">
          <span className="size-1.5 rounded-full bg-[#c69a3c] motion-safe:animate-pulse" aria-hidden />
          Launching soon
        </p>
        <h2 id="soon-title" className="mt-5 font-sans text-[26px] leading-tight sm:text-[32px]">
          The gifting edit is on its way
        </h2>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
          We are putting together sarees chosen for weddings, festivals and milestones, wrapped and ready to give. This page will open when it is ready.
        </p>

        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {COMING.map(({ Icon, title, text }) => (
            <li key={title}>
              <span className="grid size-11 place-items-center rounded-full bg-sand-soft text-[#87264D]">
                <Icon size={20} strokeWidth={1.5} aria-hidden />
              </span>
              <p className="mt-3 text-[15px] font-medium">{title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/shop" className="btn btn-primary">
            Browse All Sarees
          </Link>
          <Link href="/#curated" className="text-link">
            See Curated Picks <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
