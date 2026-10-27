import type { WeavePhoto } from "./weaves";

/**
 * Photographs of weaving across India, from Wikimedia Commons. They show the
 * crafts in general and are not Kanchiberry's own makers or workshops.
 */
export interface CraftPhoto extends WeavePhoto {
  label: string;
}

export const craftPhotos = {
  kanchipuramLoom: {
    src: "/craft/kanchipuram-loom.jpg",
    alt: "A maroon silk saree with gold zari taking shape on a Kanchipuram loom",
    label: "Zari brocade · Kanchipuram",
    credit: "Kamal Venkit",
    license: "CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Silk_saree_on_the_making_at_Kanchipuram_(7642281054).jpg",
  },
  banarasiWarp: {
    src: "/craft/banarasi-warp.jpg",
    alt: "Banarasi saris wound on wooden blocks, leaning against a wall in Varanasi",
    label: "Brocade on warp blocks · Varanasi",
    credit: "Suyash Dwivedi",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Banarasi_Sari_on_viewing_wooden_blocks_01.jpg",
  },
  patolaLoom: {
    src: "/craft/patola-loom.jpg",
    alt: "A double ikat patola loom with resist-dyed warp threads",
    label: "Double ikat · Patan",
    credit: "Bernard Gagnon",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Loom_to_weave_patola.jpg",
  },
  cottonLoom: {
    src: "/weaves/linen-cotton.jpg",
    alt: "A cotton-zari Manamedu saree being woven on a handloom",
    label: "Cotton handloom · Manamedu",
    credit: "ShreyasiGaatha",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Manamedu_Saree.jpg",
  },
} satisfies Record<string, CraftPhoto>;
