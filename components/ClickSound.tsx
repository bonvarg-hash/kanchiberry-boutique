"use client";

import { useEffect } from "react";

/** Buttons, including links styled as buttons (CTAs, header icons); plain text links stay silent. */
const BUTTONS =
  "button, [role='button'], input[type='submit'], input[type='button'], .btn, .cursor-cta, .editorial-pill, .icon-btn";

/**
 * A soft, modern "pop" on mouse clicks on buttons, synthesised with
 * the Web Audio API (no sound file to load or license). The audio context starts
 * on the first click, as browsers require. Touch and keyboard presses stay silent,
 * and so do clicks on disabled buttons.
 */
export function ClickSound() {
  useEffect(() => {
    let ctx: AudioContext | null = null;

    const tick = () => {
      ctx ??= new AudioContext();
      if (ctx.state === "suspended") void ctx.resume();
      const t = ctx.currentTime;
      // A soft "pop": a short sine whose pitch lifts quickly, with a rounded fade,
      // like a gentle bubble or a light key press.
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(980, t + 0.035);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.09, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const el = (e.target as Element | null)?.closest?.(BUTTONS);
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
