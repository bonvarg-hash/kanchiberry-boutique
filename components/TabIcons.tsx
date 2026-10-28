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

export const TabBag = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M8 8V6.5a4 4 0 0 1 8 0V8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path fill="currentColor" d="M5.6 8h12.8c.9 0 1.6.7 1.7 1.6l.8 9.2A2.2 2.2 0 0 1 18.7 21H5.3a2.2 2.2 0 0 1-2.2-2.2l.8-9.2C4 8.7 4.7 8 5.6 8Z" />
  </svg>
);
