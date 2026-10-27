"use client";

import { useEffect, useState } from "react";

export const RAIL_COUNT_EVENT = "kb:rail-count";

/** "12 sarees on the rail · this week", counting the sarees actually hanging at this width. */
export function RailEyebrow({ initial }: { initial: number }) {
  const [count, setCount] = useState(initial);
  useEffect(() => {
    const on = (e: Event) => setCount((e as CustomEvent<number>).detail);
    window.addEventListener(RAIL_COUNT_EVENT, on);
    return () => window.removeEventListener(RAIL_COUNT_EVENT, on);
  }, []);
  return (
    <p className="eyebrow mb-4">
      {count} sarees on the rail · this week
    </p>
  );
}
