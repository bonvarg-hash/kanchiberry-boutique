/** Colour helpers for previewing a colourway by tinting a fabric photo. */

function hexToHsl(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  return [h, s, l];
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * A CSS filter that shifts a photo whose dominant colour is `from` towards `to`.
 * Approximate: it recolours the whole image, so use it on fabric-only photos.
 */
export function tintFilter(from: string, to: string): string {
  const [h1, s1, l1] = hexToHsl(from);
  const [h2, s2, l2] = hexToHsl(to);
  const hue = Math.round(h2 - h1);
  const sat = clamp(s2 / Math.max(s1, 0.05), 0.15, 2.5);
  const bright = clamp(l2 / Math.max(l1, 0.05), 0.45, 2.4);
  return `hue-rotate(${hue}deg) saturate(${sat.toFixed(2)}) brightness(${bright.toFixed(2)})`;
}
