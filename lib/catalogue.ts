import type { Seed, WeaveSlug } from "./products";
import type { BorderStyle, Motif, PalluMotif, Textile } from "./textile";

/**
 * GENERATED SAMPLE CATALOGUE: 288 extra sarees so the shop, filters and search
 * can be tried at a realistic size (300 in all with the hand-written ones).
 * Names, prices, stock and descriptions are illustrative; each saree is drawn
 * from its textile description, so no two look alike. Replace with the real
 * catalogue before launch.
 *
 * Built from a fixed seed, so the same sarees (and URLs) come out every build.
 */

/** Small deterministic random number generator (mulberry32). */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Colour = { word: string; name: string; hex: string; family: string };

/** Colour words used in the names, with the English colour shoppers filter by. */
const COLOURS: Colour[] = [
  { word: "Arakku", name: "Maroon", hex: "#6E1B25", family: "Red" },
  { word: "Sindoor", name: "Vermilion", hex: "#A3172A", family: "Red" },
  { word: "Lal", name: "Crimson", hex: "#9B1C2C", family: "Red" },
  { word: "Rani", name: "Rani Pink", hex: "#B3245F", family: "Pink" },
  { word: "Gulabi", name: "Rose Pink", hex: "#D06A8C", family: "Pink" },
  { word: "Kesari", name: "Saffron", hex: "#D9822B", family: "Orange" },
  { word: "Kumkum", name: "Burnt Orange", hex: "#B9542A", family: "Orange" },
  { word: "Manjal", name: "Turmeric Yellow", hex: "#D7A21E", family: "Yellow" },
  { word: "Haldi", name: "Mustard", hex: "#C58A1D", family: "Yellow" },
  { word: "Pachai", name: "Bottle Green", hex: "#1E3A2D", family: "Green" },
  { word: "Mehendi", name: "Mehendi Green", hex: "#6B7A2E", family: "Green" },
  { word: "Tota", name: "Parrot Green", hex: "#7FA436", family: "Green" },
  { word: "Firozi", name: "Turquoise", hex: "#1F8A8A", family: "Blue" },
  { word: "Neelam", name: "Sapphire Blue", hex: "#1E3F86", family: "Blue" },
  { word: "Mayil", name: "Peacock Blue", hex: "#14506B", family: "Blue" },
  { word: "Jamuni", name: "Purple", hex: "#4B2464", family: "Purple" },
  { word: "Baingani", name: "Aubergine", hex: "#3A1F3D", family: "Purple" },
  { word: "Kaala", name: "Black", hex: "#1C1A1E", family: "Black" },
  { word: "Moti", name: "Ivory", hex: "#E9E2D2", family: "Ivory" },
  { word: "Chandan", name: "Sandalwood", hex: "#C9A67E", family: "Ivory" },
];

/** Motif words used in the names, mapped to how the fabric is drawn. */
const MOTIFS: { word: string; motif: Motif; label: string }[] = [
  { word: "Butta", motif: "butta", label: "gold buttas" },
  { word: "Jaal", motif: "jaal", label: "an all-over jaal" },
  { word: "Mangai", motif: "paisley", label: "mango paisleys" },
  { word: "Kattam", motif: "checks", label: "fine checks" },
  { word: "Rekha", motif: "stripes", label: "zari stripes" },
  { word: "Mallige", motif: "butta", label: "jasmine buttas" },
  { word: "Kolam", motif: "jaal", label: "a kolam-inspired jaal" },
  { word: "Annam", motif: "paisley", label: "swan-and-paisley motifs" },
];

type WeavePlan = {
  weave: WeaveSlug;
  count: number;
  word: string;
  price: [number, number];
  finish: Textile["finish"];
  borders: BorderStyle[];
  pallus: PalluMotif[];
  motifs?: Motif[];
  occasions: string[][];
  collections: string[];
  craft: string;
};

