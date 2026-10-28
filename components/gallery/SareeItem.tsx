"use client";

import Link from "next/link";
import type { CSSProperties, FocusEvent, MouseEvent, PointerEvent } from "react";
import { forwardRef } from "react";
import { formatPrice, type Product } from "@/lib/products";

/** Deterministic per-item variation so no two garments hang identically. */
function variation(seed: number) {
  const r = (k: number) => {
    const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    yaw: 72 + r(1) * 8,
    tilt: (r(2) - 0.5) * 0.8,
    len: 0.95 + r(3) * 0.08,
    amp: 0.75 + r(4) * 0.5,
    lag: r(5) * 0.6,
  };
}

/** A solid box built from six faces, sized by --w, --h and --d (see .box3d in globals.css). */
function Box3D({ className }: { className: string }) {
  return (
    <span className={`box3d ${className}`}>
      {["front", "back", "top", "bottom", "left", "right"].map((f) => (
        <span key={f} className={`box-face box-${f}`} />
      ))}
    </span>
  );
}

/**
 * Walnut suit hanger in 3D, after a boutique wardrobe: a brass hook, two broad
 * shoulder arms angled down from the hook, and the round bar the saree folds
 * over. The arms and bar are solid boxes, so they keep their depth when the
 * hanger turns edge-on along the rail.
 */
export function SareeHanger() {
  return (
    <>
      <svg viewBox="0 0 220 120" aria-hidden focusable="false">
        <defs>
          <linearGradient id="kb-brass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9b7633" />
            <stop offset=".45" stopColor="#ecd08f" />
            <stop offset="1" stopColor="#a8823c" />
          </linearGradient>
        </defs>
        {/* brass hook, rising out of the hanger's crown */}
        <path d="M110 40V25c0-7 9.5-9.5 9.5-17C119.5 1 115-2.5 110-2.5S100.5 1 100.5 6.5" fill="none" stroke="#7d5f28" strokeWidth="4" strokeLinecap="round" />
        <path d="M110 40V25c0-7 9.5-9.5 9.5-17C119.5 1 115-2.5 110-2.5S100.5 1 100.5 6.5" fill="none" stroke="url(#kb-brass)" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
      <Box3D className="hanger-arm hanger-arm-l" />
      <Box3D className="hanger-arm hanger-arm-r" />
      <Box3D className="hanger-crown" />
      <Box3D className="hanger-rod" />
    </>
  );
}

interface Props {
  product: Product;
  index: number;
  open: boolean;
  /** Repeat of an earlier saree used to fill the rail; skipped by keyboard and screen readers. */
  duplicate?: boolean;
  onPointerEnter: (e: PointerEvent) => void;
  onPointerLeave: (e: PointerEvent) => void;
  onPointerDown: (e: PointerEvent) => void;
  onClick: (e: MouseEvent) => void;
  onFocus: (e: FocusEvent) => void;
  onBlur: (e: FocusEvent) => void;
}

export const SareeItem = forwardRef<HTMLAnchorElement, Props>(function SareeItem(
  { product: p, index, open, duplicate = false, ...handlers },
  ref,
) {
  const v = variation(index + 1);
  const style = {
    "--yaw": `${v.yaw.toFixed(1)}deg`,
    "--tilt": `${v.tilt.toFixed(2)}deg`,
    "--len": v.len.toFixed(3),
    "--i": index,
    "--amp": v.amp.toFixed(2),
    "--lag": `${v.lag.toFixed(2)}s`,
  } as CSSProperties;

  return (
    <Link
      ref={ref}
      href={`/sarees/${p.slug}`}
      className={`saree${open ? " is-open" : ""}`}
      style={style}
      data-saree
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate || undefined}
      aria-label={`${p.name}, ${p.weaveName} in ${p.color}. Sample price ${formatPrice(p.price)}. View details`}
      {...handlers}
    >
      {/* One garment in 3D: the expanded view, turned edge-on at rest. */}
      <span className="saree-swing" aria-hidden>
        {/* its soft shadow on the wall behind: swings with it, and widens when it turns to face you */}
        <span className="saree-shadow" />
        <span className="saree-3d">
          <span className="saree-hanger">
            <SareeHanger />
          </span>
          {/* the saree folded over the rod: a shorter front layer, a longer back layer, and the U-shaped fold seen from the side */}
          <span
            className="saree-drape"
            style={
              {
                "--fb": p.textile.border,
                "--fc": p.textile.base,
                "--fz": p.textile.zari,
                "--fab-body": `url("${p.fabric?.body ?? p.hangingViewImage}")`,
                ...(p.fabric?.border ? { "--fab-border": `url("${p.fabric.border}")` } : {}),
              } as CSSProperties
            }
          >
            <span className="saree-face" />
            <span className="saree-back" />
            <span className="saree-fold saree-fold-l" />
            <span className="saree-fold saree-fold-r" />
          </span>
        </span>
      </span>
      <span className="saree-label" aria-hidden>
        <span className="serif text-[24px] leading-tight">{p.name}</span>
        <span className="saree-quick">
          View details <span aria-hidden>→</span>
        </span>
      </span>
    </Link>
  );
});
