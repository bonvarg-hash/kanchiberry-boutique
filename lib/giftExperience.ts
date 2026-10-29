import { products, type Product } from "./products";
import { LOOKS, OCCASIONS, lookImage, plainDescription, type Look, type Occasion } from "./gifting";

/**
 * The immersive gift studio's discovery journey: four playful questions that map
 * onto the real catalogue. Nothing here invents products; it only scores and
 * filters `products`.
 */

export type Personality = "elegant" | "celebration" | "timeless" | "bold";
export type Smile = "sparkle" | "timeless" | "colours" | "unexpected";
export type GiftOccasion = Extract<Occasion, "birthday" | "anniversary" | "wedding" | "festival" | "just-because">;

export interface Journey {
  personality: Personality | null;
  smile: Smile | null;
  occasion: GiftOccasion | null;
  budget: string | null;
}
export const EMPTY_JOURNEY: Journey = { personality: null, smile: null, occasion: null, budget: null };

const LOOK_FOR: Record<Personality, Look> = { elegant: "graceful", celebration: "bright", timeless: "classic", bold: "bold" };

export const PERSONALITIES: { id: Personality; label: string; line: string; image: Product["images"][number] }[] = [
  { id: "elegant", label: "Effortlessly Elegant", line: "Poised, refined, never overdone", image: lookImage("graceful") },
  { id: "celebration", label: "The Life of Every Celebration", line: "Warm, lively, first on the dance floor", image: lookImage("bright") },
  { id: "timeless", label: "Timeless & Classic", line: "Loves tradition and things that last", image: lookImage("classic") },
  { id: "bold", label: "Bold & Beautiful", line: "Confident and never afraid to stand out", image: lookImage("bold") },
];

export const SMILES: { id: Smile; label: string; line: string; art: string; weaves: string[]; families: string[] }[] = [
  { id: "sparkle", label: "A Little Sparkle", line: "Gold that catches the light", art: "radial-gradient(circle at 30% 30%,#f7e3a8,#c99a45 45%,#7a5622)", weaves: ["banarasi", "kanjivaram"], families: ["Yellow", "Orange"] },
  { id: "timeless", label: "Something Timeless", line: "An heirloom she’ll keep forever", art: "linear-gradient(135deg,#5b1626,#87264d 50%,#3a0e18)", weaves: ["kanjivaram", "paithani"], families: ["Red", "Purple"] },
  { id: "colours", label: "Beautiful Colours", line: "Rich, joyful, full of life", art: "conic-gradient(from 20deg,#c13a72,#d7a21e,#1f5a3a,#1e3f86,#4b2464,#c13a72)", weaves: ["paithani", "patola"], families: ["Pink", "Green", "Orange", "Yellow", "Blue"] },
  { id: "unexpected", label: "Something Unexpected", line: "A little different, wonderfully her", art: "linear-gradient(160deg,#1c1a1e,#2e3b5c 55%,#9bb0c9)", weaves: ["patola", "chanderi", "linen-cotton"], families: ["Black", "Blue", "Ivory"] },
];

export const GIFT_OCCASIONS = OCCASIONS.filter((o): o is (typeof OCCASIONS)[number] & { id: GiftOccasion } =>
  ["birthday", "anniversary", "wedding", "festival", "just-because"].includes(o.id),
);

const available = () => products.filter((p) => p.stock !== 0);

const roundTo = (n: number) => (n >= 10000 ? Math.round(n / 5000) * 5000 : Math.round(n / 1000) * 1000);
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Four budget tiers cut from the catalogue's real prices, so each holds a fair share of sarees. */
export const BUDGET_TIERS: { id: string; label: string; min: number; max: number; count: number; level: number }[] = (() => {
  const prices = available()
    .map((p) => p.price)
    .sort((a, b) => a - b);
  const at = (q: number) => roundTo(prices[Math.floor(q * (prices.length - 1))]);
  const cuts = [...new Set([at(0.25), at(0.5), at(0.75)])].filter((c) => c > prices[0]);
  const edges = [0, ...cuts, Infinity];
  return edges.slice(0, -1).map((min, i) => {
    const max = edges[i + 1];
    const label = i === 0 ? `Under ${inr(max)}` : max === Infinity ? `${inr(min)} & above` : `${inr(min)} – ${inr(max)}`;
    return { id: `b${i}`, label, min, max, count: prices.filter((p) => p >= min && p < max).length, level: i + 1 };
  });
})();

