import { CursorCta } from "./CursorCta";
import { CollectionsFab } from "./CollectionsFab";
import { HeroPhoto } from "./HeroPhoto";

/**
 * Homepage hero over a full-width photo: two sarees under a dark arch. Layered
 * plum overlays keep the light headline readable, with a soft vignette behind it
 * and a deeper fade at the top and bottom edges.
 */
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="hero-photo relative isolate overflow-hidden text-center">
      <HeroPhoto src="/photos/hero-arch.jpg" />
      <div className="hero-photo-overlay absolute inset-0 -z-10" aria-hidden />
      <div className="wrap relative flex min-h-[clamp(520px,82vh,860px)] flex-col items-center justify-center pb-16 pt-12 max-md:min-h-[78svh] max-md:py-12 sm:pt-20 lg:pb-24 lg:pt-24">
        <p className="eyebrow hero-fade mb-8 text-[#F3F4EF]/85! max-sm:mb-5 sm:mb-12">A Bold Legacy Begins Here</p>
        <h1 id="hero-title" className="font-banner text-[clamp(3.4rem,11.2vw,11.5rem)] font-light leading-[0.88] tracking-[-0.025em] text-[#F3F4EF] [text-shadow:0_2px_24px_rgb(25_14_20_/_0.35)]">
          <span className="hero-line" style={{ "--d": 0 } as React.CSSProperties}>
            <span>The finest fruit</span>
          </span>
          <span className="hero-line" style={{ "--d": 1 } as React.CSSProperties}>
            <span>
              <em className="font-light">of</em> Indian weave.
            </span>
          </span>
        </h1>

        {/* Tablet and desktop: the pill. Phones: a floating button listing the collections. */}
        <div className="hero-fade mt-10 flex justify-center max-md:hidden sm:mt-14">
          <CursorCta href="/shop">Discover the Collection</CursorCta>
        </div>
      </div>
      <CollectionsFab />
    </section>
  );
}
