"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Brand logo (peacock emblem + wordmark), from public/kanchiberry-logo.svg (1721×411).
 * As a link it always takes you home; on the homepage itself it scrolls back to the top.
 */
export function Wordmark({
  asLink = true,
  height = 36,
  className = "",
  onNavigate,
}: {
  asLink?: boolean;
  height?: number;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const mark = (
    <img
      src="/kanchiberry-logo.svg"
      alt="Kanchiberry"
      width={Math.round((height * 1721) / 411)}
      height={height}
      className={`logo-img block h-auto max-w-none ${className}`}
      style={{ height }}
    />
  );
  return asLink ? (
    <Link
      href="/"
      aria-label="Kanchiberry home"
      className="inline-flex min-h-11 shrink-0 items-center"
      onClick={(e) => {
        onNavigate?.();
        if (pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      {mark}
    </Link>
  ) : (
    mark
  );
}
