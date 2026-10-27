"use client";

import Link from "next/link";
import { featuredProducts, formatPrice, products } from "@/lib/products";
import { weaves } from "@/lib/weaves";
import { craftPhotos } from "@/lib/craft";

/** Full-width dropdown content for each top-level nav item (desktop). */

function KnowMore({ href, label = "Know more" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="btn btn-primary mt-6 min-h-11 px-6">
      {label} <span aria-hidden>→</span>
    </Link>
  );
}

function Intro({ eyebrow, title, text, href }: { eyebrow: string; title: string; text: string; href: string }) {
  return (
    <div className="max-w-[30ch]">
      <p className="eyebrow">{eyebrow}</p>
      <p className="mt-3 text-[30px] leading-tight" style={{ fontFamily: "var(--font-title)" }}>
        {title}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{text}</p>
      <KnowMore href={href} />
    </div>
  );
}

function ShopPanel() {
  const picks = featuredProducts().slice(0, 4);
  return (
    <div className="grid grid-cols-[minmax(240px,1fr)_3fr] gap-12">
      <Intro
        eyebrow="Shop sarees"
        title="Every saree in the boutique"
        text="Heirloom silks, brocades and easy handlooms, all under ₹8000. Filter by weave, colour, occasion and price."
        href="/shop"
      />
      <ul className="grid grid-cols-4 gap-5">
        {picks.map((p) => (
          <li key={p.slug}>
            <Link href={`/sarees/${p.slug}`} className="group block">
              <span className="block aspect-[4/5] overflow-hidden bg-sand-soft">
                <img src={p.images[0].src} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </span>
              <span className="mt-2 block text-[15px] leading-tight" style={{ fontFamily: "var(--font-title)" }}>
                {p.name}
              </span>
              <span className="text-[13px] text-ink-soft">{formatPrice(p.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Entry = { name: string; href: string; count: number; thumb: string };

/** One tidy list: circular thumbnail, name, and a right-aligned count. */
function EntryList({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <div className="min-w-0">
      <p className="eyebrow mb-4 border-b border-sand pb-3">{title}</p>
      <ul className="space-y-1">
        {entries.map((e) => (
          <li key={e.name}>
            <Link href={e.href} className="group flex min-h-11 items-center gap-3 rounded-md px-1 transition-colors hover:bg-mist">
              <img src={e.thumb} alt="" loading="lazy" className="size-9 shrink-0 rounded-full object-cover ring-1 ring-sand" />
              <span className="min-w-0 flex-1 truncate text-[15px]">{e.name}</span>
              <span className="shrink-0 rounded-full bg-mist px-2 py-0.5 text-[11px] tabular-nums text-ink-soft group-hover:bg-paper">{e.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Real fabric photos chosen so every edit and occasion has its own recognisable thumbnail. */
const THUMBS: Record<string, string> = {
  "The Festive Edit": "/fabric/mor-paithani-body.jpg",
  "Heirloom Silks": "/fabric/violet-rose-kanjivaram-body.jpg",
  "Everyday Weaves": "/weaves/linen-cotton.jpg",
  Ceremony: "/fabric/sindoori-banarasi-body.jpg",
  Day: "/fabric/neel-chanderi-body.jpg",
  Evening: "/fabric/black-gold-stripe-kanjivaram-body.jpg",
  Everyday: "/weaves/linen-cotton.jpg",
  Festive: "/fabric/laal-patola-body.jpg",
  Wedding: "/fabric/arakku-kanjivaram-body.jpg",
  Work: "/weaves/chanderi.jpg",
};

const thumbOf = (items: typeof products) => {
  const p = items.find((x) => x.fabric) ?? items[0];
  return p.fabric?.body ?? p.images[0].src;
};

function CollectionsPanel() {
  const edits: Entry[] = [...new Set(products.map((p) => p.collection))].map((name) => {
    const items = products.filter((p) => p.collection === name);
    return { name, href: `/shop?q=${encodeURIComponent(name)}`, count: items.length, thumb: THUMBS[name] ?? thumbOf(items) };
  });
  const byWeave: Entry[] = weaves.map((w) => ({
    name: w.name,
    href: `/shop?weave=${w.slug}`,
    count: products.filter((p) => p.weave === w.slug).length,
    thumb: w.photo.src,
  }));
  const byOccasion: Entry[] = [...new Set(products.flatMap((p) => p.occasion))].sort().map((name) => {
    const items = products.filter((p) => p.occasion.includes(name));
    return { name, href: `/shop?occasion=${encodeURIComponent(name)}`, count: items.length, thumb: THUMBS[name] ?? thumbOf(items) };
  });
  return (
    <div className="grid grid-cols-[minmax(220px,1.1fr)_1fr_1fr_1fr] gap-10">
      <Intro
        eyebrow="Collections"
        title="Edits & weaves"
        text="Browse our curated edits, or explore sarees by weave and occasion."
        href="/collections"
      />
      <EntryList title={`The edits · ${edits.length}`} entries={edits} />
      <EntryList title={`By weave · ${byWeave.length}`} entries={byWeave} />
      <EntryList title={`By occasion · ${byOccasion.length}`} entries={byOccasion} />
    </div>
  );
}

function StoryPanel() {
  return (
    <div className="grid grid-cols-[minmax(240px,1fr)_2fr] items-center gap-12">
      <Intro
        eyebrow="Our story"
        title="A boutique for the love of weave"
        text="Kanchi, the temple town at the heart of South Indian silk, and berry, small and rich with colour: the finest fruit of Indian weave."
        href="/our-story"
      />
      <div className="grid grid-cols-2 gap-5">
        <img src="/photos/kb-17.jpg" alt="" loading="lazy" className="aspect-[4/3] w-full object-cover object-[50%_25%]" />
        <img src="/photos/kb-9.jpg" alt="" loading="lazy" className="aspect-[4/3] w-full object-cover object-[50%_55%]" />
      </div>
    </div>
  );
}

function WeavingPanel() {
  return (
    <div className="grid grid-cols-[minmax(240px,1fr)_1.6fr_1fr] items-start gap-12">
      <Intro
        eyebrow="The art of weaving"
        title="A guide to India's weaves"
        text="How Kanjivaram, Banarasi, Paithani, Chanderi, Patola and handloom cottons are made, and what to look for in each."
        href="/art-of-weaving"
      />
      <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
        {weaves.map((w) => (
          <li key={w.slug}>
            <Link href={`/art-of-weaving#${w.slug}`} className="group block">
              <span className="block text-[16px] font-medium leading-tight group-hover:underline">{w.name}</span>
              <span className="text-[13px] text-ink-soft">{w.line}</span>
            </Link>
          </li>
        ))}
      </ul>
      <figure>
        <img src={craftPhotos.kanchipuramLoom.src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
        <figcaption className="mt-2 text-[11px] text-ink-soft">
          {craftPhotos.kanchipuramLoom.label} · Photo: {craftPhotos.kanchipuramLoom.credit}
        </figcaption>
      </figure>
    </div>
  );
}

export const MEGA_PANELS: Record<string, () => React.JSX.Element> = {
  "/shop": ShopPanel,
  "/collections": CollectionsPanel,
  "/our-story": StoryPanel,
  "/art-of-weaving": WeavingPanel,
};
