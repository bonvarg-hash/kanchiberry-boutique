"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { formatPrice, searchProducts } from "@/lib/products";

export const SUGGESTIONS = ["Kanjivaram", "Banarasi", "Wedding", "Green", "Linen", "Festive Edit"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [q, setQ] = useState("");
  const results = useMemo(() => searchProducts(q).slice(0, 6), [q]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const go = (term: string) => {
    onClose();
    router.push(`/shop?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <dialog
      ref={ref}
      aria-label="Search"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="sheet m-0 mx-auto mt-0 w-full max-w-none bg-ivory p-0 text-ink backdrop:bg-ink/30"
    >
      <div className="wrap py-6 sm:py-10">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) go(q);
          }}
          className="flex items-center gap-4 border-b border-ink pb-3"
        >
          <Search size={22} strokeWidth={1.4} aria-hidden />
          <label htmlFor="site-search" className="sr-only">
            Search by saree name, weave, colour, collection or occasion
          </label>
          <input
            id="site-search"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search weaves, colours, occasions…"
            className="serif min-w-0 flex-1 bg-transparent text-3xl outline-none placeholder:text-ink-soft/60 sm:text-4xl"
            autoComplete="off"
          />
          <button type="button" className="icon-btn" aria-label="Close search" onClick={onClose}>
            <X size={21} strokeWidth={1.5} />
          </button>
        </form>

        <div className="mt-6 min-h-24" aria-live="polite">
          {!q.trim() && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-2">Try</span>
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setQ(s)} className="border border-sand px-3 py-1.5 text-sm hover:border-ink">
                  {s}
                </button>
              ))}
            </div>
          )}
          {q.trim() && results.length === 0 && (
            <p className="text-ink-soft">
              Nothing matches “{q}”. Try a weave such as <button className="underline" onClick={() => setQ("Kanjivaram")}>Kanjivaram</button> or a
              colour such as <button className="underline" onClick={() => setQ("Blue")}>blue</button>.
            </p>
          )}
          {results.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link href={`/sarees/${p.slug}`} onClick={onClose} className="flex items-center gap-4 p-2 hover:bg-paper">
                    <img src={p.images[0].src} alt="" width={56} height={56} className="size-14 object-cover" />
                    <span>
                      <span className="serif block text-xl leading-tight">{p.name}</span>
                      <span className="text-xs text-ink-soft">
                        {p.weaveName} · {formatPrice(p.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  );
}
