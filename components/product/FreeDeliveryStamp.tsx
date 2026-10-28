import { useId } from "react";

/**
 * A round rubber-stamp mark for free delivery: double ring, wording set around
 * the edge and "Free" in the middle, slightly tilted with a rough inked edge.
 * Decorative; the note beside it says the same in words.
 */
export function FreeDeliveryStamp({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <path id={`ring-${id}`} d="M50 50 m-33 0 a33 33 0 1 1 66 0 a33 33 0 1 1 -66 0" />
        {/* Roughens the edges so it reads as ink pressed onto paper. */}
        <filter id={`ink-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
      </defs>
      <g fill="none" stroke="currentColor" filter={`url(#ink-${id})`}>
        <circle cx="50" cy="50" r="46" strokeWidth="2.6" />
        <circle cx="50" cy="50" r="40.5" strokeWidth="1" />
        <circle cx="50" cy="50" r="24" strokeWidth="1" />
        <text fill="currentColor" stroke="none" fontSize="9.2" fontWeight="600" letterSpacing="1.6">
          <textPath href={`#ring-${id}`} textLength="205" lengthAdjust="spacingAndGlyphs">
            FREE DELIVERY ✦ ACROSS INDIA ✦
          </textPath>
        </text>
        <text x="50" y="54" textAnchor="middle" fill="currentColor" stroke="none" fontSize="14" fontStyle="italic" style={{ fontFamily: "var(--font-title)" }}>
          Free
        </text>
      </g>
    </svg>
  );
}