export interface GiftPick {
  product: Product;
  why: string;
}

function score(p: Product, j: Journey) {
  let s = 0;
  const occ = OCCASIONS.find((o) => o.id === j.occasion);
  if (occ && p.occasion.some((o) => occ.fits.includes(o))) s += 3;
  const look = LOOKS.find((l) => l.id === (j.personality ? LOOK_FOR[j.personality] : null));
  if (look) {
    if (look.weaves.includes(p.weave)) s += 3;
    if (look.collections.includes(p.collection)) s += 1.5;
    if (look.colours.includes(p.colorFamily)) s += 1;
  }
  const smile = SMILES.find((x) => x.id === j.smile);
  if (smile) {
    if (smile.weaves.includes(p.weave)) s += 2;
    if (smile.families.includes(p.colorFamily)) s += 1.5;
    if (smile.id === "sparkle" && /gold|zari/i.test(`${p.color} ${p.name}`)) s += 1;
    if (smile.id === "timeless" && p.collection === "Heirloom Silks") s += 1;
  }
  if (p.images[0]?.credit === "Kanchiberry") s += 0.75;
  return s;
}

function whyFor(p: Product, j: Journey) {
  const parts: string[] = [];
  const pers = PERSONALITIES.find((x) => x.id === j.personality);
  const look = j.personality ? LOOKS.find((l) => l.id === LOOK_FOR[j.personality!]) : null;
  if (pers && look?.weaves.includes(p.weave)) parts.push(`it suits someone ${pers.label.toLowerCase().replace(/^the /, "who is the ")}`);
  const smile = SMILES.find((x) => x.id === j.smile);
  if (smile && (smile.weaves.includes(p.weave) || smile.families.includes(p.colorFamily))) parts.push(`it brings ${smile.label.toLowerCase()}`);
  const occ = OCCASIONS.find((o) => o.id === j.occasion);
  if (occ && p.occasion.some((o) => occ.fits.includes(o))) parts.push(`it’s right for ${occ.phrase}`);
  if (!parts.length) parts.push("it’s one of our most-loved sarees");
  const joined = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0];
  return `${plainDescription(p)} Chosen because ${joined}.`;
}

/** Five real sarees for this journey. Budget is firm unless too few fit, then the nearest prices fill in. */
export function curate(j: Journey, count = 5): GiftPick[] {
  const tier = BUDGET_TIERS.find((b) => b.id === j.budget);
  const pool = available();
  const rank = (list: Product[]) => [...list].sort((a, b) => score(b, j) - score(a, j) || a.price - b.price);
  let chosen = rank(tier ? pool.filter((p) => p.price >= tier.min && p.price < tier.max) : pool);
  if (tier && chosen.length < count) {
    const dist = (p: Product) => (p.price < tier.min ? tier.min - p.price : p.price - tier.max);
    chosen = [...chosen, ...pool.filter((p) => !chosen.includes(p)).sort((a, b) => dist(a) - dist(b))];
  }
  // Variety: at most two of one weave.
  const per: Record<string, number> = {};
  const out: Product[] = [];
  for (const p of chosen) {
    if ((per[p.weave] ?? 0) >= 2) continue;
    per[p.weave] = (per[p.weave] ?? 0) + 1;
    out.push(p);
    if (out.length === count) break;
  }
  for (const p of chosen) if (out.length < count && !out.includes(p)) out.push(p);
  return out.map((p) => ({ product: p, why: whyFor(p, j) }));
}

/* ---------- Wrapping ---------- */

export const RIBBONS = [
  { id: "Berry", hex: "#87264d" },
  { id: "Antique Gold", hex: "#b8914a" },
  { id: "Ivory", hex: "#efe6d6" },
  { id: "Emerald", hex: "#1f5a3a" },
] as const;

export const CARD_DESIGNS = [
  { id: "Ivory", paper: "#f6f1ea", ink: "#2a1a23", accent: "#b8914a" },
  { id: "Berry", paper: "#5b1630", ink: "#f6ece4", accent: "#d9b877" },
  { id: "Sage", paper: "#e3e6da", ink: "#24302a", accent: "#87264d" },
] as const;

export const STUDIO_KEY = "kb.giftStudio.v1";
