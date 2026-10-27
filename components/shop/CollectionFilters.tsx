"use client";

import { products } from "@/lib/products";
import { weaves } from "@/lib/weaves";

export type FilterKey = "weave" | "color" | "occasion" | "price";

export const PRICE_BANDS = [
  { id: "under-4000", label: "Under ₹4000", min: 0, max: 4000 },
  { id: "4000-6000", label: "₹4000 – ₹6000", min: 4000, max: 6000 },
  { id: "6000-8000", label: "₹6000 – ₹8000", min: 6000, max: 8000 },
];

const uniq = (xs: string[]) => [...new Set(xs)].sort();

export function CollectionFilters({
  selected,
  onToggle,
  onClear,
  hasAny,
}: {
  selected: Record<FilterKey, string[]>;
  onToggle: (k: FilterKey, v: string) => void;
  onClear: () => void;
  hasAny: boolean;
}) {
  const groups: { key: FilterKey; title: string; options: { value: string; label: string }[] }[] = [
    { key: "weave", title: "Weave", options: weaves.map((w) => ({ value: w.slug, label: w.name })) },
    { key: "color", title: "Colour", options: uniq(products.map((p) => p.colorFamily)).map((c) => ({ value: c, label: c })) },
    { key: "occasion", title: "Occasion", options: uniq(products.flatMap((p) => p.occasion)).map((o) => ({ value: o, label: o })) },
    { key: "price", title: "Price", options: PRICE_BANDS.map((b) => ({ value: b.id, label: b.label })) },
  ];

  return (
    <aside aria-label="Filters">
      <details className="acc group lg:pointer-events-none" open>
        <summary className="flex min-h-11 items-center justify-between border-y border-sand text-[13px] tracking-[0.14em] uppercase lg:border-t-0">
          Filter
          {hasAny && (
            <button type="button" onClick={(e) => (e.preventDefault(), onClear())} className="pointer-events-auto text-[12px] normal-case tracking-normal underline">
              Clear all
            </button>
          )}
        </summary>
        <div className="pointer-events-auto grid gap-8 pt-6 sm:grid-cols-2 lg:grid-cols-1">
          {groups.map((g) => (
            <fieldset key={g.key}>
              <legend className="eyebrow mb-3">{g.title}</legend>
              <ul className="space-y-1.5">
                {g.options.map((o) => (
                  <li key={o.value}>
                    <label className="flex cursor-pointer items-center gap-3 py-1 text-[14px]">
                      <input type="checkbox" className="size-4 accent-berry" checked={selected[g.key].includes(o.value)} onChange={() => onToggle(g.key, o.value)} />
                      {o.label}
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          ))}
          <p className="text-[12px] text-ink-soft">Availability filter will appear once real stock data is connected. All listings are samples.</p>
        </div>
      </details>
    </aside>
  );
}
