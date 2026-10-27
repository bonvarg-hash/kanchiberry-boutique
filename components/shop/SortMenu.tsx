"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

/**
 * Sort picker styled like the rest of the site in place of the native select:
 * a quiet button that opens a paper panel of options. Works as a listbox:
 * arrows, Home and End move, Enter or Space picks, Escape or a click outside
 * closes.
 */
export function SortMenu<K extends string>({
  value,
  options,
  onChange,
}: {
  value: K;
  options: Record<K, string>;
  onChange: (key: K) => void;
}) {
  const keys = Object.keys(options) as K[];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, keys.indexOf(value)));
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const show = () => {
    setActive(Math.max(0, keys.indexOf(value)));
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  };
  const pick = (k: K) => {
    onChange(k);
    close();
  };

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    const last = keys.length - 1;
    const moves: Record<string, number> = { ArrowDown: Math.min(last, active + 1), ArrowUp: Math.max(0, active - 1), Home: 0, End: last };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(keys[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close(false);
    }
  };

  return (
    <div ref={root} className="sort-menu">
      <button
        ref={button}
        type="button"
        className="sort-menu-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => (open ? close() : show())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            show();
          }
        }}
      >
        <span id={`${id}-label`} className="text-ink-soft">
          Sort
        </span>
        <span id={`${id}-value`}>{options[value]}</span>
        <ChevronDown size={16} strokeWidth={1.5} aria-hidden className="sort-menu-chevron" />
      </button>
      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${active}`}
          className="sort-menu-list"
          onKeyDown={onListKey}
        >
          {keys.map((k, i) => (
            <li
              key={k}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={k === value}
              data-active={i === active || undefined}
              className="sort-menu-option"
              onPointerEnter={() => setActive(i)}
              onClick={() => pick(k)}
            >
              {options[k]}
              {k === value && <Check size={15} strokeWidth={1.6} aria-hidden />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
