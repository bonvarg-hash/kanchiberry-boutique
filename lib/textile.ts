/**
 * Procedural textile renders.
 *
 * Kanchiberry has no product photography yet, so every saree is drawn from a
 * small parametric description (ground colour, motif, border, pallu). One SVG
 * render per saree feeds the hanging view, the front-facing reveal and the
 * product-page close-ups, so all views of a saree always match each other.
 *
 * These are development placeholders. Replace `images`, `frontViewImage` and
 * `hangingViewImage` in lib/products.ts with real photography when available;
 * the gallery and product page only consume image URLs.
 */

export type Motif = "butta" | "checks" | "jaal" | "ikat" | "stripes" | "paisley";
export type BorderStyle = "temple" | "zari" | "ikat" | "thin" | "peacock";
export type PalluMotif = "temple" | "mango" | "ikat" | "peacock" | "bands";

export interface Textile {
  base: string;
  motif: Motif;
  motifColor: string;
  zari: string;
  border: string;
  borderStyle: BorderStyle;
  pallu: string;
  palluMotif: PalluMotif;
  finish: "silk" | "sheer" | "matte";
}

export type TextileView = "full" | "texture" | "border" | "swatch" | "detail";

/** Canvas size of the full-length render. */
export const TEXTILE_W = 600;
export const TEXTILE_H = 880;
const BW = 52;
const PY = 690;

const VIEWBOXES: Record<TextileView, [number, number, number, number]> = {
  full: [0, 0, TEXTILE_W, TEXTILE_H],
  texture: [210, 180, 180, 180],
  border: [0, 560, 320, 320],
  swatch: [90, 140, 420, 420],
  detail: [0, 520, 420, 360],
};

const flower = (cx: number, cy: number, r: number, petal: string, center: string) =>
  `<g transform="translate(${cx} ${cy})">${[0, 60, 120, 180, 240, 300]
    .map(
      (a) =>
        `<ellipse cy="${-r}" rx="${(r * 0.42).toFixed(2)}" ry="${(r * 0.78).toFixed(2)}" transform="rotate(${a})" fill="${petal}"/>`,
    )
    .join("")}<circle r="${(r * 0.42).toFixed(2)}" fill="${center}"/></g>`;

const mango = (x: number, y: number, s: number, rot: number, fill: string, stroke: string) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 -14C10 -14 13 2 5 10C1 14 -9 13 -9 3C-9 -5 -3 -8 1 -6C4 -4 3 0 0 0Z" fill="${fill}" stroke="${stroke}" stroke-width="${(1.1 / s).toFixed(2)}"/><circle cx="-3" cy="4" r="2" fill="${stroke}"/></g>`;

const diamond = (cx: number, cy: number, rx: number, ry: number) =>
  `${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`;

