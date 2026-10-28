import { CursorCta } from "./CursorCta";
import { CollectionsFab } from "./CollectionsFab";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="wrap relative pb-16 pt-12 text-center max-md:pb-12 max-md:pt-10 sm:pt-20 lg:pb-24 lg:pt-24">
      <p className="eyebrow hero-fade mb-8 max-sm:mb-5 sm:mb-12">A modern ode to Indian textiles</p>
      <h1 id="hero-title" className="font-banner text-[clamp(3.4rem,11.2vw,11.5rem)] font-light leading-[0.88] tracking-[-0.025em]">
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
      <CollectionsFab />
    </section>
  );
}
