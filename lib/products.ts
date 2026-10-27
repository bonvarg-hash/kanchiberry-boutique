import { foldedUri, textileUri, type Textile } from "./textile";
import { generateCatalogue } from "./catalogue";

/**
 * Single source of truth for the catalog.
 *
 * DEVELOPMENT PLACEHOLDER DATA: names, prices, measurements and descriptions are
 * illustrative. Nothing here is real inventory, and `availability` is always
 * "sample" until a real catalog backs it.
 */

export type WeaveSlug =
  | "kanjivaram"
  | "banarasi"
  | "paithani"
  | "chanderi"
  | "patola"
  | "linen-cotton";

export type Availability = "sample";

export interface ProductImage {
  src: string;
  alt: string;
  label: string;
  /** Photo credit, e.g. "Kanchiberry" or "Photographer, licence, Wikimedia Commons". Absent = illustrative render. */
  credit?: string;
}

/**
 * Real photography, when available. Paths are relative to /public, e.g.
 * "/products/gulabi-kanjivaram/hanging.jpg". `hanging` should be the saree on its
 * hanger, shot straight on against a plain background (transparent PNG/WebP is
 * best); it is folded into pleats for the rack and shown flat when focused.
 */
export interface ProductPhotos {
  hanging?: string;
  gallery?: ProductImage[];
}

/**
 * Real fabric samples for the hanging view: a flat panel of the saree's body
 * (cut at the face's proportions, so it is never stretched or arbitrarily
 * cropped) and, where one could be photographed cleanly, a strip of its border.
 */
export interface FabricMap {
  body: string;
  border?: string;
}

/** A colourway. The first is the saree as photographed; the rest are placeholders without photos yet. */
export interface ColourVariant {
  name: string;
  /** Swatch colour, and an optional zari/border accent for the ring. */
  hex: string;
  accent?: string;
}

export interface Product {
  id: string;
  variants: ColourVariant[];
  /** Previous selling price, shown struck through. Must reflect a real earlier price. */
  compareAtPrice?: number;
  /** Units in stock. The "only N left" tag shows at 3 or fewer, so keep this live. */
  stock?: number;
  fabric?: FabricMap;
  photos?: ProductPhotos;
  slug: string;
  name: string;
  price: number;
  currency: "INR";
  weave: WeaveSlug;
  weaveName: string;
  color: string;
  colorFamily: string;
  occasion: string[];
  collection: string;
  featured: boolean;
  availability: Availability;
  tagline: string;
  description: string;
  craftDetails: string;
  length: string;
  blousePiece: string;
  careInstructions: string[];
  textile: Textile;
  images: ProductImage[];
  frontViewImage: string;
  hangingViewImage: string;
}

export type Seed = Omit<
  Product,
  "id" | "variants" | "currency" | "availability" | "images" | "frontViewImage" | "hangingViewImage" | "weaveName" | "careInstructions" | "length"
> & { length?: string };

const WEAVE_NAMES: Record<WeaveSlug, string> = {
  kanjivaram: "Kanjivaram Silk",
  banarasi: "Banarasi Silk",
  paithani: "Paithani",
  chanderi: "Chanderi",
  patola: "Patola",
  "linen-cotton": "Linen & Cotton",
};

const CARE: Record<Textile["finish"], string[]> = {
  silk: [
    "Dry clean only for the first several washes.",
    "Store folded in a breathable muslin cloth, away from direct sunlight.",
    "Refold along different lines every few months to protect the zari.",
    "Iron on low heat on the reverse, with a cloth in between.",
  ],
  sheer: [
    "Gentle dry clean recommended.",
    "Store flat or loosely folded in muslin; avoid plastic covers.",
    "Steam lightly rather than pressing directly.",
  ],
  matte: [
    "Hand wash separately in cold water with a mild detergent for the first wash.",
    "Dry in shade; avoid wringing.",
    "Iron on medium heat while slightly damp.",
  ],
};

const ph = (file: string, label: string, alt: string): ProductImage => ({ src: `/photos/${file}`, label, alt, credit: "Kanchiberry" });

