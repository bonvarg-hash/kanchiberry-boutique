import type { Metadata } from "next";
import Link from "next/link";
import { weaves } from "@/lib/weaves";
import { craftPhotos } from "@/lib/craft";

export const metadata: Metadata = {
  title: "The Art of Weaving",
  description: "A guide to Kanjivaram, Banarasi, Paithani, Chanderi, Patola and handloom linen and cotton sarees.",
  alternates: { canonical: "/art-of-weaving" },
};

export default function ArtOfWeavingPage() {
  return (
    <div className="pb-24 max-md:pb-16">
      <header className="wrap pb-12 pt-14 max-md:pb-8 max-md:pt-8 lg:pt-24">
        <p className="eyebrow">A weaves guide</p>
        <h1 className="serif mt-5 max-md:mt-3 text-[clamp(3.2rem,9vw,8.5rem)] font-light leading-[0.88]">
          The Art
          <br />
          of Weaving
        </h1>
        <nav aria-label="Weaves on this page" className="mt-10 max-md:mt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            {weaves.map((w) => (
              <li key={w.slug}>
                <a href={`#${w.slug}`} className="nav-link">
                  {w.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {weaves.map((w, i) => (
        <section key={w.slug} id={w.slug} aria-labelledby={`${w.slug}-h`} className="wrap scroll-mt-24 border-t border-sand py-16 max-md:py-12 lg:py-24">
          <div className={`grid gap-10 max-md:gap-6 md:grid-cols-2 md:items-center ${i % 2 ? "md:[&>figure]:order-2" : ""}`}>
            <figure>
              <img src={w.photo.src} alt={w.photo.alt} loading="lazy" className="aspect-[5/4] w-full object-cover" />
            </figure>
            <div>
              <p className="eyebrow">{w.region}</p>
              <h2 id={`${w.slug}-h`} className="serif mt-3 text-5xl">
                {w.name}
              </h2>
              {w.story.map((s) => (
                <p key={s} className="mt-5 max-w-[52ch] leading-relaxed text-ink-soft max-md:mt-3">
                  {s}
                </p>
              ))}
              <h3 className="eyebrow mt-8 max-md:mt-6">Look for</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {w.signatures.map((s) => (
                  <li key={s} className="border border-sand bg-paper px-3 py-1 text-[13px]">
                    {s}
                  </li>
                ))}
              </ul>
              <Link href={`/shop?weave=${w.slug}`} className="text-link mt-8 max-md:mt-6">
                Explore {w.name} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      ))}
      <section id="credits" aria-labelledby="credits-h" className="wrap scroll-mt-24 border-t border-sand pt-12">
        <h2 id="credits-h" className="eyebrow">
          Photo credits
        </h2>
        <ul className="mt-5 space-y-2 text-[13px] text-ink-soft">
          {weaves.map((w) => (
            <li key={w.slug}>
              {w.name}: {w.photo.credit}, {w.photo.license},{" "}
              <a href={w.photo.source} className="underline" target="_blank" rel="noreferrer">
                Wikimedia Commons
              </a>
              . Photographs illustrate each weave tradition and are not Kanchiberry products.
            </li>
          ))}
          {Object.values(craftPhotos)
            .filter((c) => !c.src.startsWith("/weaves/"))
            .map((c) => (
              <li key={c.src}>
                {c.label}: {c.credit}, {c.license},{" "}
                <a href={c.source} className="underline" target="_blank" rel="noreferrer">
                  Wikimedia Commons
                </a>
                . Illustrates the craft; not Kanchiberry&rsquo;s own makers.
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