function motifPattern(t: Textile): string {
  const { motif, motifColor: m, zari: z, base } = t;
  switch (motif) {
    case "butta":
      return `<pattern id="m" width="48" height="56" patternUnits="userSpaceOnUse">${flower(12, 14, 5.5, m, z)}${flower(36, 42, 5.5, m, z)}<circle cx="36" cy="14" r="1.3" fill="${z}"/><circle cx="12" cy="42" r="1.3" fill="${z}"/></pattern>`;
    case "checks":
      return `<pattern id="m" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M0 1H60M1 0V60" stroke="${z}" stroke-width="2.4" opacity=".85"/><path d="M0 7H60M7 0V60" stroke="${m}" stroke-width="1.6"/><circle cx="34" cy="34" r="2.6" fill="${z}"/></pattern>`;
    case "jaal":
      return `<pattern id="m" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M32 0L64 32L32 64L0 32Z" fill="none" stroke="${z}" stroke-width="1.8" opacity=".85"/><path d="M32 6L58 32L32 58L6 32Z" fill="none" stroke="${m}" stroke-width=".9"/>${flower(32, 32, 6, m, z)}<circle r="3" fill="${z}"/><circle cx="64" r="3" fill="${z}"/><circle cy="64" r="3" fill="${z}"/><circle cx="64" cy="64" r="3" fill="${z}"/></pattern>`;
    case "ikat":
      return `<pattern id="m" width="72" height="56" patternUnits="userSpaceOnUse"><polygon points="${diamond(37.5, 28, 30, 24)}" fill="${m}" opacity=".35"/><polygon points="${diamond(36, 28, 30, 24)}" fill="${m}" stroke="${base}" stroke-width="1.5" stroke-dasharray="3 2"/><polygon points="${diamond(36, 28, 19, 15)}" fill="${z}" stroke="${m}" stroke-width="1" stroke-dasharray="2 2"/><polygon points="${diamond(36, 28, 10, 8)}" fill="${base}"/><polygon points="${diamond(36, 28, 4, 3.2)}" fill="${m}"/><polygon points="${diamond(0, 0, 6, 5)}" fill="${z}"/><polygon points="${diamond(72, 0, 6, 5)}" fill="${z}"/><polygon points="${diamond(0, 56, 6, 5)}" fill="${z}"/><polygon points="${diamond(72, 56, 6, 5)}" fill="${z}"/></pattern>`;
    case "stripes":
      return `<pattern id="m" width="24" height="10" patternUnits="userSpaceOnUse"><path d="M6 0V10" stroke="${m}" stroke-width="2.2"/><path d="M15 0V10" stroke="${z}" stroke-width=".9" opacity=".7"/><path d="M19 0V10" stroke="${m}" stroke-width=".7" opacity=".6"/></pattern>`;
    case "paisley":
      return `<pattern id="m" width="84" height="96" patternUnits="userSpaceOnUse">${mango(22, 28, 1.3, -20, m, z)}${mango(64, 76, 1.3, 160, m, z)}<circle cx="64" cy="26" r="1.6" fill="${z}"/><circle cx="22" cy="74" r="1.6" fill="${z}"/></pattern>`;
  }
}

function borderBand(t: Textile): { width: number; svg: string; defs: string } {
  const { border: b, zari: z, motifColor: m } = t;
  const width = t.borderStyle === "thin" ? 22 : BW;
  const lines = `<rect x="${width - 7}" width="2.6" height="${PY}" fill="${z}"/><rect x="${width - 12}" width="1.1" height="${PY}" fill="${z}" opacity=".8"/><rect x="4" width="1.4" height="${PY}" fill="${z}" opacity=".7"/>`;
  let defs = "";
  let fill = "";
  switch (t.borderStyle) {
    case "temple":
      defs = `<pattern id="bt" x="${width}" width="20" height="26" patternUnits="userSpaceOnUse"><polygon points="0,0 17,13 0,26" fill="${b}"/><polygon points="0,6 9,13 0,20" fill="${z}"/></pattern><pattern id="bp" width="${width}" height="22" patternUnits="userSpaceOnUse"><polygon points="${diamond(width / 2 - 4, 11, 6, 7)}" fill="${z}" opacity=".85"/></pattern>`;
      fill = `<rect width="${width}" height="${PY}" fill="url(#bp)"/><rect x="${width}" width="20" height="${PY}" fill="url(#bt)"/>`;
      break;
    case "zari":
      defs = `<pattern id="bp" width="${width}" height="20" patternUnits="userSpaceOnUse"><rect x="9" width="${width - 24}" height="20" fill="${z}" opacity=".32"/><polygon points="${diamond(width / 2 - 4, 10, 7, 8)}" fill="${z}"/><circle cx="${width / 2 - 4}" cy="10" r="2" fill="${b}"/></pattern>`;
      fill = `<rect width="${width}" height="${PY}" fill="url(#bp)"/>`;
      break;
    case "ikat":
      defs = `<pattern id="bp" width="${width}" height="28" patternUnits="userSpaceOnUse"><polygon points="${diamond(width / 2 - 4, 14, 12, 12)}" fill="${z}" stroke="${b}" stroke-dasharray="3 2"/><polygon points="${diamond(width / 2 - 4, 14, 5, 5)}" fill="${m}"/><rect x="10" y="0" width="4" height="4" fill="${t.base}"/></pattern>`;
      fill = `<rect width="${width}" height="${PY}" fill="url(#bp)"/>`;
      break;
    case "peacock":
      defs = `<pattern id="bp" width="${width}" height="24" patternUnits="userSpaceOnUse"><rect x="8" width="${width - 22}" height="24" fill="${z}" opacity=".9"/><polygon points="${diamond(width / 2 - 3, 12, 8, 9)}" fill="${b}"/><circle cx="${width / 2 - 3}" cy="12" r="2.4" fill="${m}"/></pattern>`;
      fill = `<rect width="${width}" height="${PY}" fill="url(#bp)"/>`;
      break;
    case "thin":
      fill = "";
      break;
  }
  const svg = `<rect width="${width}" height="${PY}" fill="${b}"/>${fill}${lines}`;
  return { width, svg, defs };
}

