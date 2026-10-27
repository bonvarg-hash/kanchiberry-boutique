import { products, type WeaveSlug } from "./products";
import { textileUri } from "./textile";

export interface WeavePhoto {
  src: string;
  alt: string;
  credit: string;
  license: string;
  source: string;
}

export interface Weave {
  slug: WeaveSlug;
  /** Openly licensed photograph from Wikimedia Commons (attribution shown with the image). */
  photo: WeavePhoto;
  name: string;
  region: string;
  line: string;
  story: string[];
  signatures: string[];
  swatch: string;
  swatchAlt: string;
}

const PHOTOS: Record<WeaveSlug, WeavePhoto> = {
  kanjivaram: {
    src: "/weaves/kanjivaram.jpg",
    alt: "A Kanchipuram handloom silk saree with zari work across the body and border",
    credit: "Ramkumar Kalyani",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:%E0%AE%89%E0%AE%9F%E0%AE%B2%E0%AF%8D_%E0%AE%AE%E0%AF%81%E0%AE%B4%E0%AF%81%E0%AE%B5%E0%AE%A4%E0%AF%81%E0%AE%AE%E0%AF%8D_%E0%AE%9A%E0%AE%B0%E0%AE%BF%E0%AE%95%E0%AF%88_%E0%AE%B5%E0%AF%87%E0%AE%B2%E0%AF%88%E0%AE%AA%E0%AE%BE%E0%AE%9F%E0%AF%81%E0%AE%95%E0%AE%B3%E0%AF%8D_%E0%AE%A8%E0%AE%BF%E0%AE%B1%E0%AF%88%E0%AE%A8%E0%AF%8D%E0%AE%A4_%E0%AE%95%E0%AE%BE%E0%AE%9E%E0%AF%8D%E0%AE%9A%E0%AE%BF%E0%AE%AA%E0%AF%81%E0%AE%B0%E0%AE%AE%E0%AF%8D_%E0%AE%95%E0%AF%88%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%B1%E0%AE%BF_%E0%AE%AA%E0%AF%81%E0%AE%9F%E0%AE%B5%E0%AF%88.jpg",
  },
  banarasi: {
    src: "/weaves/banarasi.jpg",
    alt: "The pallu of a red Banarasi sari woven with silver zari paisleys",
    credit: "आशीष भटनागर",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Banarasi_sari_pallu_by_ashish4.JPG",
  },
  paithani: {
    src: "/weaves/paithani.jpg",
    alt: "A turquoise and green Paithani saree with a pallu of woven birds",
    credit: "Only Paithani",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Wedding_saree_(1050936).jpg",
  },
  chanderi: {
    src: "/weaves/chanderi.jpg",
    alt: "A blue Chanderi saree with small gold buttis and a zari border",
    credit: "MANOJKUMARDILDAR",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Chanderi_saree.webp",
  },
  patola: {
    src: "/weaves/patola.jpg",
    alt: "Detail of a red double ikat Patola wedding sari with flower and lattice motifs",
    credit: "Los Angeles County Museum of Art",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Woman%27s_Wedding_Sari_LACMA_M.71.37.2_(2_of_2).jpg",
  },
  "linen-cotton": {
    src: "/weaves/linen-cotton.jpg",
    alt: "A cotton-zari Manamedu saree being woven on a handloom",
    credit: "ShreyasiGaatha",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Manamedu_Saree.jpg",
  },
};

const base: Omit<Weave, "swatch" | "swatchAlt" | "photo">[] = [
  {
    slug: "kanjivaram",
    name: "Kanjivaram Silk",
    region: "Kanchipuram, Tamil Nadu",
    line: "Lustrous silk, bold borders, temple motifs.",
    story: [
      "Kanjivaram sarees take their name from Kanchipuram, a temple town in Tamil Nadu with a long tradition of silk weaving.",
      "They are known for heavy, lustrous silk, contrast borders and pallus, and zari woven into the fabric. In the korvai technique, the border and body are woven separately and interlocked.",
    ],
    signatures: ["Temple (gopuram) borders", "Kattam checks", "Contrast korvai borders", "Gold zari"],
  },
  {
    slug: "banarasi",
    name: "Banarasi Silk",
    region: "Varanasi, Uttar Pradesh",
    line: "Brocade worked in gold and silver zari.",
    story: [
      "Banarasi sarees come from Varanasi and are prized for their brocade, where extra threads of zari or silk create raised patterns.",
      "Jaal (net) patterns, buttis and flowing floral bels are common, often with Mughal-inspired forms.",
    ],
    signatures: ["Jaal all-over nets", "Kairi (paisley)", "Floral bels", "Zari brocade"],
  },
  {
    slug: "paithani",
    name: "Paithani",
    region: "Paithan & Yeola, Maharashtra",
    line: "Jewel tones and peacock pallus.",
    story: [
      "Paithani is associated with Paithan and Yeola in Maharashtra. Its pallus are often woven with peacocks, lotuses and parrots.",
      "Many Paithanis use a shot-silk body, where warp and weft of different colours give a shifting, kaleidoscopic sheen.",
    ],
    signatures: ["Peacock (mor) pallus", "Shot-silk bodies", "Oblique-square borders"],
  },
  {
    slug: "chanderi",
    name: "Chanderi",
    region: "Chanderi, Madhya Pradesh",
    line: "Sheer, light and quietly luminous.",
    story: [
      "Chanderi sarees are known for a sheer, glassy texture and remarkable lightness.",
      "They are commonly woven in silk, cotton or silk-cotton blends, with small buttis and slim borders.",
    ],
    signatures: ["Sheer texture", "Small buttis", "Slim zari borders"],
  },
  {
    slug: "patola",
    name: "Patola",
    region: "Patan, Gujarat",
    line: "Double ikat geometry with feathered edges.",
    story: [
      "Patan Patola is a double ikat: warp and weft are both resist-dyed to a plan before weaving, and the design appears only as the threads cross.",
      "The slight feathering at the edge of each motif is a signature of the ikat process.",
    ],
    signatures: ["Double ikat", "Geometric grids", "Feathered motif edges"],
  },
  {
    slug: "linen-cotton",
    name: "Linen & Cotton",
    region: "Handlooms across India",
    line: "Breathable everyday drapes.",
    story: [
      "Linen and cotton sarees are made for everyday wear: breathable, easy to care for, and softer with every wash.",
      "Simple stripes, checks and slim borders keep them versatile from work to evening.",
    ],
    signatures: ["Stripes and checks", "Slim borders", "Soft, matte finish"],
  },
];

export const weaves: Weave[] = base.map((w) => {
  const sample = products.find((p) => p.weave === w.slug)!;
  return {
    ...w,
    photo: PHOTOS[w.slug],
    swatch: textileUri(sample.textile, "swatch"),
    swatchAlt: `Illustrative ${w.name} textile render based on the ${sample.name}`,
  };
});

export const getWeave = (slug: string) => weaves.find((w) => w.slug === slug);