const PLANS: WeavePlan[] = [
  {
    weave: "kanjivaram",
    count: 80,
    word: "Kanjivaram",
    price: [8999, 34999],
    finish: "silk",
    borders: ["temple", "zari", "peacock"],
    pallus: ["temple", "peacock", "mango", "bands"],
    occasions: [["Wedding", "Festive"], ["Wedding", "Ceremony"], ["Festive", "Evening"]],
    collections: ["Heirloom Silks", "The Festive Edit", "Bridal Trousseau"],
    craft: "Pure mulberry silk with a contrast border interlocked with the body (korvai), finished in gold zari.",
  },
  {
    weave: "banarasi",
    count: 60,
    word: "Banarasi",
    price: [6999, 27999],
    finish: "silk",
    borders: ["zari", "thin"],
    pallus: ["mango", "bands", "temple"],
    motifs: ["butta", "jaal", "paisley", "stripes"],
    occasions: [["Wedding", "Festive"], ["Festive", "Evening"], ["Ceremony", "Festive"]],
    collections: ["Heirloom Silks", "The Festive Edit", "Bridal Trousseau"],
    craft: "Brocade woven in Varanasi, with zari motifs lifted from the ground on the loom.",
  },
  {
    weave: "paithani",
    count: 35,
    word: "Paithani",
    price: [9999, 29999],
    finish: "silk",
    borders: ["peacock", "zari"],
    pallus: ["peacock", "bands"],
    occasions: [["Wedding", "Festive"], ["Festive", "Ceremony"]],
    collections: ["Heirloom Silks", "The Festive Edit"],
    craft: "Tapestry-woven pallu with peacock and lotus motifs, a signature of Paithan in Maharashtra.",
  },
  {
    weave: "chanderi",
    count: 40,
    word: "Chanderi",
    price: [3499, 9999],
    finish: "sheer",
    borders: ["thin", "zari"],
    pallus: ["bands", "mango"],
    motifs: ["butta", "stripes", "checks"],
    occasions: [["Day", "Festive"], ["Work", "Day"], ["Evening", "Day"]],
    collections: ["Everyday Weaves", "Summer Sheers"],
    craft: "A light silk-cotton weave from Madhya Pradesh, with small woven buttas and a sheer, airy hand.",
  },
  {
    weave: "patola",
    count: 28,
    word: "Patola",
    price: [12999, 39999],
    finish: "silk",
    borders: ["ikat"],
    pallus: ["ikat"],
    motifs: ["ikat"],
    occasions: [["Wedding", "Ceremony"], ["Festive", "Ceremony"]],
    collections: ["Heirloom Silks", "Bridal Trousseau"],
    craft: "Double ikat from Patan: warp and weft are both resist-dyed before weaving, so the pattern meets on the loom.",
  },
  {
    weave: "linen-cotton",
    count: 45,
    word: "Linen",
    price: [1799, 5499],
    finish: "matte",
    borders: ["thin"],
    pallus: ["bands", "ikat"],
    motifs: ["stripes", "checks", "butta"],
    occasions: [["Everyday", "Work"], ["Day", "Everyday"], ["Work", "Day"]],
    collections: ["Everyday Weaves", "Summer Sheers"],
    craft: "Handloom linen and cotton, soft to the touch and easy to drape for long days.",
  },
];

const GOLD = ["#D6AA4E", "#CFA54A", "#E0B85C", "#C9A04A"];
const SILVER = ["#D9D4CB", "#C7C2BA"];

/** Lighten or darken a hex colour by `amt` (-1..1). */
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
  const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** Shop-style prices that end in 499 or 999. */
const round99 = (n: number) => Math.max(999, Math.round(n / 500) * 500 - 1);

export type GeneratedSeed = Seed & { compareAtPrice?: number; stock: number };

export function generateCatalogue(taken: Set<string>): GeneratedSeed[] {
  const rand = rng(20261027);
  const pick = <T,>(xs: T[]) => xs[Math.floor(rand() * xs.length)];
  const out: GeneratedSeed[] = [];

  for (const plan of PLANS) {
    let made = 0;
    let guard = 0;
    while (made < plan.count && guard++ < 5000) {
      const c = pick(COLOURS);
      const m = pick(plan.motifs ? MOTIFS.filter((x) => plan.motifs!.includes(x.motif)) : MOTIFS);
      const ikat = plan.weave === "patola";
      const name = ikat ? `${c.word} ${pick(["Chhabadi", "Nari Kunj", "Paan", "Navratna", "Rattan Chowk", "Vohra Gaji"])} Patola` : `${c.word} ${m.word} ${plan.word}`;
      const slug = slugify(name);
      if (taken.has(slug)) continue;
      taken.add(slug);

      const contrast = pick(COLOURS.filter((x) => x.family !== c.family));
      const zari = plan.weave === "linen-cotton" ? shade(c.hex, c.family === "Ivory" ? -0.45 : 0.45) : pick(rand() < 0.2 ? SILVER : GOLD);
      const borderIsContrast = rand() < 0.55;
      const motif: Motif = ikat ? "ikat" : m.motif;
      const textile: Textile = {
        base: c.hex,
        motif,
        motifColor: shade(c.hex, c.family === "Ivory" ? -0.12 : 0.14),
        zari,
        border: borderIsContrast ? contrast.hex : zari,
        borderStyle: pick(plan.borders),
        pallu: borderIsContrast ? contrast.hex : shade(c.hex, -0.2),
        palluMotif: pick(plan.pallus),
        finish: plan.finish,
      };

      const [lo, hi] = plan.price;
      const price = round99(lo + (hi - lo) * rand() ** 1.4);
      const onSale = rand() < 0.4;
      const colour = borderIsContrast ? `${c.name} & ${contrast.name}` : `${c.name} & ${SILVER.includes(zari) ? "Silver" : "Gold"}`;
      const motifLabel = ikat ? "a double-ikat grid" : m.label;
      out.push({
        slug,
        name,
        price,
        compareAtPrice: onSale ? round99(price * (1.1 + rand() * 0.15)) : undefined,
        stock: 1 + Math.floor(rand() * 8),
        weave: plan.weave,
        color: plan.weave === "linen-cotton" ? c.name : colour,
        colorFamily: c.family,
        occasion: pick(plan.occasions),
        collection: pick(plan.collections),
        featured: false,
        tagline: `${c.name} ${plan.weave === "linen-cotton" ? "handloom" : plan.finish === "sheer" ? "Chanderi" : "silk"} with ${motifLabel}${borderIsContrast ? ` and a ${contrast.name.toLowerCase()} border` : ""}.`,
        description: `A ${c.name.toLowerCase()} ${plan.word} saree woven with ${motifLabel}${borderIsContrast ? `, edged in ${contrast.name.toLowerCase()}` : ""}. Sample listing: name, price and details are illustrative.`,
        craftDetails: plan.craft,
        blousePiece: "Unstitched blouse piece in a matching or contrast shade (illustrative).",
        textile,
      });
      made++;
    }
  }
  return out;
}
