"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react";

/**
 * PLACEHOLDER REVIEWS. These are written for layout only; they are not from
 * real customers. Replace with approved reviews before launch.
 */
const REVIEWS = [
  { name: "Placeholder A.", rating: 5, saree: "Arakku Kanjivaram", text: "Sample review text. The maroon is so rich, and the zari has real weight to it." },
  { name: "Placeholder B.", rating: 5, saree: "Neel Chanderi", text: "Sample review text. Light enough for a long afternoon, with just a glimmer of gold." },
  { name: "Placeholder C.", rating: 4, saree: "Neelambari Kanjivaram", text: "Sample review text. The checks catch the light differently every time I move." },
  { name: "Placeholder D.", rating: 5, saree: "Sabz Linen", text: "Sample review text. My everyday favourite, and it softens with every wash." },
  { name: "Placeholder E.", rating: 4, saree: "Mor Paithani", text: "Sample review text. The pallu is the star; everyone asked about the peacocks." },
];

/** Placeholder ratings, like the reviews themselves. */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1" role="img" aria-label={`Placeholder rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={15} strokeWidth={1.4} aria-hidden className="text-[#C69A3C]" fill={n <= rating ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

function Card({ r, className = "w-[300px] sm:w-[380px]" }: { r: (typeof REVIEWS)[number]; className?: string }) {
  return (
    <figure className={`flex ${className} shrink-0 flex-col justify-between gap-6 border border-sand bg-paper p-7 sm:p-8`}>
      <Stars rating={r.rating} />
      <blockquote className="serif text-[22px] leading-snug">{r.text}</blockquote>
      <figcaption className="text-[13px]">
        <span className="font-medium">{r.name}</span>
        <span className="text-ink-soft"> · {r.saree}</span>
        <span className="tag-sample mt-3 block w-fit">Placeholder review</span>
      </figcaption>
    </figure>
  );
}

export function CustomerTestimonials() {
  const [paused, setPaused] = useState(false);
  const [card, setCard] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const goTo = (i: number) => {
    const n = Math.max(0, Math.min(REVIEWS.length - 1, i));
    const el = strip.current?.children[n] as HTMLElement | undefined;
    if (el && strip.current) strip.current.scrollTo({ left: el.offsetLeft - strip.current.offsetLeft - 16, behavior: "smooth" });
    setCard(n);
  };
  return (
    <section aria-labelledby="stories-title" className="bg-mist py-16 md:py-24 lg:py-32">
      <div className="wrap mb-8 grid gap-6 md:mb-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 id="stories-title" className="section-title">
            Woven Into Their Stories
          </h2>
          <p className="lede mt-5">A few kind words from those who found something special at Kanchiberry.</p>
        </div>
        <button type="button" className="motion-only text-link hidden self-start md:inline-flex" onClick={() => setPaused((v) => !v)} aria-pressed={paused}>
          {paused ? <Play size={14} /> : <Pause size={14} />} {paused ? "Resume" : "Pause"} movement
        </button>
      </div>
      {/* Phones: one card at a time with the next peeking in; swipe or use the arrows. Nothing moves on its own. */}
      <div className="md:hidden">
        <div
          ref={strip}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-1 [scrollbar-width:none]"
          aria-label="Customer stories"
          onScroll={(e) => {
            const el = e.currentTarget;
            const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
            setCard(Math.round(el.scrollLeft / (w + 12)));
          }}
        >
          {REVIEWS.map((r) => (
            <div key={r.name} className="snap-start">
              <Card r={r} className="h-full w-[84vw] max-w-[380px]" />
            </div>
          ))}
        </div>
        <div className="wrap mt-5 flex items-center justify-end gap-1">
          <button type="button" className="rack-arrow size-11!" aria-label="Previous story" disabled={card <= 0} onClick={() => goTo(card - 1)}>
            <ArrowLeft size={17} strokeWidth={1.5} />
          </button>
          <span className="w-14 text-center text-[12px] tabular-nums tracking-[0.12em] text-ink-soft" aria-live="polite">
            {card + 1} / {REVIEWS.length}
          </span>
          <button type="button" className="rack-arrow size-11!" aria-label="Next story" disabled={card >= REVIEWS.length - 1} onClick={() => goTo(card + 1)}>
            <ArrowRight size={17} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="marquee-viewport hidden overflow-hidden md:block" data-paused={paused}>
        <div className="marquee px-[clamp(16px,4vw,64px)]">
          {REVIEWS.map((r) => (
            <Card key={r.name} r={r} />
          ))}
          <div className="marquee-dupe contents" aria-hidden>
            {REVIEWS.map((r) => (
              <Card key={`d-${r.name}`} r={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
