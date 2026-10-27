export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="wrap relative pb-16 pt-12 sm:pt-20 lg:pb-24 lg:pt-24">
      <p className="eyebrow hero-fade mb-8 sm:mb-12">A modern ode to Indian textiles</p>
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

      <div className="hero-fade mt-10 flex flex-col gap-7 sm:mt-14 sm:flex-row sm:items-end sm:gap-16">
        <p className="max-w-[34ch] text-[16px] leading-relaxed text-ink-soft">
          An ode to timeless weaves, extraordinary craftsmanship, and the art of draping.
        </p>
        <a href="#curated" className="text-link cta-pulse shrink-0 self-start sm:self-auto">
          Discover the Collection <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
