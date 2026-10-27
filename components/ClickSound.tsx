"use client";

import { useEffect } from "react";

/** Calls to action that tick when clicked. Add data-click-sound to opt anything else in. */
const CTA = ".btn, .cursor-cta, .text-link, .editorial-pill, [data-click-sound]";

/**
 * A soft, short "tick" on mouse clicks on calls to action, synthesised with the
 * Web Audio API (no sound file to load or license). The audio context starts on
 * the first click, as browsers require. Touch and keyboard presses stay silent,
 * and so do disabled buttons.
 */
export function ClickSound() {
  useEffect(() => {
    let ctx: AudioContext | null = null;

    const tick = () => {
      ctx ??= new AudioContext();
      if (ctx.state === "suspended") void ctx.resume();
      const t = ctx.currentTime;
      // A quick downward chirp with a fast fade: reads as a gentle wooden tap.
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.05);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.08, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const el = (e.target as Element | null)?.closest?.(CTA);
      if (!el || el.matches(":disabled, [aria-disabled='true']")) return;
      tick();
    };
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      void ctx?.close();
    };
  }, []);

  return null;
}
