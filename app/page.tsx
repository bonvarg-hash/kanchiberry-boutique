import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { CuratedSareeGallery } from "@/components/gallery/CuratedSareeGallery";
import { MobileSareeCarousel } from "@/components/gallery/MobileSareeCarousel";
import { RailEyebrow } from "@/components/gallery/RailEyebrow";
import { CustomerTestimonials } from "@/components/home/CustomerTestimonials";
import { CraftsmanshipSection } from "@/components/home/CraftsmanshipSection";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { SignatureSpotlight } from "@/components/home/SignatureSpotlight";
import { CraftStats } from "@/components/home/CraftStats";
import { ShopTheCollection } from "@/components/home/ShopTheCollection";
import { WeaveMarquee } from "@/components/home/WeaveMarquee";
import { FestiveCountdown } from "@/components/home/FestiveCountdown";
import { ViewTransition } from "react";
import { featuredProducts, products } from "@/lib/products";

export default function HomePage() {
  return (
    // Stays put underneath while the shop page rises over it (see app/shop/page.tsx).
    <ViewTransition exit={{ "page-rise": "page-under", default: "none" }} enter="none" default="none">
      <div>
        <HeroSection />
        <WeaveMarquee />
        <section id="curated" aria-labelledby="curated-title" className="scroll-mt-16 bg-mist pb-16 pt-16 md:pb-16 md:pt-16 lg:pb-20 lg:pt-20">
          <div className="wrap mb-6 flex flex-col items-center gap-5 text-center">
            <div>
              <RailEyebrow initial={featuredProducts().length} />
              <h2 id="curated-title" className="section-title text-[#87264D]">
                <em className="shimmer text-[#4E3F47]">Curated Picks</em>
                <br />
                of the Week
              </h2>
              <p className="lede mx-auto mt-3 md:hidden">Discover the weave. Find your drape.</p>
            </div>
            <Link href="/shop" className="text-link">
              Shop the Collection <span aria-hidden>→</span>
            </Link>
          </div>
          {/* Hover rail from tablet up; swipe-and-tap carousel on phones */}
          <div className="hidden md:block">
            <CuratedSareeGallery products={featuredProducts()} />
          </div>
          <div className="md:hidden">
            <MobileSareeCarousel products={featuredProducts()} />
          </div>
        </section>
        <ShopTheCollection products={products.filter((p) => p.images[0]?.credit === "Kanchiberry")} />
        <FestiveCountdown />
        <SignatureSpotlight />
        <CustomerTestimonials />
        <CraftStats />
        <CraftsmanshipSection />
        <NewsletterSignup />
      </div>
    </ViewTransition>
  );
}
