"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

/**
 * SAMPLE REVIEWS. Realistic in tone so the layout reads true, but written for
 * the prototype, not by real customers; each card is labelled as a sample.
 * Replace with approved customer reviews before launch.
 */
const REVIEWS = [
  {
    name: "Lakshmi R.",
    place: "Thrissur, Kerala",
    rating: 5,
    saree: "Arakku Kanjivaram",
    tags: ["True to colour", "Rich zari", "Occasion-ready"],
    text: "Wore it for my daughter's wedding reception. The maroon is deep and true to the photos, and the zari border has real weight to it.",
  },
  {
    name: "Ananya S.",
    place: "Bengaluru",
    rating: 5,
    saree: "Neel Chanderi",
    tags: ["Lightweight", "Subtle shimmer", "Thoughtful packaging"],
    text: "Light enough for a long summer afternoon, with just a glimmer of gold at the border. It came beautifully folded with a care note.",
  },
  {
    name: "Meera K.",
    place: "Kochi, Kerala",
    rating: 4,
    saree: "Emerald & Magenta Silk",
    tags: ["Lustrous colour", "Worth the wait"],
    text: "The green and magenta catch the light differently every time I move. Delivery took a day longer than promised, but it was worth the wait.",
  },
  {
    name: "Priya V.",
    place: "Thiruvananthapuram, Kerala",
    rating: 5,
    saree: "Sabz Linen",
    tags: ["Everyday wear", "Easy drape", "Softens with wear"],
    text: "My everyday office favourite now. It drapes easily, doesn't crush, and has softened nicely after a few gentle washes.",
  },
  {
    name: "Shalini M.",
    place: "Kozhikode, Kerala",
    rating: 4,
    saree: "Mor Paithani",
    tags: ["Statement pallu", "Festive"],
    text: "The pallu is the star, and everyone at the puja asked about the peacocks. The blouse piece was a shade lighter than I expected.",
  },
  {
    name: "Divya N.",
    place: "Kottayam, Kerala",
    rating: 5,
    saree: "Sindoori Banarasi",
    tags: ["Handwoven", "Rich colour", "Festive"],
    text: "Bought it for Diwali after seeing it on the rail. The red is rich without being loud, and the brocade feels properly handwoven.",
  },
  {
    name: "Revathi S.",
    place: "Dubai, UAE",
    rating: 5,
    saree: "Violet & Rose Silk",
    tags: ["Secure checkout", "On-time delivery", "Order updates"],
    text: "I was nervous buying a silk saree online for the first time. Payment was smooth, I got an update at every step, and it arrived the day they said.",
  },
  {
    name: "Farah A.",
    place: "London, UK",
    rating: 5,
    saree: "Laal Patola",
    tags: ["Genuine handloom", "Matches the photos", "Fine finishing"],
    text: "The quality is exactly what the photos promised, down to the double-ikat pattern. The edges and tassels are finished neatly; you can tell it is real handloom.",
  },
  {
    name: "Kavya P.",
    place: "Kannur, Kerala",
    rating: 5,
    saree: "Neelambari Kanjivaram",
    tags: ["Helpful support", "Quick replies", "Personal touch"],
    text: "I asked about blouse stitching and had a reply within the hour from someone who really knew the weave. It felt like shopping at a family store.",
  },
  {
    name: "Nandini G.",
    place: "Alappuzha, Kerala",
    rating: 4,
    saree: "Raat Rani Banarasi",
    tags: ["Easy exchange", "Courteous team"],
    text: "The shade was a touch darker than I wanted on screen. The exchange was simple, and the team was polite and patient throughout.",
  },
  {
    name: "Sneha J.",
    place: "Palakkad, Kerala",
    rating: 5,
    saree: "Mitti Cotton",
    tags: ["Consistent quality", "Honest descriptions", "Gift-ready packaging"],
    text: "My third order now. The quality has been the same every time, the descriptions are honest, and the packaging is lovely enough to gift.",
  },
];

/** Sample ratings, like the reviews themselves. */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1" role="img" aria-label={`Sample rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={15}
          strokeWidth={1.4}
          aria-hidden
          className={`text-[#C69A3C] ${n <= rating ? "star-shimmer" : ""}`}
          style={{ "--i": n } as React.CSSProperties}
          fill={n <= rating ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function Card({ r, className = "w-[320px] sm:aspect-[2/1] sm:w-[720px]" }: { r: (typeof REVIEWS)[number]; className?: string }) {
  // What they said (stars, quote and the highlights it names), then who said it, as
  // one block centred in the fixed 2:1 card: equal space above and below, fixed gaps.
  return (
    <figure className={`flex ${className} shrink-0 flex-col justify-center border border-sand bg-paper p-7 sm:p-10`}>
      <div>
        <Stars rating={r.rating} />
        <blockquote className="mt-5 font-sans text-[18px] font-normal italic leading-[1.55] sm:text-[19px]">&ldquo;{r.text}&rdquo;</blockquote>
        {/* What the reviewer valued, pulled from their own words. */}
        <ul className="review-tags mt-5 flex flex-nowrap items-center gap-2 overflow-x-auto [scrollbar-width:none]" aria-label="Highlights">
          {r.tags.map((t) => (
            <li key={t} className="review-tag">
              {t}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-8 text-[14px]">
        <p>
          <span className="font-medium">{r.name}</span>
          <span className="text-ink-soft">, {r.place}</span>
        </p>
        <p className="mt-1 text-[13px] text-ink-soft">Bought the {r.saree}</p>
      </figcaption>
    </figure>
  );
}

export function CustomerTestimonials() {
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
      <div className="wrap mb-8 md:mb-12">
        <div>
          <h2 id="stories-title" className="section-title text-[#87264D]">
            Woven Into <em className="shimmer text-[#4E3F47]">Their Stories</em>
          </h2>
          <p className="lede mt-5">A few kind words from those who found something special at Kanchiberry.</p>
          {/* One disclosure for the section while the reviews are samples; remove with them. */}
          <p className="mt-3 text-[12px] text-ink-soft">Sample reviews shown for preview. Customer reviews will appear here after launch.</p>
        </div>
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
      <div className="marquee-viewport hidden overflow-hidden md:block">
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
