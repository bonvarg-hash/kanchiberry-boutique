"use client";

import { Music2, Pause, Play, X } from "lucide-react";
import { useMusic } from "./MusicProvider";

/**
 * Play/pause for the site's festive track; the track itself lives in MusicProvider.
 * With `hint`, it also shows a small "tap for music" prompt beneath it while the
 * browser is waiting for a first click or tap before it will allow sound.
 */
export function MusicToggle({ className = "icon-btn", hint = false }: { className?: string; hint?: boolean }) {
  const { playing, toggle, needsTap, dismiss } = useMusic();
  return (
    <span className="relative inline-grid">
      <button
        type="button"
        className={`${className} music-btn`}
        aria-pressed={playing}
        aria-label={playing ? "Pause music" : "Play music"}
        title={playing ? "Pause music" : "Play music"}
        onClick={toggle}
        data-playing={playing || undefined}
      >
        {playing ? <Pause size={18} strokeWidth={1.5} /> : <Play size={18} strokeWidth={1.5} />}
      </button>
      {hint && needsTap && !playing && (
        <span className="music-hint" role="status">
          <button type="button" className="music-hint-play" onClick={toggle}>
            <Music2 size={14} strokeWidth={1.6} aria-hidden /> Tap for festive music
          </button>
          <button type="button" className="music-hint-close" aria-label="No music, thanks" onClick={dismiss}>
            <X size={13} strokeWidth={1.6} aria-hidden />
          </button>
        </span>
      )}
    </span>
  );
}
