/**
 * Solid glyphs for the phone tab bar, drawn to read clearly as filled shapes (the
 * line icons used elsewhere turn into blobs when filled). 24px grid, currentColor.
 */
type P = { className?: string };

export const TabHome = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      fillRule="evenodd"
      fill="currentColor"
      d="M10.6 2.9a2.2 2.2 0 0 1 2.8 0l7 5.9c.5.4.8 1 .8 1.7v8.3A2.2 2.2 0 0 1 19 21h-3.6a.9.9 0 0 1-.9-.9v-4.4a1.3 1.3 0 0 0-1.3-1.3h-2.4a1.3 1.3 0 0 0-1.3 1.3v4.4a.9.9 0 0 1-.9.9H5a2.2 2.2 0 0 1-2.2-2.2v-8.3c0-.7.3-1.3.8-1.7l7-5.9Z"
    />
  </svg>
);

export const TabGrid = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <rect x="3" y="3" width="8" height="8" rx="2.2" />
    <rect x="13" y="3" width="8" height="8" rx="2.2" />
    <rect x="3" y="13" width="8" height="8" rx="2.2" />
    <rect x="13" y="13" width="8" height="8" rx="2.2" />
  </svg>
);

export const TabSearch = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export const TabHeart = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M12 20.6c-.3 0-.6-.1-.8-.3C6.4 16.4 2.5 13 2.5 8.9 2.5 6 4.7 3.8 7.5 3.8c1.8 0 3.4.9 4.5 2.4 1.1-1.5 2.7-2.4 4.5-2.4 2.8 0 5 2.2 5 5.1 0 4.1-3.9 7.5-8.7 11.4-.2.2-.5.3-.8.3Z" />
  </svg>
);

/**
 * The bag. With `shine` (something is in the bag) a soft light sweeps across it:
 * first after 5s, then every ~6s. Otherwise it is a plain filled glyph.
 */
export const TabBag = ({ className, shine = false }: P & { shine?: boolean }) => {
  const paint = shine ? "url(#tab-bag-shine)" : "currentColor";
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {shine && (
        <defs>
          {/* At rest the light band sits off to the left, so the icon shows its plain colour. */}
          <linearGradient id="tab-bag-shine" gradientUnits="userSpaceOnUse" x1="-8" y1="0" x2="8" y2="4" gradientTransform="translate(-20 0)">
            <stop offset="0" stopColor="currentColor" />
            <stop offset="0.38" stopColor="currentColor" />
            <stop offset="0.5" stopColor="#f1dcb0" />
            <stop offset="0.62" stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" />
            <animateTransform
              id="tab-bag-sweep"
              attributeName="gradientTransform"
              type="translate"
              values="-10 0; 34 0"
              dur="1.2s"
              begin="5s; tab-bag-sweep.end+5s"
              fill="remove"
            />
          </linearGradient>
        </defs>
      )}
      <path d="M8 8V6.5a4 4 0 0 1 8 0V8" fill="none" stroke={paint} strokeWidth="2.2" strokeLinecap="round" />
      <path fill={paint} d="M5.6 8h12.8c.9 0 1.6.7 1.7 1.6l.8 9.2A2.2 2.2 0 0 1 18.7 21H5.3a2.2 2.2 0 0 1-2.2-2.2l.8-9.2C4 8.7 4.7 8 5.6 8Z" />
    </svg>
  );
};

export const TabGift = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M12 7.2c-.9-2.6-2.4-4.2-4.2-4.2C6.1 3 5 4.1 5 5.4 5 6.6 6 7.6 7.4 7.8H4.6C3.7 7.8 3 8.5 3 9.4v1.8c0 .6.4 1 1 1h7.1V7.8h1.8v4.4H20c.6 0 1-.4 1-1V9.4c0-.9-.7-1.6-1.6-1.6h-2.8C18 7.6 19 6.6 19 5.4 19 4.1 17.9 3 16.2 3c-1.8 0-3.3 1.6-4.2 4.2Zm-3.9-1.8c0-.4.3-.7.7-.7.8 0 1.6.8 2.1 2.2-1.6-.1-2.8-.8-2.8-1.5Zm7.8 0c0 .7-1.2 1.4-2.8 1.5.5-1.4 1.3-2.2 2.1-2.2.4 0 .7.3.7.7Z" />
    <path d="M4.5 13.6h6.6V21H6.3c-1 0-1.8-.8-1.8-1.8v-5.6Zm8.4 0h6.6v5.6c0 1-.8 1.8-1.8 1.8h-4.8v-7.4Z" />
  </svg>
);
