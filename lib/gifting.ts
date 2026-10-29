import { products, type Product } from "./products";

/**
 * Guided gifting. Shoppers answer in plain language (who, occasion, look,
 * colour, budget); this file turns those answers into catalogue filters and
 * scores, and explains each pick without saree jargon. Every recommendation is
 * a real saree from the catalogue.
 */

export type Who = "wife" | "mother" | "sister" | "friend" | "someone";
export type Occasion = "birthday" | "anniversary" | "wedding" | "festival" | "thanks" | "just-because";
export type Look = "graceful" | "bright" | "classic" | "bold" | "simple";
export type Colour = "red" | "pink" | "green" | "blue" | "purple" | "gold" | "ivory" | "black" | "any";
export type Budget = "under-2000" | "2000-5000" | "5000-10000" | "10000-20000" | "over-20000" | "any";

export interface Answers {
  who: Who | null;
  occasion: Occasion | null;
  look: Look | null;
  colour: Colour | null;
  budget: Budget | null;
}
export const EMPTY_ANSWERS: Answers = { who: null, occasion: null, look: null, colour: null, budget: null };

export const WHO: { id: Who; label: string; her: string }[] = [
  { id: "wife", label: "Wife", her: "your wife" },
  { id: "mother", label: "Mother", her: "your mother" },
  { id: "sister", label: "Sister", her: "your sister" },
  { id: "friend", label: "Friend", her: "your friend" },
  { id: "someone", label: "Someone Special", her: "her" },
];

export const OCCASIONS: { id: Occasion; label: string; fits: string[]; phrase: string }[] = [
  { id: "birthday", label: "Birthday", fits: ["Festive", "Evening", "Day"], phrase: "a birthday" },
  { id: "anniversary", label: "Anniversary", fits: ["Wedding", "Ceremony", "Evening"], phrase: "an anniversary" },
  { id: "wedding", label: "Wedding", fits: ["Wedding", "Ceremony"], phrase: "a wedding" },
  { id: "festival", label: "Festival", fits: ["Festive"], phrase: "the festival season" },
  { id: "thanks", label: "Thank You", fits: ["Day", "Everyday", "Work", "Festive"], phrase: "a thank-you" },
  { id: "just-because", label: "Just Because", fits: ["Everyday", "Day", "Evening"], phrase: "an everyday surprise" },
];

/** "Which of these feels most like her?" Personalities in plain words; each maps to weaves, collections and colours behind the scenes. */
export const LOOKS: { id: Look; label: string; line: string; weaves: string[]; collections: string[]; colours: string[] }[] = [
  { id: "graceful", label: "Graceful & Elegant", line: "Poised, refined, never overdone", weaves: ["chanderi", "banarasi"], collections: ["Summer Sheers", "Heirloom Silks"], colours: ["Ivory", "Pink", "Blue"] },
  { id: "bright", label: "Bright & Cheerful", line: "Warm, lively and full of colour", weaves: ["paithani", "linen-cotton", "kanjivaram"], collections: ["The Festive Edit"], colours: ["Yellow", "Orange", "Pink", "Green"] },
  { id: "classic", label: "Classic & Timeless", line: "Loves tradition and things that last", weaves: ["kanjivaram", "paithani"], collections: ["Heirloom Silks", "Bridal Trousseau"], colours: ["Red", "Green", "Purple"] },
  { id: "bold", label: "Bold & Beautiful", line: "Confident, striking, loves to stand out", weaves: ["patola", "banarasi", "kanjivaram"], collections: ["The Festive Edit"], colours: ["Red", "Purple", "Black"] },
  { id: "simple", label: "Simple & Subtle", line: "Understated, easy and effortless", weaves: ["linen-cotton", "chanderi"], collections: ["Everyday Weaves", "Summer Sheers"], colours: ["Ivory", "Blue", "Green"] },
];

