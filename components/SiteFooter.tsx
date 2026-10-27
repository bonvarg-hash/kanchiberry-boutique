import Link from "next/link";
import { Plus } from "lucide-react";
import { Wordmark } from "./Wordmark";

type FooterLink = { label: string; href?: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Shop All Sarees", href: "/shop" },
      { label: "New Arrivals" },
      { label: "Curated Picks", href: "/#curated" },
      { label: "Explore by Weave", href: "/collections" },
    ],
  },
  {
    title: "About",
    links: [{ label: "Our Story", href: "/our-story" }, { label: "The Art of Weaving", href: "/art-of-weaving" }, { label: "Contact Us" }],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Shipping Information" },
      { label: "Returns & Exchanges" },
      { label: "Saree Care Guide", href: "/care-guide" },
      { label: "FAQs" },
    ],
  },
  { title: "Legal", links: [{ label: "Privacy Policy" }, { label: "Terms & Conditions" }] },
];

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <ul className="space-y-1 text-[15px] md:space-y-3 md:text-[14px]">
      {links.map((l) => (
        <li key={l.label}>
          {l.href ? (
            <Link href={l.href} className="inline-flex min-h-11 items-center underline-offset-4 transition-colors hover:text-berry hover:underline md:min-h-0">
              {l.label}
            </Link>
          ) : (
            <span className="inline-flex min-h-11 items-center text-ink-soft/80 md:min-h-0">
              {l.label} <span className="ml-2 text-[10px] uppercase tracking-[0.14em]">Pending</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  return (
    <footer className="theme-dark bg-ivory">
      <div className="wrap grid gap-10 py-14 md:gap-14 md:py-20 lg:grid-cols-[1.3fr_3fr]">
        <div>
          <Wordmark height={52} className="h-[44px]! w-auto md:h-[52px]!" />
          <p className="serif mt-4 text-xl italic text-ink-soft">The finest fruit of Indian weave.</p>
          <p className="mt-8 text-xs text-ink-soft">Social profiles: to be added when the brand’s accounts are confirmed.</p>
        </div>
        <div className="hidden grid-cols-4 gap-10 md:grid">
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="eyebrow mb-5">{c.title}</h2>
              <FooterLinks links={c.links} />
            </nav>
          ))}
        </div>
        {/* Phones: one accordion per group */}
        <div className="border-t border-sand md:hidden">
          {COLUMNS.map((c) => (
            <details key={c.title} className="acc border-b border-sand">
              <summary className="flex min-h-14 items-center justify-between text-[13px] uppercase tracking-[0.18em]">
                {c.title}
                <Plus size={16} strokeWidth={1.4} className="acc-icon" aria-hidden />
              </summary>
              <nav aria-label={c.title} className="pb-5">
                <FooterLinks links={c.links} />
              </nav>
            </details>
          ))}
        </div>
      </div>
      <div className="wrap flex flex-col gap-2 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-xs text-ink-soft sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Kanchiberry · Design prototype</p>
        <p>Products, prices and reviews are illustrative placeholders.</p>
      </div>
    </footer>
  );
}
