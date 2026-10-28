"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { formatPrice, searchProducts } from "@/lib/products";
import { SUGGESTIONS } from "@/components/SearchDialog";
import { PageHeader } from "@/components/PageHeader";

/**
 * Search as a page of its own, opened from the phone tab bar: the same title as
 * Wishlist and Shopping Bag, a search bar ready to type in, suggestions as tags
 * below, and matching sarees as you type.
 */
export default function SearchPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const term = q.trim();
  const all = useMemo(() => (term ? searchProducts(term) : []), [term]);
  const results = all.slice(0, 8);

  return (
    <div className="wrap min-h-[75vh] pb-24 pt-14 max-md:pb-16 max-md:pt-8 lg:pt-20">
      <title>Search · Kanchiberry</title>
      <PageHeader title="Search" description="Find a saree by weave, colour or occasion." />

      <form
        role="search"
        className="search-field mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (term) router.push(`/shop?q=${encodeURIComponent(term)}`);
        }}
      >
        <Search size={20} strokeWidth={1.6} aria-hidden className="shrink-0 text-ink-soft" />
        <label htmlFor="page-search" className="sr-only">
          Search by saree name, weave, colour, collection or occasion
        </label>
        <input
          id="page-search"
          type="search"
          enterKeyHint="search"
          autoFocus
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Weaves, colours, occasions…"
          className="min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-ink-soft/70 [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <button type="button" className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft" aria-label="Clear search" onClick={() => setQ("")}>
            <X size={18} strokeWidth={1.6} />
          </button>
        )}
      </form>

      <div className="mt-6" aria-live="polite">
        {!term && (
          <>
            <p className="eyebrow">Suggested</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="search-tag" onClick={() => setQ(s)}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
        {term && results.length === 0 && (
          <p className="text-[15px] text-ink-soft">
            Nothing matches “{term}”. Try a weave such as{" "}
            <button type="button" className="underline" onClick={() => setQ("Kanjivaram")}>
              Kanjivaram
            </button>{" "}
            or a colour such as{" "}
            <button type="button" className="underline" onClick={() => setQ("Blue")}>
              blue
            </button>
            .
          </p>
        )}
        {results.length > 0 && (
          <>
            <ul className="divide-y divide-sand border-y border-sand">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link href={`/sarees/${p.slug}`} className="flex items-center gap-4 py-3">
                    <img src={p.images[0].src} alt="" width={56} height={70} className="h-[70px] w-14 shrink-0 bg-sand-soft object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate text-[16px] leading-tight">{p.name}</span>
                      <span className="mt-1 block text-[13px] text-ink-soft">
                        {p.weaveName} · {formatPrice(p.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/shop?q=${encodeURIComponent(term)}`} className="text-link mt-6 text-[16px]">
              See all {all.length} {all.length === 1 ? "result" : "results"} <span aria-hidden>→</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
