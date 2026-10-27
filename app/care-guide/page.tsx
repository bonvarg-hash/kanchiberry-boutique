import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saree Care Guide",
  description: "General guidance on caring for silk, sheer and cotton or linen sarees.",
  alternates: { canonical: "/care-guide" },
};

const SECTIONS = [
  {
    t: "Silks: Kanjivaram, Banarasi, Paithani, Patola",
    items: [
      "Dry clean, especially for the first few washes.",
      "Store folded in muslin or soft cotton, away from direct sunlight and damp.",
      "Refold along new lines every few months so the zari does not crease and crack.",
      "Iron on low heat on the reverse, with a cloth between iron and fabric.",
    ],
  },
  {
    t: "Sheer weaves: Chanderi",
    items: ["A gentle dry clean is safest.", "Store loosely folded; avoid plastic covers.", "Steam lightly rather than pressing directly."],
  },
  {
    t: "Linen & cotton",
    items: ["Hand wash in cold water with a mild detergent; wash separately at first.", "Dry in the shade and avoid wringing.", "Iron while slightly damp on medium heat."],
  },
];

export default function CareGuidePage() {
  return (
    <div className="wrap max-w-4xl! pb-24 pt-14 lg:pt-20">
      <p className="eyebrow">Customer care</p>
      <h1 className="serif mt-4 text-[clamp(3rem,7vw,6rem)] font-light leading-[0.9]">Saree Care Guide</h1>
      <p className="lede mt-6 max-w-[56ch]!">
        General guidance for keeping your sarees beautiful. Always follow the care label on the individual saree where one is provided.
      </p>
      {SECTIONS.map((s) => (
        <section key={s.t} className="mt-14 border-t border-sand pt-8">
          <h2 className="serif text-3xl">{s.t}</h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-ink-soft">
            {s.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
