"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { getProduct } from "@/lib/products";
import { ProductDetails } from "./ProductDetails";

/**
 * Product details as a layer that slides up over the current page, so opening a
 * saree from the rail never leaves it. The address bar shows the saree's real
 * URL (shareable, and reloading it opens the full page); Back, Escape, the close
 * button or dragging the top bar down returns to the rail where it was.
 */

const OpenContext = createContext<(href: string) => boolean>(() => false);

/** Opens a product link in the sheet. Returns false when the link isn't a saree, so the caller can navigate normally. */
export const useOpenProduct = () => useContext(OpenContext);

const slugOf = (href: string) => {
  try {
    return new URL(href, window.location.href).pathname.match(/\/sarees\/([^/]+)\/?$/)?.[1] ?? null;
  } catch {
    return null;
  }
};

type Phase = "entering" | "open" | "closing";

export function ProductSheetProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("entering");
  const [drag, setDrag] = useState(0);
  const slugRef = useRef<string | null>(null);
  slugRef.current = slug;
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const dragStart = useRef<{ y: number; at: number } | null>(null);

  const open = useCallback((href: string) => {
    const s = slugOf(href);
    if (!s || !getProduct(s)) return false;
    returnFocus.current = document.activeElement as HTMLElement | null;
    setSlug(s);
    setPhase("entering");
    setDrag(0);
    window.history.pushState({ kbSheet: s }, "", href);
    return true;
  }, []);

  const close = useCallback(() => {
    if (!slugRef.current) return;
    // Step back out of the sheet's history entry; popstate then plays the exit.
    if (window.history.state?.kbSheet) window.history.back();
    else setPhase("closing");
  }, []);

  // Every saree link on the site opens here, so details always slide up the same way
  // as from the curated rail. Caught early (window, capture phase) before the link's own
  // navigation. Links inside the sheet are left to it; new-tab clicks and links marked
  // data-full-page navigate normally. An open dialog (search, menu) is closed first.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.closest("[data-sheet-root], [data-full-page]")) return;
      const s = slugOf(a.href);
      if (!s || !getProduct(s)) return;
      e.preventDefault();
      e.stopPropagation();
      a.closest("dialog")?.close();
      open(a.href);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [open]);

  // Back and Forward open and close the sheet.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state?.kbSheet as string | undefined;
      if (s && getProduct(s)) {
        setSlug(s);
        setPhase("entering");
      } else if (slugRef.current) {
        setPhase("closing");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // While open: the page behind keeps its scroll position but can't scroll or take focus.
  const isOpen = slug !== null;
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const gutter = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, pad: document.body.style.paddingRight };
    html.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    const behind = [...document.body.children].filter((el) => !el.hasAttribute("data-sheet-root")) as HTMLElement[];
    behind.forEach((el) => (el.inert = true));
    panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.pad;
      behind.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  // Every saree starts at the top of its details.
  useEffect(() => {
    if (panel.current) panel.current.scrollTop = 0;
  }, [slug]);

  const onAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget) return;
    if (phase === "entering") setPhase("open");
    if (phase === "closing") {
      setSlug(null);
      setDrag(0);
      returnFocus.current?.focus({ preventScroll: true });
    }
  };

  // Links inside the sheet: another saree swaps in place; anything else closes the sheet and navigates.
  const onClickCapture = (e: React.MouseEvent) => {
    const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === "_blank") return;
    const s = slugOf(a.href);
    if (s && getProduct(s)) {
      e.preventDefault();
      if (s === slug) return;
      setSlug(s);
      window.history.replaceState({ ...window.history.state, kbSheet: s }, "", a.href);
    } else {
      setSlug(null);
    }
  };

  // Drag the top bar down to dismiss (touch and mouse).
  const onDragStart = (e: React.PointerEvent) => {
    if (phase !== "open" || (e.target as Element).closest("button, a")) return;
    dragStart.current = { y: e.clientY, at: Date.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (dragStart.current) setDrag(Math.max(0, e.clientY - dragStart.current.y));
  };
  const onDragEnd = () => {
    const start = dragStart.current;
    if (!start) return;
    dragStart.current = null;
    const fast = drag / Math.max(1, Date.now() - start.at) > 0.6;
    if (drag > 140 || (fast && drag > 40)) close();
    else setDrag(0);
  };

  const p = slug ? getProduct(slug) : undefined;

  return (
    <OpenContext.Provider value={open}>
      {children}
      {p &&
        createPortal(
          <div data-sheet-root className={`pdp-sheet-root is-${phase}`}>
            <div className="pdp-sheet-backdrop" aria-hidden onClick={close} />
            <div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={`${p.name}, product details`}
              tabIndex={-1}
              className={`pdp-sheet${dragStart.current ? " is-dragging" : ""}`}
              style={drag ? { transform: `translateY(${drag}px)` } : undefined}
              onAnimationEnd={onAnimationEnd}
              onClickCapture={onClickCapture}
            >
              <div
                className="pdp-sheet-bar"
                onPointerDown={onDragStart}
                onPointerMove={onDragMove}
                onPointerUp={onDragEnd}
                onPointerCancel={onDragEnd}
              >
                <span className="pdp-sheet-handle" aria-hidden />
                <nav aria-label="Breadcrumb" className="min-w-0 text-[14px] text-ink-soft">
                  <ol className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                    <li className="shrink-0">
                      <Link href="/shop" className="hover:text-ink">
                        Shop
                      </Link>{" "}
                      /
                    </li>
                    <li className="shrink-0">
                      <Link href={`/shop?weave=${p.weave}`} className="hover:text-ink">
                        {p.weaveName}
                      </Link>{" "}
                      /
                    </li>
                    <li aria-current="page" className="min-w-0 truncate text-ink">
                      {p.name}
                    </li>
                  </ol>
                </nav>
                <button type="button" onClick={close} className="pdp-sheet-close" aria-label="Close and return to the rail">
                  <span className="hidden sm:inline">Close</span>
                  <X size={20} strokeWidth={1.5} aria-hidden />
                </button>
              </div>
              <div key={p.slug} className="pdp-sheet-body">
                <ProductDetails product={p} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </OpenContext.Provider>
  );
}
