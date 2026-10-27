"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products, searchProducts } from "@/lib/products";
import { weaves } from "@/lib/weaves";
import { ProductCard } from "@/components/product/ProductCard";
import { CollectionFilters, PRICE_BANDS, type FilterKey } from "./CollectionFilters";

const SORTS = {
  featured: "Curated order",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  name: "Name, A–Z",
} as const;
type SortKey = keyof typeof SORTS;

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

  const results = useMemo(() => {
    let r = q.trim() ? searchProducts(q) : products;
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
      <header className="wrap pb-10 pt-14 lg:pt-20">
        <p className="eyebrow">{singleWeave ? singleWeave.region : "The collection"}</p>
        <h1 className="serif mt-4 text-[clamp(3rem,8vw,7rem)] font-light leading-[0.9]">{singleWeave ? singleWeave.name : q ? "Search" : "Shop All Sarees"}</h1>
        <p className="lede mt-6 max-w-[52ch]!">
          {singleWeave
            ? singleWeave.story[0]
            : "Every saree in the boutique, from heirloom silks to everyday handlooms. Filter by weave, colour, occasion or price."}
        </p>
      </header>

      <div className="wrap grid gap-10 pb-24 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
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

        <div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-sand pb-4">
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-[13px] tracking-[0.06em] lg:hidden"
              onClick={() => sheet.current?.showModal()}
              aria-haspopup="dialog"
            >
              <SlidersHorizontal size={15} strokeWidth={1.5} /> Filter
              {chips.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-ink text-[11px] text-paper">{chips.length}</span>}
            </button>
            <p className="order-last w-full text-[14px] sm:order-none sm:w-auto" aria-live="polite">
              {results.length} {results.length === 1 ? "saree" : "sarees"}
            </p>
            <label className="flex items-center gap-3 text-[13px]">
              <span className="text-ink-soft">Sort</span>
              <select value={sort} onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })} className="field min-h-11! w-auto py-0 text-[13px]">
                {Object.entries(SORTS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {chips.length > 0 && (
            <ul className="mb-8 flex flex-wrap gap-2" aria-label="Active filters">
              {chips.map((c) => (
                <li key={`${c.k}-${c.v}`}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 border border-ink px-3 py-1.5 text-[13px] hover:bg-ink hover:text-paper"
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
            <div className="border border-sand bg-paper p-10 text-center">
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
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
              {results.map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
