"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const TRACK = "/audio/festive-theme.m4a";
const VOLUME = 0.35;
/** Set once the visitor pauses the music, so scrolling doesn't start it again. */
const OFF_KEY = "kb.music.off";

const readOff = () => {
  try {
    return localStorage.getItem(OFF_KEY) === "1";
  } catch {
    return false;
  }
};
const writeOff = (off: boolean) => {
  try {
    if (off) localStorage.setItem(OFF_KEY, "1");
    else localStorage.removeItem(OFF_KEY);
  } catch {}
};

/**
 * Header play/pause for the festive background track. It starts on the
 * visitor's first scroll, or whenever they press play. The track loops, fades in
 * and out instead of cutting, and pauses while the tab is hidden, picking up
 * again on return. Pausing it is remembered, so it won't start on scroll again.
 *
 * Browsers only allow sound after the visitor has interacted with the page. A
 * swipe on a phone counts; a mouse-wheel scroll doesn't, so on desktop the music
 * starts on the first scroll after any click or key press.
 */
export function MusicToggle() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<number>(0);
  const [playing, setPlaying] = useState(false);

  const fadeTo = (target: number, done?: () => void) => {
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
  };

  /** Resolves true once the track is playing, false if the browser blocked it. */
  const play = () => {
    audio.current ??= Object.assign(new Audio(TRACK), { loop: true, volume: 0 });
    return audio.current.play().then(
      () => {
        setPlaying(true);
        fadeTo(VOLUME);
        return true;
      },
      () => {
        setPlaying(false);
        return false;
      },
    );
  };
  const pause = () => {
    setPlaying(false);
    fadeTo(0, () => audio.current?.pause());
  };

  // Start on the first scroll, unless the visitor has paused it before. If the
  // browser blocks sound (no click or tap yet), try again on the next scroll.
  const playRef = useRef(play);
  playRef.current = play;
  useEffect(() => {
    if (readOff()) return;
    let trying = false;
    const events = ["scroll", "touchend"] as const;
    const stop = () => events.forEach((e) => window.removeEventListener(e, onScroll));
    function onScroll() {
      if (trying) return;
      trying = true;
      void playRef.current().then((ok) => {
        trying = false;
        if (ok) stop();
      });
    }
    events.forEach((e) => window.addEventListener(e, onScroll, { passive: true }));
    return stop;
  }, []);

  // Hold the music while the tab is in the background.
  useEffect(() => {
    if (!playing) return;
    const onVisibility = () => {
      const a = audio.current;
      if (!a) return;
      if (document.hidden) a.pause();
      else void a.play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing]);

  useEffect(
    () => () => {
      cancelAnimationFrame(fade.current);
      audio.current?.pause();
    },
    [],
  );

  return (
    <button
      type="button"
      className="icon-btn music-btn"
      aria-pressed={playing}
      aria-label={playing ? "Pause music" : "Play music"}
      title={playing ? "Pause music" : "Play music"}
      onClick={() => {
        if (playing) {
          writeOff(true);
          pause();
        } else {
          writeOff(false);
          void play();
        }
      }}
      data-playing={playing || undefined}
    >
      {playing ? <Pause size={18} strokeWidth={1.5} /> : <Play size={18} strokeWidth={1.5} />}
    </button>
  );
}
