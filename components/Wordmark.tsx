import Link from "next/link";

/** Brand logo (peacock emblem + wordmark), from public/kanchiberry-logo.svg (1721×411). */
export function Wordmark({ asLink = true, height = 36, className = "" }: { asLink?: boolean; height?: number; className?: string }) {
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
    <Link href="/" aria-label="Kanchiberry home" className="shrink-0">
      {mark}
    </Link>
  ) : (
    mark
  );
}
