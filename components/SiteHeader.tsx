"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, MapPin, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { TabBag, TabGrid, TabHeart, TabHome, TabSearch } from "./TabIcons";
import { useStore } from "@/lib/store";
import { SearchDialog } from "./SearchDialog";
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
// The first five match the phone tab bar, named as their pages are titled.
const DRAWER = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "All Collections" },
  { href: "/search", label: "Search" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/bag", label: "Shopping Bag" },
  { href: "/collections", label: "Edits & Weaves" },
  { href: "/#curated", label: "Curated Picks" },
  { href: "/collections#by-weave", label: "Explore by Weave" },
  { href: "/our-story", label: "Our Story" },
  { href: "/art-of-weaving", label: "The Art of Weaving" },
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

  // Phone tab bar: which tab is highlighted. A tap highlights it straight away
  // (pendingTab) rather than waiting for the next page. Search opens its own page here.
  const [pendingTab, setPendingTab] = useState<number | null>(null);
  useEffect(() => setPendingTab(null), [pathname]);
  const routeTab =
    pathname === "/" ? 0 : isCurrent("/shop") || isCurrent("/sarees") ? 1 : isCurrent("/search") ? 2 : isCurrent("/wishlist") ? 3 : isCurrent("/bag") ? 4 : -1;
  const tabIndex = searchOpen ? 2 : (pendingTab ?? routeTab);

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
            <Wordmark height={36} className="h-[30px]! w-auto sm:h-[32px]! lg:h-[36px]!" />
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
            {/* On phones, search, wishlist and bag move to the bottom tab bar, within thumb reach. */}
            <button type="button" className="icon-btn hidden md:inline-grid" aria-label="Search sarees" onClick={() => setSearchOpen(true)}>
              <Search size={19} strokeWidth={1.5} />
            </button>
            <Link href="/wishlist" className="icon-btn hidden md:inline-grid" aria-label={`Wishlist, ${wishlist.length} saved`}>
              <Heart size={19} strokeWidth={1.5} />
              {ready && wishlist.length > 0 && <span className="bag-count bg-ink!">{wishlist.length}</span>}
            </Link>
            <Link href="/bag" className="icon-btn -mr-2 hidden md:inline-grid lg:mr-0" aria-label={`Shopping bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`}>
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
            <button type="button" className="icon-btn -mr-2" aria-label="Close menu" autoFocus onClick={() => menuRef.current?.close()}>
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label="Mobile" className="-mx-6 mt-4 flex-1 overflow-y-auto overscroll-contain px-6">
            <ul>
              {DRAWER.map((n) => (
                <li key={n.href} className="border-b border-sand">
                  <Link
                    href={n.href}
                    onClick={() => menuRef.current?.close()}
                    className="flex min-h-13 items-center font-sans text-[17px] leading-tight aria-[current=page]:font-medium aria-[current=page]:text-[#87264D]"
                    aria-current={n.href === "/" ? (pathname === "/" ? "page" : undefined) : isCurrent(n.href)}
                  >
                    {n.label}
                    {n.href === "/bag" && ready && bagCount > 0 && <span className="ml-1.5 text-ink-soft">({bagCount})</span>}
                  </Link>
                </li>
              ))}
              <li className="flex min-h-13 items-center gap-2 border-b border-sand font-sans text-[17px] text-ink-soft/70">
                New Arrivals
                <span className="text-[10px] uppercase tracking-[0.14em]">Pending</span>
              </li>
            </ul>

            {/* Account. Sign-in and saved delivery addresses need accounts and a shipping
                service, which the prototype doesn't have yet. */}
            <section aria-labelledby="drawer-account" className="mt-6">
              <h2 id="drawer-account" className="sr-only">
                Account
              </h2>
              <ul className="font-sans text-[16px]">
                <li className="flex min-h-12 items-center gap-3 text-ink-soft/80" aria-disabled="true">
                  <MapPin size={19} strokeWidth={1.5} aria-hidden /> Delivery address
                  <span className="ml-auto text-[10px] uppercase tracking-[0.14em]">Coming soon</span>
                </li>
                <li className="flex min-h-12 items-center gap-3 text-ink-soft/80" aria-disabled="true">
                  <UserRound size={19} strokeWidth={1.5} aria-hidden /> Sign in
                  <span className="ml-auto text-[10px] uppercase tracking-[0.14em]">Coming soon</span>
                </li>
              </ul>
            </section>
          </nav>
        </div>
      </dialog>

      {/* Phones: a black bar of tabs; the current one is light, with its label (styles: .tab-bar). */}
      <nav aria-label="Shortcuts" className="tab-bar md:hidden">
        <Link href="/" className="tab-bar-item" data-active={tabIndex === 0 || undefined} aria-current={pathname === "/" ? "page" : undefined} onClick={() => setPendingTab(0)}>
          <span className="tab-bar-icon">
            <TabHome />
          </span>
          <span className="tab-bar-label">Home</span>
        </Link>
        <Link href="/shop" className="tab-bar-item" data-active={tabIndex === 1 || undefined} aria-current={isCurrent("/shop") ?? isCurrent("/sarees")} onClick={() => setPendingTab(1)}>
          <span className="tab-bar-icon">
            <TabGrid />
          </span>
          <span className="tab-bar-label">Shop</span>
        </Link>
        <Link href="/search" className="tab-bar-item" data-active={tabIndex === 2 || undefined} aria-current={isCurrent("/search")} onClick={() => setPendingTab(2)}>
          <span className="tab-bar-icon">
            <TabSearch />
          </span>
          <span className="tab-bar-label">Search</span>
        </Link>
        <Link href="/wishlist" className="tab-bar-item" data-active={tabIndex === 3 || undefined} aria-current={isCurrent("/wishlist")} aria-label={`Wishlist, ${wishlist.length} saved`} onClick={() => setPendingTab(3)}>
          <span className="tab-bar-icon">
            <TabHeart />
            {ready && wishlist.length > 0 && <span className="tab-bar-count">{wishlist.length}</span>}
          </span>
          <span className="tab-bar-label" aria-hidden>
            Wishlist
          </span>
        </Link>
        <Link href="/bag" className="tab-bar-item" data-active={tabIndex === 4 || undefined} aria-current={isCurrent("/bag")} aria-label={`Bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`} onClick={() => setPendingTab(4)}>
          <span className="tab-bar-icon">
            <TabBag />
            {ready && bagCount > 0 && (
              <span className="tab-bar-count" data-bump={bump}>
                {bagCount}
              </span>
            )}
          </span>
          <span className="tab-bar-label" aria-hidden>
            Bag
          </span>
        </Link>
      </nav>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
