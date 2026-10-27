import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Google_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductSheetProvider } from "@/components/product/ProductSheet";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-google-sans",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Kanchiberry — The finest fruit of Indian weave", template: "%s · Kanchiberry" },
  description:
    "Kanchiberry is a contemporary saree boutique celebrating Kanjivaram, Banarasi, Paithani, Chanderi, Patola and handloom weaves.",
  openGraph: {
    siteName: "Kanchiberry",
    type: "website",
    title: "Kanchiberry — The finest fruit of Indian weave",
    description: "An ode to timeless weaves, extraordinary craftsmanship, and the art of draping.",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#EEE9E0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${googleSans.variable} ${playfair.variable}`}>
      <body>
        <StoreProvider>
          <a href="#main" className="sr-only-focusable fixed left-4 top-3 z-[70] bg-ink px-4 py-2 text-sm text-paper">
            Skip to content
          </a>
          <ProductSheetProvider>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
          </ProductSheetProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