/** Sample listings photographed with openly licensed Commons images (credited on the product page). */
const commons = (slug: string, full: string, credit: string, alt: string): ProductPhotos => ({
  hanging: `/rail/${slug}.jpg`,
  gallery: [
    { src: `/rail/${slug}.jpg`, label: "Fabric", alt, credit },
    { src: full, label: "Full photograph", alt, credit },
  ],
});

const seeds: Seed[] = [
  // Real Kanchiberry photography (brand shoots). Names, weave and prices are placeholders to confirm.
  {
    slug: "emerald-magenta-kanjivaram",
    name: "Emerald & Magenta Silk",
    price: 7499,
    weave: "kanjivaram",
    color: "Bottle Green & Magenta",
    colorFamily: "Green",
    occasion: ["Wedding", "Festive"],
    collection: "The Festive Edit",
    featured: true,
    tagline: "Bottle-green silk with gold buttas and a magenta, zari-striped pallu.",
    description:
      "A deep bottle-green body scattered with gold buttas, a broad gold zari border, and a magenta pallu banded in fine gold stripes. Name, weave and price to be confirmed.",
    craftDetails: "Contrast body and pallu with a wide zari border. Weave details to be confirmed by the brand.",
    blousePiece: "Blouse piece details to be confirmed.",
    textile: { base: "#1E3A2D", motif: "butta", motifColor: "#2F5442", zari: "#CFA54A", border: "#C59B3E", borderStyle: "zari", pallu: "#7E1F5E", palluMotif: "bands", finish: "silk" },
    photos: {
      hanging: "/rail/emerald-magenta-kanjivaram.jpg",
      gallery: [
        ph("kb-4.jpg", "Styled", "Model seated in a bottle-green silk saree with a magenta striped pallu and gold border"),
        ph("kb-6.jpg", "Front", "Model standing in the green and magenta saree, showing the gold border across the shoulder"),
        ph("kb-7.jpg", "Border", "Close view of the broad gold zari border on the shoulder"),
        ph("kb-8.jpg", "Back", "Back view showing the pallu draped over the shoulder"),
        ph("kb-9.jpg", "Pallu", "The magenta pallu with gold stripes falling to the floor"),
      ],
    },
  },
  {
    slug: "violet-rose-kanjivaram",
    name: "Violet & Rose Silk",
    price: 6999,
    weave: "kanjivaram",
    color: "Violet & Rose",
    colorFamily: "Purple",
    occasion: ["Festive", "Wedding"],
    collection: "Heirloom Silks",
    featured: true,
    tagline: "Violet silk with gold buttas and a rose-pink zari border.",
    description:
      "A rich violet body with small gold buttas, edged in a rose-pink border woven with gold zari bands. Name, weave and price to be confirmed.",
    craftDetails: "Contrast rose border with gold zari bands. Weave details to be confirmed by the brand.",
    blousePiece: "Blouse piece details to be confirmed.",
    textile: { base: "#3A2382", motif: "butta", motifColor: "#4E37A0", zari: "#D7AE52", border: "#D2387A", borderStyle: "zari", pallu: "#D2387A", palluMotif: "bands", finish: "silk" },
    photos: {
      hanging: "/rail/violet-rose-kanjivaram.jpg",
      gallery: [
        ph("kb-12.jpg", "Styled", "Model leaning on a ledge in a violet silk saree with a rose-pink border"),
        ph("kb-11.jpg", "Portrait", "Model holding a brass mirror, wearing the violet and rose saree"),
        ph("kb-16.jpg", "Border", "Close view of the rose-pink border with gold zari bands"),
        ph("kb-14.jpg", "Seated", "Model seated with the violet saree pleats spread out"),
        ph("kb-17.jpg", "Drape", "Standing view of the violet saree and pink pallu"),
      ],
    },
  },
  {
    slug: "black-gold-stripe-kanjivaram",
    name: "Black & Gold Stripe Silk",
    price: 6499,
    weave: "kanjivaram",
    color: "Black & Gold",
    colorFamily: "Black",
    occasion: ["Evening", "Festive"],
    collection: "Heirloom Silks",
    featured: true,
    tagline: "Near-black silk woven with bold gold zari stripes.",
    description:
      "A near-black silk woven through with gold zari stripes that catch the light as the drape moves. Name, weave and price to be confirmed.",
    craftDetails: "All-over zari stripes on a dark ground. Weave details to be confirmed by the brand.",
    blousePiece: "Blouse piece details to be confirmed.",
    textile: { base: "#1C1E1A", motif: "stripes", motifColor: "#B48F3E", zari: "#D4AF55", border: "#2E3A2C", borderStyle: "zari", pallu: "#2E3A2C", palluMotif: "bands", finish: "silk" },
    photos: {
      hanging: "/rail/black-gold-stripe-kanjivaram.jpg",
      gallery: [
        ph("kb-18.jpg", "Styled", "Model in a black silk saree with gold zari stripes"),
        ph("kb-22.jpg", "Front", "Standing view of the black and gold striped saree"),
        ph("kb-20.jpg", "Detail", "Model adjusting the pleats of the striped saree"),
        ph("kb-21.jpg", "Portrait", "Portrait in the black and gold saree"),
        ph("kb-19.jpg", "Seated", "Model seated with the striped saree spread across a bench"),
      ],
    },
  },
  {
    slug: "arakku-kanjivaram",
    name: "Arakku Kanjivaram",
    price: 5999,
    weave: "kanjivaram",
    color: "Maroon & Gold",
    colorFamily: "Red",
    occasion: ["Wedding", "Festive"],
    collection: "The Festive Edit",
    featured: true,
    tagline: "Deep maroon silk woven with gold zari paisleys.",
    description:
      "A deep maroon body woven through with gold zari paisleys and a temple-motif border, shown here taking shape on the loom.",
    craftDetails:
      "Kanjivaram sarees are traditionally woven with a contrast border that is interlocked with the body, a technique often called korvai. The temple (gopuram) border is among the most recognisable Kanjivaram motifs.",
    blousePiece: "Unstitched blouse piece in the border colour (illustrative).",
    textile: { base: "#6E1B25", motif: "paisley", motifColor: "#8C2A31", zari: "#D6AA4E", border: "#C79A3E", borderStyle: "temple", pallu: "#6E1B25", palluMotif: "temple", finish: "silk" },
    photos: commons("arakku-kanjivaram", "/craft/kanchipuram-loom.jpg", "Kamal Venkit, CC BY 2.0, Wikimedia Commons", "A maroon silk saree with gold zari paisleys on a Kanchipuram loom"),
  },
  {
    slug: "neelambari-kanjivaram",
    name: "Neelambari Kanjivaram",
    price: 7299,
    weave: "kanjivaram",
    color: "Violet Blue & Gold",
    colorFamily: "Blue",
    occasion: ["Wedding", "Festive"],
    collection: "Heirloom Silks",
    featured: true,
    tagline: "Violet-blue silk covered in gold zari florals.",
    description:
      "A violet-blue silk covered in gold zari florals, with a wide border of woven lotus medallions.",
    craftDetails:
      "Kattam (checks) are a traditional Kanjivaram body design. Zari lines between the checks catch light differently as the saree moves.",
    blousePiece: "Unstitched blouse piece in violet-blue (illustrative).",
    textile: { base: "#3B2F86", motif: "butta", motifColor: "#5A4AA8", zari: "#C9A45A", border: "#C9A45A", borderStyle: "zari", pallu: "#3B2F86", palluMotif: "mango", finish: "silk" },
    photos: commons("neelambari-kanjivaram", "/weaves/kanjivaram.jpg", "Ramkumar Kalyani, CC BY-SA 4.0, Wikimedia Commons", "Violet-blue Kanchipuram silk woven with gold zari florals and lotus medallions"),
  },
  {
    slug: "sindoori-banarasi",
    name: "Sindoori Banarasi",
    price: 5799,
    weave: "banarasi",
    color: "Crimson & Silver",
    colorFamily: "Red",
    occasion: ["Festive", "Ceremony"],
    collection: "The Festive Edit",
    featured: true,
    tagline: "Crimson silk with silver zari paisleys on the pallu.",
    description:
      "A crimson silk body dotted with small buttis, finished with a pallu of tall silver-zari paisleys and a richly worked border.",
    craftDetails:
      "Banarasi brocades are known for intricate zari patterning such as jaal (an all-over net), buttis and floral bels.",
    blousePiece: "Unstitched blouse piece in red (illustrative).",
    textile: { base: "#A3172A", motif: "butta", motifColor: "#C23A48", zari: "#D9D4CB", border: "#D9D4CB", borderStyle: "zari", pallu: "#A3172A", palluMotif: "mango", finish: "silk" },
    photos: commons("sindoori-banarasi", "/weaves/banarasi.jpg", "आशीष भटनागर, public domain, Wikimedia Commons", "Crimson Banarasi silk with a silver-zari paisley pallu"),
  },
  {
    slug: "raat-rani-banarasi",
    name: "Raat Rani Banarasi",
    price: 6799,
    weave: "banarasi",
    color: "Midnight Plum",
    colorFamily: "Purple",
    occasion: ["Evening", "Festive"],
    collection: "Heirloom Silks",
    featured: false, // off the rail until real photography is available
    tagline: "Midnight plum with muted gold paisleys.",
    description:
      "A near-black plum ground with softly outlined paisleys in antique gold. Understated by day, luminous under evening light.",
    craftDetails:
      "Paisley (kairi) motifs appear across many Indian textile traditions; in Banarasi weaving they are often outlined in zari.",
    blousePiece: "Unstitched blouse piece in plum (illustrative).",
    textile: { base: "#2C2437", motif: "paisley", motifColor: "#4C3F60", zari: "#C7A35A", border: "#3B1F2F", borderStyle: "zari", pallu: "#3B1F2F", palluMotif: "mango", finish: "silk" },
  },
  {
    slug: "mor-paithani",
    name: "Mor Paithani",
    price: 7799,
    weave: "paithani",
    color: "Parrot Green & Gold",
    colorFamily: "Green",
    occasion: ["Wedding", "Festive"],
    collection: "The Festive Edit",
    featured: true,
    tagline: "Parrot-green silk, a golden pallu of woven birds.",
    description:
      "Parrot-green silk with a golden-yellow pallu woven with rows of birds and flowers, finished with tassels.",
    craftDetails:
      "Paithani sarees are associated with Paithan and Yeola in Maharashtra. Peacock (mor) and lotus motifs on the pallu are characteristic of the style.",
    blousePiece: "Unstitched blouse piece in gold-yellow (illustrative).",
    textile: { base: "#8DB33A", motif: "butta", motifColor: "#A9C95A", zari: "#E3C548", border: "#E3C548", borderStyle: "peacock", pallu: "#E3C548", palluMotif: "peacock", finish: "silk" },
    photos: commons("mor-paithani", "/weaves/paithani.jpg", "Only Paithani, CC0, Wikimedia Commons", "A parrot-green Paithani saree with a golden pallu of woven birds"),
  },
  {
    slug: "neel-chanderi",
    name: "Neel Chanderi",
    price: 4499,
    weave: "chanderi",
    color: "Indigo & Grey",
    colorFamily: "Blue",
    occasion: ["Day", "Festive"],
    collection: "Everyday Weaves",
    featured: true,
    tagline: "Light indigo and grey with gold buttis.",
    description:
      "A light indigo and dove-grey drape scattered with gold buttis and edged in a copper-gold border. Made for long daytime celebrations.",
    craftDetails:
      "Chanderi, from Madhya Pradesh, is known for its sheer texture and light weight, often in silk-cotton blends with small woven buttis.",
    blousePiece: "Unstitched blouse piece in indigo (illustrative).",
    textile: { base: "#2E4E86", motif: "butta", motifColor: "#9AA6BA", zari: "#C5A256", border: "#9A6B3E", borderStyle: "thin", pallu: "#9AA6BA", palluMotif: "bands", finish: "sheer" },
    photos: commons("neel-chanderi", "/weaves/chanderi.jpg", "MANOJKUMARDILDAR, CC0, Wikimedia Commons", "An indigo and grey Chanderi saree with gold buttis and a copper border"),
  },
  {
    slug: "laal-patola",
    name: "Laal Patola",
    price: 7899,
    weave: "patola",
    color: "Vermilion",
    colorFamily: "Red",
    occasion: ["Wedding", "Ceremony"],
    collection: "Heirloom Silks",
    featured: true,
    tagline: "Vermilion double ikat in flowers and lattice.",
    description:
      "Vermilion silk patterned with a lattice of ikat flowers whose soft, feathered edges come from the resist-dyeing process.",
    craftDetails:
      "Patola from Patan, Gujarat, is a double ikat: both warp and weft threads are resist-dyed before weaving so the pattern emerges as they meet.",
    blousePiece: "Unstitched blouse piece in black (illustrative).",
    textile: { base: "#A2252D", motif: "ikat", motifColor: "#1F1A1A", zari: "#E6C04C", border: "#7A1C1F", borderStyle: "ikat", pallu: "#A2252D", palluMotif: "ikat", finish: "silk" },
    photos: commons("laal-patola", "/weaves/patola.jpg", "Los Angeles County Museum of Art, public domain, Wikimedia Commons", "A red double ikat Patola with flower and lattice motifs"),
  },
  {
    slug: "sabz-linen",
    name: "Sabz Linen",
    price: 3499,
    weave: "linen-cotton",
    color: "Sage",
    colorFamily: "Green",
    occasion: ["Everyday", "Work"],
    collection: "Everyday Weaves",
    featured: false, // off the rail until real photography is available
    tagline: "Sage linen with fine tonal stripes.",
    description:
      "A breathable sage linen with fine tonal stripes and a slim moss border. Soft, easy and quietly polished.",
    craftDetails:
      "Linen softens with every wash and stays cool in warm weather, which makes it a natural everyday drape.",
    blousePiece: "Unstitched blouse piece in moss (illustrative).",
    textile: { base: "#8D9B7B", motif: "stripes", motifColor: "#768466", zari: "#DCD1B4", border: "#5A684D", borderStyle: "thin", pallu: "#5A684D", palluMotif: "bands", finish: "matte" },
  },
  {
    slug: "mitti-cotton",
    name: "Mitti Cotton",
    price: 2799,
    weave: "linen-cotton",
    color: "Terracotta",
    colorFamily: "Orange",
    occasion: ["Everyday"],
    collection: "Everyday Weaves",
    featured: false, // off the rail until real photography is available
    tagline: "Terracotta cotton checks, an earth-brown border.",
    description:
      "Terracotta cotton in a gentle check, finished with a deep earth-brown border and a banded pallu.",
    craftDetails:
      "Handloom cotton is breathable and softens over time, which makes it well suited to daily wear.",
    blousePiece: "Unstitched blouse piece in brown (illustrative).",
    textile: { base: "#B2603E", motif: "checks", motifColor: "#9A4D30", zari: "#E4CCA2", border: "#3A2A21", borderStyle: "thin", pallu: "#3A2A21", palluMotif: "bands", finish: "matte" },
  },
];