function pallu(t: Textile): { defs: string; svg: string } {
  const { pallu: p, zari: z, border: b, motifColor: m, base } = t;
  const top = PY;
  let row = "";
  let defs = `<pattern id="ps" width="22" height="10" patternUnits="userSpaceOnUse"><rect x="2" width="9" height="10" fill="${z}" opacity=".5"/><path d="M15 0V10" stroke="${z}" stroke-width="1" opacity=".6"/></pattern><pattern id="pf" width="7" height="24" patternUnits="userSpaceOnUse"><path d="M3.5 4V24" stroke="${p}" stroke-width="2.2"/><path d="M3.5 4V24" stroke="#000" stroke-opacity=".18" stroke-width=".8"/><circle cx="3.5" cy="4" r="2" fill="${z}"/></pattern>`;
  switch (t.palluMotif) {
    case "temple":
      defs += `<pattern id="pm" width="40" height="64" patternUnits="userSpaceOnUse" y="${top + 22}"><polygon points="2,62 20,6 38,62" fill="${b}" stroke="${z}" stroke-width="2"/><polygon points="12,62 20,30 28,62" fill="${z}"/></pattern>`;
      row = `<rect y="${top + 22}" width="${TEXTILE_W}" height="64" fill="url(#pm)"/>`;
      break;
    case "mango":
      defs += `<pattern id="pm" width="70" height="70" patternUnits="userSpaceOnUse" y="${top + 20}">${mango(35, 36, 2.1, -15, z, b)}</pattern>`;
      row = `<rect y="${top + 20}" width="${TEXTILE_W}" height="70" fill="url(#pm)"/>`;
      break;
    case "ikat":
      defs += `<pattern id="pm" width="64" height="66" patternUnits="userSpaceOnUse" y="${top + 20}"><polygon points="${diamond(32, 33, 28, 30)}" fill="${base}" stroke="${z}" stroke-width="2" stroke-dasharray="4 2"/><polygon points="${diamond(32, 33, 16, 18)}" fill="${z}"/><polygon points="${diamond(32, 33, 7, 8)}" fill="${m}"/></pattern>`;
      row = `<rect y="${top + 20}" width="${TEXTILE_W}" height="66" fill="url(#pm)"/>`;
      break;
    case "peacock": {
      const bird = (x: number) =>
        `<g transform="translate(${x} ${top + 56})">${[-60, -40, -20, 0, 20, 40, 60]
          .map((a) => `<ellipse cy="-22" rx="6" ry="20" transform="rotate(${a})" fill="${z}" opacity=".9"/><circle cy="-36" r="3.2" transform="rotate(${a})" fill="${m}"/>`)
          .join("")}<ellipse cy="2" rx="9" ry="12" fill="${m}" stroke="${z}" stroke-width="1.5"/><circle cy="-14" r="4" fill="${m}" stroke="${z}"/></g>`;
      row = [60, 180, 300, 420, 540].map(bird).join("");
      break;
    }
    case "bands":
      row = `<rect y="${top + 30}" width="${TEXTILE_W}" height="4" fill="${z}" opacity=".7"/><rect y="${top + 42}" width="${TEXTILE_W}" height="14" fill="${b}"/><rect y="${top + 62}" width="${TEXTILE_W}" height="2" fill="${z}" opacity=".7"/>`;
      break;
  }
  const svg = `<rect y="${top}" width="${TEXTILE_W}" height="${TEXTILE_H - top}" fill="${p}"/><rect y="${top + 4}" width="${TEXTILE_W}" height="4" fill="${z}"/><rect y="${top + 12}" width="${TEXTILE_W}" height="1.4" fill="${z}" opacity=".8"/>${row}<rect y="${top + 96}" width="${TEXTILE_W}" height="${TEXTILE_H - top - 96 - 26}" fill="url(#ps)"/><rect y="${TEXTILE_H - 30}" width="${TEXTILE_W}" height="2" fill="${z}"/><rect y="${TEXTILE_H - 26}" width="${TEXTILE_W}" height="26" fill="url(#pf)"/>`;
  return { defs, svg };
}

