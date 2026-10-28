"use client";

import { useEffect, useRef } from "react";

/** The photo's size and where the models' heads begin (share of its height). */
const PHOTO = { w: 1476, h: 2322, headTop: 0.45 };
/** Keep the heads at least this far below the top edge (share of the hero's height). */
const HEAD_ROOM = 0.06;

/**
 * Hero background photo that fills the section but never crops the models' heads.
 * When the frame is wider than the photo, the extra height is trimmed from the
 * bottom first: the photo is placed so the heads sit just under the top edge.
 */
export function HeroPhoto({ src }: { src: string }) {
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = img.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    const place = () => {
      const { width: w, height: h } = box.getBoundingClientRect();
      const scale = Math.max(w / PHOTO.w, h / PHOTO.h);
      const imgH = PHOTO.h * scale;
      const spare = imgH - h; // how much height is cut away in total
      if (spare <= 0.5) {
        el.style.objectPosition = "50% 50%";
        return;
      }
      // Offset of the photo's top above the frame: just enough to bring the heads to HEAD_ROOM.
      const shift = Math.min(Math.max(PHOTO.headTop * imgH - HEAD_ROOM * h, 0), spare);
      el.style.objectPosition = `50% ${((shift / spare) * 100).toFixed(2)}%`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return <img ref={img} src={src} alt="" aria-hidden fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover" />;
}