/**
 * PLACEHOLDER pricing and stock for the prototype. Replace with real price
 * history and live inventory before launch: showing an earlier price that was
 * never charged, or scarcity that isn't real, misleads customers.
 */
const COMMERCE: Record<string, { compareAtPrice?: number; stock?: number }> = {
  "emerald-magenta-kanjivaram": { compareAtPrice: 7999, stock: 2 },
  "violet-rose-kanjivaram": { compareAtPrice: 7899, stock: 2 },
  "black-gold-stripe-kanjivaram": { compareAtPrice: 7299, stock: 3 },
  "arakku-kanjivaram": { compareAtPrice: 6999, stock: 4 },
  "neelambari-kanjivaram": { compareAtPrice: 7999, stock: 1 },
  "sindoori-banarasi": { compareAtPrice: 6699, stock: 3 },
  "mor-paithani": { compareAtPrice: 7999, stock: 2 },
  "neel-chanderi": { stock: 5 },
  "laal-patola": { compareAtPrice: 7999, stock: 1 },
};

/** PLACEHOLDER colourways, to be replaced with the brand's real ones. */
const VARIANTS: Record<string, ColourVariant[]> = {
  "emerald-magenta-kanjivaram": [{ name: "Bottle Green & Magenta", hex: "#1E3A2D", accent: "#7E1F5E" }, { name: "Peacock Blue & Gold", hex: "#14506B", accent: "#C9A04A" }, { name: "Wine & Gold", hex: "#5E1A2B", accent: "#C9A04A" }],
  "violet-rose-kanjivaram": [{ name: "Violet & Rose", hex: "#3A2382", accent: "#D2387A" }, { name: "Teal & Rose", hex: "#155E63", accent: "#D2387A" }, { name: "Mustard & Rose", hex: "#C58A1D", accent: "#D2387A" }, { name: "Black & Rose", hex: "#1C1A1E", accent: "#D2387A" }],
  "black-gold-stripe-kanjivaram": [{ name: "Black & Gold", hex: "#1C1E1A", accent: "#D4AF55" }, { name: "Maroon & Gold", hex: "#5A1A22", accent: "#D4AF55" }, { name: "Navy & Gold", hex: "#1B2547", accent: "#D4AF55" }],
  "arakku-kanjivaram": [{ name: "Maroon & Gold", hex: "#6E1B25", accent: "#D6AA4E" }, { name: "Bottle Green & Gold", hex: "#1E3A2D", accent: "#D6AA4E" }, { name: "Navy & Gold", hex: "#1B2547", accent: "#D6AA4E" }],
  "neelambari-kanjivaram": [{ name: "Violet Blue & Gold", hex: "#3B2F86", accent: "#C9A45A" }, { name: "Rani Pink & Gold", hex: "#B3245F", accent: "#C9A45A" }, { name: "Emerald & Gold", hex: "#1C6858", accent: "#C9A45A" }],
  "sindoori-banarasi": [{ name: "Crimson & Silver", hex: "#A3172A", accent: "#D9D4CB" }, { name: "Ivory & Silver", hex: "#E9E2D2", accent: "#B9B4AB" }, { name: "Midnight & Silver", hex: "#1F2235", accent: "#D9D4CB" }],
  "raat-rani-banarasi": [{ name: "Midnight Plum", hex: "#2C2437", accent: "#C7A35A" }, { name: "Bottle Green", hex: "#1E3A2D", accent: "#C7A35A" }],
  "mor-paithani": [{ name: "Parrot Green & Gold", hex: "#8DB33A", accent: "#E3C548" }, { name: "Rani Pink & Gold", hex: "#B3245F", accent: "#E3C548" }, { name: "Peacock Blue & Gold", hex: "#14506B", accent: "#E3C548" }],
  "neel-chanderi": [{ name: "Indigo & Grey", hex: "#2E4E86", accent: "#9AA6BA" }, { name: "Mint & Gold", hex: "#9CCBB4", accent: "#C5A256" }, { name: "Blush & Gold", hex: "#E8B9B5", accent: "#C5A256" }],
  "laal-patola": [{ name: "Vermilion", hex: "#A2252D", accent: "#E6C04C" }, { name: "Indigo", hex: "#2E3A6E", accent: "#E6C04C" }, { name: "Emerald", hex: "#1E6B4E", accent: "#E6C04C" }, { name: "Saffron", hex: "#D9822B", accent: "#7A1C1F" }],
  "sabz-linen": [{ name: "Sage", hex: "#8D9B7B", accent: "#5A684D" }, { name: "Ecru", hex: "#E3D9C3", accent: "#8C7867" }, { name: "Dusty Rose", hex: "#C99A97", accent: "#7A4F4C" }],
  "mitti-cotton": [{ name: "Terracotta", hex: "#B2603E", accent: "#3A2A21" }, { name: "Indigo", hex: "#2E3A6E", accent: "#E4CCA2" }, { name: "Mustard", hex: "#C58A1D", accent: "#3A2A21" }],
};

