"use client";

import { Pause, Play } from "lucide-react";
import { useMusic } from "./MusicProvider";

/** Play/pause for the site's festive track; the track itself lives in MusicProvider. */
export function MusicToggle({ className = "icon-btn" }: { className?: string }) {
  const { playing, toggle } = useMusic();
  return (
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
  );
}
