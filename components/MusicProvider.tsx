"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const TRACK = "/audio/festive-theme.m4a";
const VOLUME = 0.35;
/** Set for the rest of the visit once the visitor pauses, so scrolling doesn't restart it. */
const OFF_KEY = "kb.music.off";
/** Where the track was, so a full page reload carries on from the same moment. */
const AT_KEY = "kb.music.at";

const session = {
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) sessionStorage.removeItem(k);
      else sessionStorage.setItem(k, v);
    } catch {}
  },
};

type Music = { playing: boolean; toggle: () => void };
const MusicContext = createContext<Music>({ playing: false, toggle: () => {} });
export const useMusic = () => useContext(MusicContext);

/**
 * One festive track for the whole site. It lives in the root layout, so it keeps
 * playing as visitors move between pages. It starts as soon as the browser
 * allows (on landing, or on the first scroll, click, tap or key press), loops,
 * fades in and out, and holds while the tab is hidden.
 * Pausing is remembered for the rest of the visit; a new visit starts on scroll
 * again.
 *
 * Browsers only allow sound after the visitor has interacted with the page. A
 * swipe on a phone counts; a mouse-wheel scroll doesn't, so on desktop the music
 * usually starts on the first click or key press.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef(0);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  playingRef.current = playing;

  const fadeTo = useCallback((target: number, done?: () => void) => {
    const a = audio.current;
    if (!a) return;
    cancelAnimationFrame(fade.current);
    const from = a.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 600);
      a.volume = from + (target - from) * t;
      if (t < 1) fade.current = requestAnimationFrame(step);
      else done?.();
    };
    fade.current = requestAnimationFrame(step);
  }, []);

  /** Resolves true once the track is playing, false if the browser blocked it. */
  const play = useCallback(() => {
    if (!audio.current) {
      audio.current = Object.assign(new Audio(TRACK), { loop: true, volume: 0 });
      const at = Number(session.get(AT_KEY));
      if (at > 0) audio.current.currentTime = at;
    }
    return audio.current.play().then(
      () => {
        setPlaying(true);
        fadeTo(VOLUME);
        return true;
      },
      () => false,
    );
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playingRef.current) {
      session.set(OFF_KEY, "1");
      setPlaying(false);
      fadeTo(0, () => audio.current?.pause());
    } else {
      session.set(OFF_KEY, null);
      void play();
    }
  }, [fadeTo, play]);

  // Autoplay as early as the browser allows, unless paused earlier in this visit:
  // straight away on landing (some browsers permit it for returning visitors),
  // then on the first scroll, swipe, click, tap or key press. A blocked attempt
  // is simply retried on the next one.
  useEffect(() => {
    if (session.get(OFF_KEY)) return;
    let trying = false;
    const events = ["scroll", "wheel", "touchend", "pointerdown", "keydown"] as const;
    const stop = () => events.forEach((e) => window.removeEventListener(e, attempt, true));
    function attempt(e?: Event) {
      if (trying || playingRef.current) return;
      // A press on the music button is the visitor choosing; let the button handle it.
      if ((e?.target as Element | null)?.closest?.(".music-btn")) return;
      trying = true;
      void play().then((ok) => {
        trying = false;
        if (ok) stop();
      });
    }
    events.forEach((e) => window.addEventListener(e, attempt, { passive: true, capture: true }));
    attempt();
    return stop;
  }, [play]);

  // Hold the music while the tab is in the background; remember the spot on leaving.
  useEffect(() => {
    const onVisibility = () => {
      const a = audio.current;
      if (!a || !playingRef.current) return;
      if (document.hidden) a.pause();
      else void a.play();
    };
    const onLeave = () => {
      if (audio.current) session.set(AT_KEY, String(audio.current.currentTime));
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onLeave);
      cancelAnimationFrame(fade.current);
      audio.current?.pause();
    };
  }, []);

  const value = useMemo(() => ({ playing, toggle }), [playing, toggle]);
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