const FABRIC: Record<string, FabricMap> = {
  "arakku-kanjivaram": { body: "/fabric/arakku-kanjivaram-body.jpg", border: "/fabric/arakku-kanjivaram-border.jpg" },
  "black-gold-stripe-kanjivaram": { body: "/fabric/black-gold-stripe-kanjivaram-body.jpg" },
  "emerald-magenta-kanjivaram": { body: "/fabric/emerald-magenta-kanjivaram-body.jpg" },
  "laal-patola": { body: "/fabric/laal-patola-body.jpg", border: "/fabric/laal-patola-border.jpg" },
  "mor-paithani": { body: "/fabric/mor-paithani-body.jpg" },
  "neel-chanderi": { body: "/fabric/neel-chanderi-body.jpg" },
  "neelambari-kanjivaram": { body: "/fabric/neelambari-kanjivaram-body.jpg", border: "/fabric/neelambari-kanjivaram-border.jpg" },
  "sindoori-banarasi": { body: "/fabric/sindoori-banarasi-body.jpg", border: "/fabric/sindoori-banarasi-border.jpg" },
  "violet-rose-kanjivaram": { body: "/fabric/violet-rose-kanjivaram-body.jpg" },
};

// The hand-written sarees first (real photography leads the shop), then the
// generated sample catalogue that brings the shop to 300.
const generated = generateCatalogue(new Set(seeds.map((s) => s.slug)));
for (const g of generated) COMMERCE[g.slug] = { compareAtPrice: g.compareAtPrice, stock: g.stock };