export function textileSvg(t: Textile, view: TextileView = "full"): string {
  const [vx, vy, vw, vh] = VIEWBOXES[view];
  const bb = borderBand(t);
  const pl = pallu(t);
  const sheen =
    t.finish === "silk" ? 0.13 : t.finish === "sheer" ? 0.08 : 0.04;
  const defs = `<defs>${motifPattern(t)}${bb.defs}${pl.defs}<pattern id="g" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 .5H4M0 2.5H4" stroke="#000" stroke-opacity=".07" stroke-width=".7"/><path d="M.5 0V4M2.5 0V4" stroke="#fff" stroke-opacity="${t.finish === "matte" ? 0.07 : 0.05}" stroke-width=".7"/></pattern><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity="${sheen}"/><stop offset=".58" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient></defs>`;
  const body = `<rect width="${TEXTILE_W}" height="${TEXTILE_H}" fill="${t.base}"/><rect x="${bb.width}" width="${TEXTILE_W - bb.width * 2}" height="${PY}" fill="url(#m)"/>`;
  const borders = `<g>${bb.svg}</g><g transform="translate(${TEXTILE_W} 0) scale(-1 1)">${bb.svg}</g>`;
  const overlay = `<rect width="${TEXTILE_W}" height="${TEXTILE_H}" fill="url(#g)"/><rect width="${TEXTILE_W}" height="${TEXTILE_H}" fill="url(#sh)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" width="${vw * 2}" height="${vh * 2}" preserveAspectRatio="xMidYMid slice">${defs}${body}${borders}${pl.svg}${overlay}</svg>`;
}

export function textileUri(t: Textile, view: TextileView = "full"): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(textileSvg(t, view))}`;
}

/** Canvas size of the folded-over-the-rod render. */
export const FOLDED_W = 400;
export const FOLDED_H = 640;

/**
 * The saree as it hangs on a saree hanger: folded lengthwise over the wooden rod,
 * so the body faces out and the border runs along the bottom in two staggered
 * layers (front fold above, back fold peeking out below).
 */
export function foldedSvg(t: Textile): string {
  const bb = borderBand(t);
  const W = FOLDED_W;
  const H = FOLDED_H;
  const frontHem = H - 46;
  const band = (y: number) => `<g transform="translate(0 ${y}) rotate(-90)">${bb.svg}</g>`;
  const sheen = t.finish === "silk" ? 0.14 : t.finish === "sheer" ? 0.08 : 0.04;
  const defs = `<defs>${motifPattern(t)}${bb.defs}<pattern id="g" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 .5H4M0 2.5H4" stroke="#000" stroke-opacity=".07" stroke-width=".7"/><path d="M.5 0V4M2.5 0V4" stroke="#fff" stroke-opacity=".05" stroke-width=".7"/></pattern><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".08"/><stop offset=".38" stop-color="#fff" stop-opacity="${sheen}"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient><linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".07" stop-color="#000" stop-opacity=".06"/><stop offset=".12" stop-color="#fff" stop-opacity=".06"/><stop offset=".2" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs>`;
  const back = `<rect width="${W}" height="${H}" fill="${t.base}"/><rect width="${W}" height="${H}" fill="url(#m)"/>${band(H)}<rect y="${frontHem}" width="${W}" height="${H - frontHem}" fill="#000" opacity=".1"/>`;
  const front = `<rect width="${W}" height="${frontHem}" fill="${t.base}"/><rect width="${W}" height="${frontHem}" fill="url(#m)"/>${band(frontHem)}<rect y="${frontHem}" width="${W}" height="9" fill="url(#hs)"/>`;
  // the fold edge on the right shows the border running down the side
  const edge = `<rect x="${W - 7}" width="7" height="${H}" fill="${t.border}"/><rect x="${W - 5}" width="1.6" height="${H}" fill="${t.zari}"/>`;
  const overlay = `<rect width="${W}" height="${H}" fill="url(#g)"/><rect width="${W}" height="${H}" fill="url(#sh)"/><rect width="${W}" height="${H}" fill="url(#top)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="none">${defs}${back}${front}${edge}${overlay}</svg>`;
}

export function foldedUri(t: Textile): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(foldedSvg(t))}`;
}