export const COLOURS: { id: Colour; label: string; swatch: string; families: string[] }[] = [
  { id: "red", label: "Red", swatch: "#9b1c2c", families: ["Red"] },
  { id: "pink", label: "Pink", swatch: "#c13a72", families: ["Pink"] },
  { id: "green", label: "Green", swatch: "#1f5a3a", families: ["Green"] },
  { id: "blue", label: "Blue", swatch: "#1e3f86", families: ["Blue"] },
  { id: "purple", label: "Purple", swatch: "#4b2464", families: ["Purple"] },
  { id: "gold", label: "Gold", swatch: "linear-gradient(135deg,#9b7633,#ecd08f 50%,#a8823c)", families: ["Yellow", "Orange"] },
  { id: "ivory", label: "Cream & Ivory", swatch: "#ece3d0", families: ["Ivory"] },
  { id: "black", label: "Black", swatch: "#1c1a1e", families: ["Black"] },
  { id: "any", label: "No Preference", swatch: "conic-gradient(#9b1c2c,#c13a72,#4b2464,#1e3f86,#1f5a3a,#d7a21e,#9b1c2c)", families: [] },
];

export const BUDGETS: { id: Budget; label: string; min: number; max: number }[] = [
  { id: "under-2000", label: "Under ₹2,000", min: 0, max: 2000 },
  { id: "2000-5000", label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { id: "5000-10000", label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { id: "10000-20000", label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { id: "over-20000", label: "Over ₹20,000", min: 20000, max: Infinity },
  { id: "any", label: "No fixed budget", min: 0, max: Infinity },
];

/** How many sarees fall in each budget, for the budget step. */
export const budgetCount = (b: Budget) => {
  const band = BUDGETS.find((x) => x.id === b)!;
  return products.filter((p) => p.price >= band.min && p.price < band.max).length;
};

/** Plain-language description of a saree, with no weave names. */
const PLAIN: Record<string, string> = {
  kanjivaram: "Rich, lustrous silk with a bold contrast border",
  banarasi: "Silk with gold patterns woven right into the fabric",
  paithani: "Silk with a vivid, decorated end piece that drapes over the shoulder",
  chanderi: "Light, sheer and graceful, comfortable for long days",
  patola: "Vibrant woven geometric patterns, made with great skill",
  "linen-cotton": "Soft, breathable and easy to wear",
};
export const plainDescription = (p: Product) => `${PLAIN[p.weave] ?? "A beautifully woven saree"}, in ${p.color.toLowerCase()}.`;

const OCCASION_WORDS: Record<string, string> = {
  Wedding: "Weddings",
  Festive: "Festivals",
  Ceremony: "Ceremonies",
  Evening: "Evenings out",
  Day: "Daytime events",
  Everyday: "Everyday wear",
  Work: "Work",
};
export const suitableFor = (p: Product) => p.occasion.map((o) => OCCASION_WORDS[o] ?? o).join(", ");

const isPhotographed = (p: Product) => p.images[0]?.credit === "Kanchiberry";
const NEW_ARRIVALS = new Set(products.slice(-36).map((p) => p.slug));

export interface Pick {
  product: Product;
  badge: string;
  why: string;
}
export interface Result {
  picks: Pick[];
  /** What we loosened to find enough matches, in plain words; empty when nothing was. */
  relaxed: string[];
}

function score(p: Product, a: Answers) {
  let s = 0;
  const occ = OCCASIONS.find((o) => o.id === a.occasion);
  if (occ && p.occasion.some((o) => occ.fits.includes(o))) s += 3;
  const look = LOOKS.find((l) => l.id === a.look);
  if (look) {
    if (look.weaves.includes(p.weave)) s += 3;
    if (look.collections.includes(p.collection)) s += 1.5;
    if (look.colours.includes(p.colorFamily)) s += 1;
  }
  if (a.who === "mother" && (p.collection === "Heirloom Silks" || p.weave === "kanjivaram")) s += 1;
  if (a.who === "wife" && (p.occasion.includes("Wedding") || p.occasion.includes("Evening"))) s += 0.8;
  if ((a.who === "sister" || a.who === "friend") && (p.occasion.includes("Festive") || p.occasion.includes("Day"))) s += 0.6;
  if (isPhotographed(p)) s += 0.75; // real photography reads better as a gift choice
  if (p.stock === 0) s -= 100;
  return s;
}

function badgeFor(p: Product, a: Answers, i: number): string {
  // Every badge that honestly applies; rotate through them so the selection doesn't repeat one label.
  const fits: string[] = [];
  if (a.occasion === "anniversary" && p.occasion.some((o) => ["Wedding", "Ceremony", "Evening"].includes(o))) fits.push("Perfect for Anniversaries");
  if (a.occasion === "wedding" && p.occasion.includes("Wedding")) fits.push("Made for Weddings");
  if (a.occasion === "festival" && p.occasion.includes("Festive")) fits.push("Festival Favourite");
  if (p.collection === "Heirloom Silks") fits.push("A Timeless Favourite");
  if (p.collection === "Bridal Trousseau") fits.push("Bridal Beauty");
  if (NEW_ARRIVALS.has(p.slug)) fits.push("Just Arrived");
  if (p.compareAtPrice && p.compareAtPrice > p.price) fits.push("Special Price");
  if (p.stock !== undefined && p.stock > 0 && p.stock <= 2) fits.push("Only a Few Left");
  if (i === 0) return fits[0] ?? "Our Top Pick";
  return fits.length ? fits[i % fits.length] : "Thoughtfully Chosen";
}

function whyFor(p: Product, a: Answers): string {
  const parts: string[] = [];
  const colour = COLOURS.find((c) => c.id === a.colour);
  if (colour && colour.id !== "any" && colour.families.includes(p.colorFamily)) parts.push(`its ${colour.label.toLowerCase()} tones match the colour you chose`);
  const look = LOOKS.find((l) => l.id === a.look);
  if (look && look.weaves.includes(p.weave)) parts.push(`it has the ${look.label.toLowerCase()} feel you're after`);
  const occ = OCCASIONS.find((o) => o.id === a.occasion);
  if (occ && p.occasion.some((o) => occ.fits.includes(o))) parts.push(`it's right for ${occ.phrase}`);
  const who = WHO.find((w) => w.id === a.who);
  if (!parts.length) parts.push("it's one of our most-loved sarees and makes a graceful gift");
  const joined = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0];
  return `We picked this because ${joined}${who ? `. A lovely choice for ${who.her}.` : "."}`;
}

const inBudget = (p: Product, b: Budget | null) => {
  const band = BUDGETS.find((x) => x.id === (b ?? "any"))!;
  return p.price >= band.min && p.price < band.max;
};
const inColour = (p: Product, c: Colour | null) => {
  const col = COLOURS.find((x) => x.id === (c ?? "any"))!;
  return col.id === "any" || col.families.includes(p.colorFamily) || (col.id === "gold" && /gold/i.test(p.color) && p.colorFamily !== "Black");
};

/** 6–12 real sarees for these answers. Colour and budget are firm at first; if too few match, they are loosened in that order. */
export function recommend(a: Answers, min = 6, max = 12): Result {
  const relaxed: string[] = [];
  const available = products.filter((p) => p.stock !== 0);
  const rank = (list: Product[]) => [...list].sort((x, y) => score(y, a) - score(x, a) || x.price - y.price);

  let pool = available.filter((p) => inColour(p, a.colour) && inBudget(p, a.budget));
  if (pool.length < min && a.colour && a.colour !== "any") {
    const extra = available.filter((p) => inBudget(p, a.budget) && !pool.includes(p));
    pool = [...rank(pool), ...rank(extra)];
    relaxed.push("a few colours");
  }
  if (pool.length < min && a.budget && a.budget !== "any") {
    const band = BUDGETS.find((b) => b.id === a.budget)!;
    const near = available
      .filter((p) => !pool.includes(p) && inColour(p, a.colour))
      .sort((x, y) => Math.abs(x.price - (x.price < band.min ? band.min : band.max)) - Math.abs(y.price - (y.price < band.min ? band.min : band.max)));
    pool = [...pool, ...near.slice(0, min - pool.length)];
    relaxed.push("the budget slightly");
  }
  if (pool.length < min) {
    pool = [...pool, ...rank(available.filter((p) => !pool.includes(p))).slice(0, min - pool.length)];
  }

  const ranked = relaxed.length ? pool : rank(pool);
  // Keep variety: no more than four of the same kind of saree in the selection.
  const perWeave: Record<string, number> = {};
  const chosen: Product[] = [];
  for (const p of ranked) {
    if ((perWeave[p.weave] ?? 0) >= 4) continue;
    perWeave[p.weave] = (perWeave[p.weave] ?? 0) + 1;
    chosen.push(p);
    if (chosen.length === max) break;
  }
  return { picks: chosen.map((p, i) => ({ product: p, badge: badgeFor(p, a, i), why: whyFor(p, a) })), relaxed };
}

/** A representative saree for each look, for its picture card; no two looks share a picture. */
const LOOK_IMAGES = (() => {
  const used = new Set<string>();
  const out = {} as Record<Look, Product["images"][number]>;
  for (const l of LOOKS) {
    const fits = (p: Product) => l.weaves.includes(p.weave) && !used.has(p.images[0].src);
    const p =
      products.find((p) => fits(p) && isPhotographed(p) && l.colours.includes(p.colorFamily)) ??
      products.find((p) => fits(p) && isPhotographed(p)) ??
      products.find((p) => fits(p) && l.colours.includes(p.colorFamily)) ??
      products.find(fits) ??
      products[0];
    used.add(p.images[0].src);
    out[l.id] = p.images[0];
  }
  return out;
})();
export const lookImage = (look: Look) => LOOK_IMAGES[look];

/* ---------- Gift options ---------- */

export type Packaging = "signature" | "classic";
export const PACKAGING: { id: Packaging; label: string; price: number; line: string }[] = [
  { id: "signature", label: "Kanchiberry Signature Gift Box", price: 499, line: "A keepsake box with a ribbon and a printed message card" },
  { id: "classic", label: "Classic Packaging", price: 0, line: "Neatly folded in tissue in our standard box" },
];

export const MESSAGE_SUGGESTIONS: Record<Occasion | "default", string[]> = {
  birthday: ["Happy birthday! Something beautiful for someone beautiful.", "Wishing you a year as lovely as you are."],
  anniversary: ["Happy anniversary. Every year with you is my favourite.", "To many more years together. With all my love."],
  wedding: ["Wishing you a lifetime of love and happiness.", "Congratulations on your wedding. May this be the first of many celebrations."],
  festival: ["Wishing you a joyful festival full of light.", "For the celebrations ahead. Have a wonderful festival."],
  thanks: ["Thank you for everything you do. This is just a small token.", "With heartfelt thanks."],
  "just-because": ["No reason at all, just because you deserve something lovely.", "Thinking of you."],
  default: ["Something beautiful, just for you.", "With love."],
};

export interface GiftDetails {
  packaging: Packaging;
  message: string;
  from: string;
  recipient: { name: string; phone: string; address: string; city: string; pin: string };
  instructions: string;
  hidePrice: boolean;
  sendToRecipient: boolean;
  occasion?: Occasion | null;
  who?: Who | null;
  /** Chosen in the 3D gift studio. */
  ribbon?: string;
  cardDesign?: string;
}

export const packagingPrice = (g?: GiftDetails) => (g ? (PACKAGING.find((x) => x.id === g.packaging)?.price ?? 0) : 0);

/** Estimated delivery window: 5–8 days from today (an estimate until a shipping service is connected). */
export function deliveryWindow(from = new Date()) {
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const add = (n: number) => new Date(from.getTime() + n * 86400000);
  return `${fmt(add(5))} – ${fmt(add(8))}`;
}

/** Answers carried from the gift finder to the gift options, for this browser visit. */
export const ANSWERS_KEY = "kb.giftAnswers.v1";
export const ORDER_KEY = "kb.giftOrder.v1";