export const products: Product[] = [...seeds, ...generated].map((s, i) => {
  const base = {
    ...s,
    id: `kb-${String(i + 1).padStart(3, "0")}`,
    fabric: FABRIC[s.slug],
    variants: VARIANTS[s.slug] ?? [{ name: s.color, hex: s.textile.base, accent: s.textile.zari }],
    ...COMMERCE[s.slug],
    currency: "INR" as const,
    availability: "sample" as const,
    weaveName: WEAVE_NAMES[s.weave],
    length: s.length ?? "5.5 m saree + 0.8 m blouse piece (illustrative)",
    careInstructions: CARE[s.textile.finish],
  };
  // Sarees without photography are drawn from their textile description. The
  // drawings are only made when a saree is first shown, so 300 of them don't
  // all have to be rendered up front.
  let drawn: Pick<Product, "images" | "frontViewImage" | "hangingViewImage"> | undefined;
  const draw = () =>
    (drawn ??= (() => {
      const onHanger = s.photos?.hanging ?? foldedUri(s.textile);
      return {
        // The rack folds this same image into pleats, so resting and focused views always match.
        frontViewImage: onHanger,
        hangingViewImage: onHanger,
        images: s.photos?.gallery ?? [
          { src: onHanger, label: "On the hanger", alt: `${s.name}: illustrative render of the saree folded over a wooden saree hanger` },
          { src: textileUri(s.textile, "full"), label: "Full length", alt: `${s.name}: full-length illustrative render of the ${s.color.toLowerCase()} saree` },
          { src: textileUri(s.textile, "texture"), label: "Fabric", alt: `${s.name}: close-up render of the body motif and weave texture` },
          { src: textileUri(s.textile, "border"), label: "Border & pallu", alt: `${s.name}: render of the border meeting the pallu` },
        ],
      };
    })());
  return Object.defineProperties(base, {
    images: { get: () => draw().images, enumerable: true },
    frontViewImage: { get: () => draw().frontViewImage, enumerable: true },
    hangingViewImage: { get: () => draw().hangingViewImage, enumerable: true },
  }) as Product;
});

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const featuredProducts = () => products.filter((p) => p.featured);

export function relatedProducts(p: Product, n = 3): Product[] {
  return products
    .filter((o) => o.slug !== p.slug)
    .map((o) => ({
      o,
      score:
        (o.weave === p.weave ? 3 : 0) +
        (o.collection === p.collection ? 2 : 0) +
        (o.colorFamily === p.colorFamily ? 1 : 0) +
        o.occasion.filter((x) => p.occasion.includes(x)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.o);
}

export function searchProducts(q: string): Product[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return products.filter((p) => {
    const hay = [p.name, p.weaveName, p.color, p.colorFamily, p.collection, ...p.occasion, p.tagline]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0, useGrouping: false }).format(n);
