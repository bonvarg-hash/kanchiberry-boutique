import type { Metadata } from "next";
import Link from "next/link";
import { getProduct } from "@/lib/products";
import { textileUri } from "@/lib/textile";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Kanchiberry: a contemporary saree boutique and a modern ode to Indian textiles.",
  alternates: { canonical: "/our-story" },
};

export default function OurStoryPage() {
  const p = getProduct("neelambari-kanjivaram")!;
  return (
    <article className="pb-24">
      <header className="wrap pb-16 pt-14 lg:pt-24">
        <p className="eyebrow">Our story</p>
        <h1 className="serif mt-5 max-w-[14ch] text-[clamp(3.2rem,9vw,8.5rem)] font-light leading-[0.88]">
          A boutique for the love of <em>weave</em>.
        </h1>
      </header>
      <div className="wrap grid gap-14 md:grid-cols-12">
        <figure className="md:col-span-6">
          <img src={textileUri(p.textile, "detail")} alt="Illustrative render of a mustard-gold border with a mango-motif pallu" className="aspect-[4/5] w-full object-cover" />
        </figure>
        <div className="space-y-6 text-[16px] leading-relaxed text-ink-soft md:col-span-5 md:col-start-8 md:pt-10">
          <div className="notice">
            <strong>Placeholder copy.</strong> This page needs the brand’s real story. The text below is proposed and makes no claims about sourcing,
            artisans or production.
          </div>
          <p className="serif text-3xl leading-snug text-ink">Kanchiberry began with a simple idea: that choosing a saree should feel like discovering one.</p>
          <p>
            Our name joins Kanchi, the temple town at the heart of South Indian silk, with berry: the fruit, small and rich with colour. Together they
            describe what we look for: the finest fruit of Indian weave.
          </p>
          <p>
            We curate sarees for their textile character: the hand of the fabric, the rhythm of a border, the way a pallu falls. Each one is presented
            with the details that matter, so you can choose with care.
          </p>
          <Link href="/art-of-weaving" className="text-link text-ink">
            The Art of Weaving <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
