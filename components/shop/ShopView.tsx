"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products, searchProducts, type Product } from "@/lib/products";
import { weaves } from "@/lib/weaves";
import { SareeTile } from "./SareeTile";
import { CollectionFilters, PRICE_BANDS, type FilterKey } from "./CollectionFilters";
import { SortMenu } from "./SortMenu";

const SORTS = {
  featured: "Curated order",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  name: "Name, A–Z",
} as const;
type SortKey = keyof typeof SORTS;

/**
 * Quick filters in the bar above the grid. Predefined ways in for saree shoppers;
 * they combine with the panel filters. "New Arrivals" is illustrative until real
 * arrival dates exist: the latest sarees added to the catalogue.
 */
const NEW_ARRIVALS = new Set(products.slice(-36).map((p) => p.slug));
const sale = (p: Product) => !!p.compareAtPrice && p.compareAtPrice > p.price;
const QUICK: { id: string; label: string; test: (p: Product) => boolean }[] = [
  { id: "silk", label: "Silk", test: (p) => p.weave !== "linen-cotton" },
  { id: "cotton", label: "Cotton", test: (p) => p.weave === "linen-cotton" || p.weave === "chanderi" },
  { id: "festive", label: "Festive", test: (p) => p.occasion.includes("Festive") },
  { id: "wedding", label: "Wedding", test: (p) => p.occasion.includes("Wedding") || p.collection === "Bridal Trousseau" },
  { id: "everyday", label: "Everyday", test: (p) => p.occasion.some((o) => o === "Everyday" || o === "Day" || o === "Work") },
  { id: "new", label: "New Arrivals", test: (p) => NEW_ARRIVALS.has(p.slug) },
  { id: "under-2000", label: "Under ₹2,000", test: (p) => p.price < 2000 },
  { id: "under-5000", label: "Under ₹5,000", test: (p) => p.price < 5000 },
  { id: "under-10000", label: "Under ₹10,000", test: (p) => p.price < 10000 },
  { id: "sale", label: "On Sale", test: sale },
  { id: "bridal", label: "Bridal", test: (p) => p.collection === "Bridal Trousseau" },
  { id: "office", label: "Office Wear", test: (p) => p.occasion.includes("Work") },
  { id: "evening", label: "Evening", test: (p) => p.occasion.includes("Evening") },
  { id: "light", label: "Lightweight", test: (p) => p.weave === "chanderi" || p.weave === "linen-cotton" },
  { id: "kanjivaram", label: "Kanjivaram", test: (p) => p.weave === "kanjivaram" },
  { id: "banarasi", label: "Banarasi", test: (p) => p.weave === "banarasi" },
  { id: "paithani", label: "Paithani", test: (p) => p.weave === "paithani" },
  { id: "chanderi", label: "Chanderi", test: (p) => p.weave === "chanderi" },
  { id: "patola", label: "Patola", test: (p) => p.weave === "patola" },
  { id: "last-few", label: "Last Few Left", test: (p) => p.stock !== undefined && p.stock > 0 && p.stock <= 2 },
];

/** Sarees shown at first, and added with each "Load more". */
const PAGE = 24;

