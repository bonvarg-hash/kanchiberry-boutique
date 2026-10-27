"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { SearchDialog } from "./SearchDialog";
import { MusicToggle } from "./MusicToggle";
import { Wordmark } from "./Wordmark";
import { OfferBar } from "./OfferBar";
import { MEGA_PANELS } from "./MegaMenu";

export const NAV = [
  { href: "/shop", label: "Shop Sarees" },
  { href: "/collections", label: "Collections" },
  { href: "/our-story", label: "Our Story" },
  { href: "/art-of-weaving", label: "The Art of Weaving" },
];

/** Mobile drawer: a flat list, no nested menus. */
const DRAWER = [
  { href: "/shop", label: "Shop Sarees" },
  { href: "/#curated", label: "Curated Picks" },
  { href: "/collections", label: "Explore by Weave" },
  { href: "/our-story", label: "Our Story" },
  { href: "/art-of-weaving", label: "The Art of Weaving" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/care-guide", label: "Customer Care" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { bagCount, wishlist, lastAdded, ready } = useStore();
  const [solid, setSolid] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  // Desktop dropdown: which nav item's panel is open, with a short delay so it doesn't flicker
  const [mega, setMega] = useState<string | null>(null);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openMega = (href: string, delay = 120) => {
    clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMega(href), delay);
  };
  const closeMega = (delay = 160) => {
    clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMega(null), delay);
  };
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lastAdded) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 500);
    return () => clearTimeout(t);
  }, [lastAdded]);

  // Close the menus on navigation.
  useEffect(() => {
    menuRef.current?.close();
    setMega(null);
  }, [pathname]);

  const isCurrent = (href: string) => (pathname === href || pathname.startsWith(href + "/") ? "page" : undefined);

  return (
    <>
      <OfferBar />
      <header className="site-header" data-solid={solid || pathname !== "/" || mega !== null} onMouseLeave={() => closeMega()}>
        <div className="wrap grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-2 sm:h-16 lg:flex lg:h-[76px] lg:gap-10">
          {/* left: menu on mobile/tablet */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="icon-btn -ml-2"
              aria-label="Open menu"
              aria-haspopup="dialog"
              onClick={() => menuRef.current?.showModal()}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
          <span className="justify-self-center lg:justify-self-auto">
            <Wordmark height={36} className="h-[28px]! w-auto sm:h-[32px]! lg:h-[36px]!" />
          </span>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV.map((n) => (
                <li key={n.href} onMouseEnter={() => openMega(n.href)}>
                  <Link
                    href={n.href}
                    className="nav-link flex h-[76px] items-center text-[15px]"
                    aria-current={isCurrent(n.href)}
                    aria-expanded={mega === n.href}
                    aria-controls="mega-panel"
                    onFocus={() => openMega(n.href, 0)}
                    onClick={() => setMega(null)}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-end gap-0 sm:gap-1 lg:ml-auto">
            <MusicToggle />
            <button type="button" className="icon-btn" aria-label="Search sarees" onClick={() => setSearchOpen(true)}>
              <Search size={19} strokeWidth={1.5} />
            </button>
            <Link href="/wishlist" className="icon-btn hidden sm:inline-grid" aria-label={`Wishlist, ${wishlist.length} saved`}>
              <Heart size={19} strokeWidth={1.5} />
              {ready && wishlist.length > 0 && <span className="bag-count bg-ink!">{wishlist.length}</span>}
            </Link>
            <Link href="/bag" className="icon-btn -mr-2 lg:mr-0" aria-label={`Shopping bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`}>
              <ShoppingBag size={19} strokeWidth={1.5} />
              {ready && bagCount > 0 && (
                <span className="bag-count" data-bump={bump} aria-hidden>
                  {bagCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* End-to-end dropdown (desktop) */}
        <div
          id="mega-panel"
          className="mega absolute inset-x-0 top-full hidden border-t border-sand bg-paper shadow-[0_24px_40px_-24px_rgba(36,23,15,0.35)] lg:block"
          data-open={mega !== null || undefined}
          onMouseEnter={() => mega && openMega(mega, 0)}
          onFocus={() => mega && openMega(mega, 0)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node) && !(e.relatedTarget as Element | null)?.closest?.("nav[aria-label=Primary]")) closeMega(0);
          }}
          onClick={(e) => (e.target as Element).closest("a") && setMega(null)}
        >
          <div className="wrap py-10" key={mega ?? "none"}>
            {mega && MEGA_PANELS[mega] && (() => {
              const Panel = MEGA_PANELS[mega];
              return <Panel />;
            })()}
          </div>
        </div>
      </header>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        className="drawer m-0 h-dvh max-h-none w-[min(88vw,380px)] max-w-none bg-ivory p-0 text-ink backdrop:bg-ink/35"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <div className="flex h-full flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
          <div className="flex h-14 items-center justify-between">
            <Wordmark height={28} />
            <button type="button" className="icon-btn -mr-2" aria-label="Close menu" onClick={() => menuRef.current?.close()}>
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6 overflow-y-auto">
            <ul>
              {DRAWER.map((n) => (
                <li key={n.href} className="border-b border-sand">
                  <Link
                    href={n.href}
                    onClick={() => menuRef.current?.close()}
                    className="serif flex min-h-14 items-center text-[28px] leading-tight aria-[current=page]:italic"
                    aria-current={isCurrent(n.href)}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="flex min-h-14 items-center gap-2 border-b border-sand text-[28px] text-ink-soft/70">
                <span className="serif">New Arrivals</span>
                <span className="text-[10px] uppercase tracking-[0.14em]">Pending</span>
              </li>
            </ul>
          </nav>
          <div className="mt-auto pt-6 text-sm text-ink-soft">
            <Link href="/bag" onClick={() => menuRef.current?.close()} className="flex min-h-11 items-center gap-3 text-ink">
              <ShoppingBag size={17} strokeWidth={1.5} /> Shopping bag {ready && bagCount > 0 && `(${bagCount})`}
            </Link>
            <p className="mt-2">Account sign-in is not yet available in this prototype.</p>
          </div>
        </div>
      </dialog>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
