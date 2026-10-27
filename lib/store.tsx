"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "./products";

/**
 * Guest bag and wishlist, persisted in localStorage. There is no account
 * system yet; when one exists, sync these to the user's profile instead.
 */

export interface BagLine {
  slug: string;
  /** Chosen colourway, when the saree offers more than one. */
  variant?: string;
  qty: number;
}

interface StoreValue {
  ready: boolean;
  bag: (BagLine & { key: string; product: Product })[];
  bagCount: number;
  subtotal: number;
  wishlist: string[];
  addToBag: (slug: string, qty?: number, variant?: string) => void;
  /** `key` identifies a bag line (saree + colourway). */
  setQty: (key: string, qty: number) => void;
  removeFromBag: (key: string) => void;
  clearBag: () => void;
  isWished: (slug: string) => boolean;
  toggleWish: (slug: string) => void;
  lastAdded: { slug: string; at: number } | null;
}

const StoreContext = createContext<StoreValue | null>(null);
const BAG_KEY = "kb.bag.v1";
const WISH_KEY = "kb.wishlist.v1";
export const MAX_QTY = 5;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode); state still works for this visit */
  }
}

const lineKey = (l: { slug: string; variant?: string }) => `${l.slug}|${l.variant ?? ""}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<StoreValue["lastAdded"]>(null);

  useEffect(() => {
    const storedBag = read<BagLine[]>(BAG_KEY, []).filter((l) => getProduct(l.slug) && l.qty > 0);
    const storedWish = read<string[]>(WISH_KEY, []).filter((s) => getProduct(s));
    setLines(storedBag);
    setWishlist(storedWish);
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === BAG_KEY) setLines(read(BAG_KEY, []));
      if (e.key === WISH_KEY) setWishlist(read(WISH_KEY, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (ready) write(BAG_KEY, lines);
  }, [lines, ready]);
  useEffect(() => {
    if (ready) write(WISH_KEY, wishlist);
  }, [wishlist, ready]);

  const addToBag = useCallback((slug: string, qty = 1, variant?: string) => {
    const k = lineKey({ slug, variant });
    setLines((prev) => {
      const found = prev.find((l) => lineKey(l) === k);
      if (found) return prev.map((l) => (lineKey(l) === k ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      return [...prev, { slug, variant, qty: Math.min(MAX_QTY, qty) }];
    });
    setLastAdded({ slug, at: Date.now() });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => lineKey(l) !== key) : prev.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const removeFromBag = useCallback((key: string) => setLines((prev) => prev.filter((l) => lineKey(l) !== key)), []);
  const clearBag = useCallback(() => setLines([]), []);
  const toggleWish = useCallback(
    (slug: string) => setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
    [],
  );

  const value = useMemo<StoreValue>(() => {
    const bag = lines.flatMap((l) => {
      const product = getProduct(l.slug);
      return product ? [{ ...l, key: lineKey(l), product }] : [];
    });
    return {
      ready,
      bag,
      bagCount: bag.reduce((n, l) => n + l.qty, 0),
      subtotal: bag.reduce((n, l) => n + l.qty * l.product.price, 0),
      wishlist,
      addToBag,
      setQty,
      removeFromBag,
      clearBag,
      isWished: (slug) => wishlist.includes(slug),
      toggleWish,
      lastAdded,
    };
  }, [lines, wishlist, ready, addToBag, setQty, removeFromBag, clearBag, toggleWish, lastAdded]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
