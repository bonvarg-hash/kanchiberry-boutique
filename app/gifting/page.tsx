import type { Metadata } from "next";
import Link from "next/link";
import { Gift, MessageSquareHeart, Sparkles, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Gifting",
  description: "You don't need to know sarees to gift one she'll love. Answer a few questions and we'll help you find something beautiful.",
  alternates: { canonical: "/gifting" },
};

const STEPS = [
  { n: "01", title: "Tell us about her", text: "Who she is, the occasion, the look and colours she loves, and your budget." },
  { n: "02", title: "See sarees chosen for her", text: "A short, hand-picked selection, with a note on why each one suits her." },
  { n: "03", title: "Make it a gift", text: "Add gift packaging and a personal note, and send it straight to her door." },
];

const PROMISES = [
  { Icon: Gift, title: "Gift-ready packaging", text: "Choose our Signature Gift Box or classic packaging." },
  { Icon: MessageSquareHeart, title: "A personal note", text: "Write your own or pick one of ours; we print it on a card." },
  { Icon: Truck, title: "Free delivery in India", text: "Sent straight to her, with the price kept private if you like." },
];

/** Gifting landing: a guided way to choose a saree as a gift, for people who don't know sarees. */
export default function GiftingPage() {
  return (
    <div className="pb-24 max-md:pb-16">
      {/* Editorial hero: copy on the left, a large photograph on the right (on phones the photo follows the buttons). */}
      <section aria-labelledby="gift-title" className="wrap grid items-center gap-10 pt-14 max-md:gap-8 max-md:pt-8 md:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pt-20">
        <div>
          <p className="eyebrow">Gifting</p>
          <h1 id="gift-title" className="mt-4 text-[clamp(2.6rem,6.4vw,6rem)] leading-[0.95] tracking-[-0.015em] max-md:mt-3 max-md:text-[42px]" style={{ fontFamily: "var(--font-title)" }}>
            Make her day, <em className="shimmer text-[#87264D]">beautifully.</em>
          </h1>
          <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-ink-soft max-md:mt-4 max-md:text-[16px]">
            You don&rsquo;t need to know sarees to gift one she&rsquo;ll love. We&rsquo;ll help you find something beautiful.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 max-md:mt-8">
            <Link href="/gifting/find" className="btn btn-primary btn-shimmer max-sm:w-full">
              Find the Perfect Gift <span aria-hidden>→</span>
            </Link>
            <Link href="/shop" className="text-link">
              Explore All Sarees <span aria-hidden>→</span>
            </Link>
          </div>
          <p className="mt-6 text-[13px] text-ink-soft">Five quick questions. About a minute.</p>
        </div>
        <figure className="relative max-md:-mx-(--wrap-pad)">
          <img src="/photos/gift-box.jpg" alt="A folded gold silk saree in a black Kanchiberry gift box, with a berry ribbon and a handwritten note card" width={1800} height={900} className="aspect-[2/1] w-full object-cover" fetchPriority="high" />
        </figure>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-title" className="wrap mt-24 max-md:mt-16">
        <h2 id="how-title" className="eyebrow">
          How it works
        </h2>
        <ol className="mt-8 grid gap-10 max-md:mt-6 max-md:gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n}>
              <p className="text-[clamp(2rem,3.4vw,2.8rem)] leading-none text-[#87264D]" style={{ fontFamily: "var(--font-title)" }}>
                {s.n}
              </p>
              <p className="mt-4 text-[19px]">{s.title}</p>
              <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Reassurance */}
      <section aria-labelledby="promise-title" className="mt-24 bg-sand-soft py-16 max-md:mt-16 max-md:py-12">
        <div className="wrap">
          <h2 id="promise-title" className="sr-only">
            What comes with every gift
          </h2>
          <ul className="grid gap-8 md:grid-cols-3">
            {PROMISES.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F3F4EF] text-[#87264D]">
                  <Icon size={20} strokeWidth={1.5} aria-hidden />
                </span>
                <span>
                  <span className="block text-[16px]">{title}</span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-ink-soft">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap mt-24 text-center max-md:mt-16">
        <Sparkles size={22} strokeWidth={1.4} className="mx-auto text-[#87264D]" aria-hidden />
        <p className="mx-auto mt-4 max-w-[22ch] text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight" style={{ fontFamily: "var(--font-title)" }}>
          You don&rsquo;t need to know sarees. You just need to know her.
        </p>
        <Link href="/gifting/find" className="btn btn-primary mt-8 max-sm:w-full">
          Find the Perfect Gift <span aria-hidden>→</span>
        </Link>
      </section>
    </div>
  );
}