export function ShopView() {
  const params = useSearchParams();
  const sheet = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const list = (k: FilterKey) => params.get(k)?.split(",").filter(Boolean) ?? [];
  const selected: Record<FilterKey, string[]> = {
    weave: list("weave"),
    color: list("color"),
    occasion: list("occasion"),
    price: list("price"),
  };
  const q = params.get("q") ?? "";
  const quick = QUICK.find((t) => t.id === params.get("tag"));
  const sort = (params.get("sort") as SortKey) in SORTS ? (params.get("sort") as SortKey) : "featured";

  const update = (next: Record<string, string | null>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const s = sp.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };

  const toggle = (k: FilterKey, v: string) => {
    const cur = selected[k];
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    update({ [k]: next.join(",") || null });
  };

  // Show the first PAGE results, more on request; start again whenever the filters or sort change.
  const [shown, setShown] = useState(PAGE);
  const query = params.toString();
  useEffect(() => setShown(PAGE), [query]);

  const results = useMemo(() => {
    let r = q.trim() ? searchProducts(q) : products;
    if (quick) r = r.filter(quick.test);
    if (selected.weave.length) r = r.filter((p) => selected.weave.includes(p.weave));
    if (selected.color.length) r = r.filter((p) => selected.color.includes(p.colorFamily));
    if (selected.occasion.length) r = r.filter((p) => p.occasion.some((o) => selected.occasion.includes(o)));
    if (selected.price.length)
      r = r.filter((p) => selected.price.some((b) => {
        const band = PRICE_BANDS.find((x) => x.id === b);
        return band ? p.price >= band.min && p.price < band.max : true;
      }));
    const sorted = [...r];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const singleWeave = selected.weave.length === 1 ? weaves.find((w) => w.slug === selected.weave[0]) : undefined;
  const chips = [
    ...(q ? [{ k: "q", v: q, label: `“${q}”` }] : []),
    ...(Object.keys(selected) as FilterKey[]).flatMap((k) =>
      selected[k].map((v) => ({
        k,
        v,
        label: k === "weave" ? weaves.find((w) => w.slug === v)?.name ?? v : k === "price" ? PRICE_BANDS.find((b) => b.id === v)?.label ?? v : v,
      })),
    ),
  ];

  return (
    <>
      {/* Editorial header: the title large on the left, a short note on the right (desktop). */}
      <header className="wrap pb-6 pt-6 md:pb-12 md:pt-8">
        {(singleWeave || q) && (
          <nav aria-label="Breadcrumb" className="-my-3 text-[14px] text-ink-soft max-md:hidden">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/shop" className="inline-flex min-h-11 items-center hover:text-ink">
                  All Collections
                </Link>{" "}
                /
              </li>
              <li aria-current="page" className="text-ink">
                {singleWeave ? singleWeave.name : "Search"}
              </li>
            </ol>
          </nav>
        )}
        <div className="md:mt-10 md:grid md:grid-cols-[1fr_minmax(220px,34ch)] md:items-end md:gap-12 lg:mt-14">
          <div>
            {singleWeave && <p className="eyebrow mb-3 max-md:mt-2 md:mb-4">{singleWeave.region}</p>}
            {/* Phones: same type as the Wishlist and Shopping Bag titles. Desktop: the serif hero title used on The Art of Weaving. */}
            <h1 className="font-sans text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.9] max-md:mt-2 max-md:text-[42px] md:[font-family:var(--font-title)] md:text-[clamp(3.2rem,9vw,8.5rem)] md:font-normal md:leading-[0.88] md:tracking-[-0.015em]">
              {singleWeave ? singleWeave.name : q ? "Search" : "All Collections"}
            </h1>
          </div>
          {/* Phones: the standard one-line description under the title (see PageHeader). */}
          <p className="page-header-desc md:hidden">
            {singleWeave ? singleWeave.line : q ? `Sarees matching “${q}”.` : "Every saree in the boutique, in one place."}
          </p>
          <p className="text-[14px] leading-relaxed text-ink-soft max-md:hidden">
            {singleWeave
              ? singleWeave.story[0]
              : "Every saree in the boutique, from heirloom silks to everyday handlooms, chosen one by one. Browse by weave, colour, occasion or price."}
          </p>
        </div>
      </header>

      <div className="wrap grid gap-10 pb-24 lg:grid-cols-[240px_1fr]">
        {/* Desktop: the filters stay in view beside the sarees and scroll on their own. */}
        <div className="filter-rail hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pb-6 lg:pr-3">
          <CollectionFilters selected={selected} onToggle={toggle} onClear={() => router.replace(pathname, { scroll: false })} hasAny={chips.length > 0} />
        </div>

        {/* Phones and tablets: filters in a bottom sheet. Selections apply as you tap and are kept when it reopens. */}
        <dialog
          ref={sheet}
          aria-label="Filters"
          className="sheet-bottom m-0 mt-auto max-h-[88dvh] w-full max-w-none overflow-hidden rounded-t-2xl bg-paper p-0 text-ink backdrop:bg-ink/35 lg:hidden"
          onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        >
          <div className="flex max-h-[88dvh] flex-col">
            <div className="flex items-center justify-between border-b border-sand px-5 py-3">
              <p className="text-[20px]" style={{ fontFamily: "var(--font-title)" }}>
                Filters
              </p>
              <button type="button" className="icon-btn -mr-2" aria-label="Close filters" onClick={() => sheet.current?.close()}>
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              <CollectionFilters selected={selected} onToggle={toggle} onClear={() => router.replace(pathname, { scroll: false })} hasAny={chips.length > 0} />
            </div>
            <div className="flex gap-3 border-t border-sand px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                disabled={chips.length === 0}
                onClick={() => router.replace(pathname, { scroll: false })}
              >
                Clear all
              </button>
              <button type="button" className="btn btn-primary flex-[2]" onClick={() => sheet.current?.close()}>
                Show {results.length} {results.length === 1 ? "saree" : "sarees"}
              </button>
            </div>
          </div>
        </dialog>

        <div className="min-w-0">
          {/* Count and sort, then the quick filters. Phones and tablets: this stays pinned under the header. */}
          <div className="mb-8 max-lg:sticky max-lg:top-14 max-lg:z-20 max-lg:-mx-(--wrap-pad) max-lg:bg-paper/95 max-lg:px-(--wrap-pad) max-lg:pb-3 max-lg:pt-3 max-lg:backdrop-blur sm:max-lg:top-16">
            <div className="shop-toolbar flex items-center justify-between gap-3">
              {/* The count is still announced to screen readers as filters change. */}
              <p className="sr-only" aria-live="polite">
                {results.length} {results.length === 1 ? "saree" : "sarees"}
              </p>
              <div className="flex flex-1 items-center justify-between gap-2 lg:justify-end">
                <button
                  type="button"
                  className="-ml-2 inline-flex min-h-11 items-center gap-2 px-2 text-[13px] tracking-[0.06em] lg:hidden"
                  onClick={() => sheet.current?.showModal()}
                  aria-haspopup="dialog"
                >
                  <SlidersHorizontal size={15} strokeWidth={1.5} /> Filter
                  {chips.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-ink text-[11px] text-paper">{chips.length}</span>}
                </button>
                <SortMenu value={sort} options={SORTS} onChange={(k) => update({ sort: k === "featured" ? null : k })} />
              </div>
            </div>
            <nav aria-label="Quick filters" className="quick-filters mt-4 md:mt-6">
              <ul>
                <li>
                  <button type="button" aria-pressed={!quick} onClick={() => update({ tag: null })}>
                    All
                  </button>
                </li>
                {QUICK.map((t) => (
                  <li key={t.id}>
                    <button type="button" aria-pressed={quick?.id === t.id} onClick={() => update({ tag: quick?.id === t.id ? null : t.id })}>
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {chips.length > 0 && (
            <ul className="mb-8 flex flex-wrap gap-2" aria-label="Active filters">
              {chips.map((c) => (
                <li key={`${c.k}-${c.v}`}>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center gap-2 border border-ink px-3 text-[13px] hover:bg-ink hover:text-paper"
                    onClick={() => (c.k === "q" ? update({ q: null }) : toggle(c.k as FilterKey, c.v))}
                    aria-label={`Remove filter ${c.label}`}
                  >
                    {c.label} <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {results.length === 0 ? (
            <div className="bg-sand-soft/60 p-10 text-center">
              <p className="serif text-3xl">No sarees match just yet.</p>
              <p className="mt-3 text-ink-soft">Try removing a filter, or browse a weave:</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {weaves.map((w) => (
                  <Link key={w.slug} href={`/shop?weave=${w.slug}`} className="border border-sand px-3 py-1.5 text-sm hover:border-ink">
                    {w.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Image-led tiles, close together, with room to breathe between rows. */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-8 sm:gap-x-3 md:grid-cols-3 md:gap-y-12 2xl:grid-cols-4">
                {results.slice(0, shown).map((p, i) => (
                  <SareeTile key={p.slug} p={p} priority={i < 3} />
                ))}
              </div>
              <div className="mt-16 flex flex-col items-center gap-4 text-center">
                <p className="text-[13px] text-ink-soft">
                  Showing {Math.min(shown, results.length)} of {results.length} sarees
                </p>
                <span className="block h-px w-48 bg-sand" aria-hidden>
                  <span className="block h-px bg-ink transition-[width] duration-500" style={{ width: `${(Math.min(shown, results.length) / results.length) * 100}%` }} />
                </span>
                {shown < results.length && (
                  <button type="button" className="btn btn-ghost mt-2 max-sm:w-full" onClick={() => setShown((n) => n + PAGE)}>
                    Load {Math.min(PAGE, results.length - shown)} more
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
