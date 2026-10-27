import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { CuratedSareeGallery } from "@/components/gallery/CuratedSareeGallery";
import { MobileSareeCarousel } from "@/components/gallery/MobileSareeCarousel";
import { RailEyebrow } from "@/components/gallery/RailEyebrow";
import { CustomerTestimonials } from "@/components/home/CustomerTestimonials";
import { CraftsmanshipSection } from "@/components/home/CraftsmanshipSection";
import { ShoppingBenefits } from "@/components/home/ShoppingBenefits";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { SignatureSpotlight } from "@/components/home/SignatureSpotlight";
import { CraftStats } from "@/components/home/CraftStats";
import { ShopTheCollection } from "@/components/home/ShopTheCollection";
import { DrapeYourDay } from "@/components/home/DrapeYourDay";
import { WeaveMarquee } from "@/components/home/WeaveMarquee";
import { featuredProducts, products } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WeaveMarquee />
      <section id="curated" aria-labelledby="curated-title" className="scroll-mt-16 bg-mist pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-20 lg:pt-20">
        <div className="wrap mb-6 grid gap-5 md:grid-cols-2 md:items-end">
          <div>
            <RailEyebrow initial={featuredProducts().length} />
            <h2 id="curated-title" className="section-title">
              Curated Picks
              <br />
              of the Week
            </h2>
            <p className="lede mt-3 md:hidden">Discover the weave. Find your drape.</p>
          </div>
          <div className="flex flex-col items-start gap-5 md:items-end md:justify-self-end md:text-right">
            <Link href="/shop" className="text-link">
              Shop the Collection <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        {/* Hover rail from tablet up; swipe-and-tap carousel on phones */}
        <div className="hidden md:block">
          <CuratedSareeGallery products={featuredProducts()} />
        </div>
        <div className="md:hidden">
          <MobileSareeCarousel products={featuredProducts()} />
        </div>
      </section>
      <SignatureSpotlight />
      <ShopTheCollection products={products.filter((p) => p.images[0]?.credit === "Kanchiberry")} />
      <CraftStats />
      <DrapeYourDay />
      <CustomerTestimonials />
      <CraftsmanshipSection />
      <ShoppingBenefits />
      <NewsletterSignup />
    </>
  );
}
