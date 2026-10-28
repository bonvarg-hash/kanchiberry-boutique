"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/products";
import {
  ANSWERS_KEY,
  BUDGETS,
  COLOURS,
  EMPTY_ANSWERS,
  LOOKS,
  OCCASIONS,
  WHO,
  budgetCount,
  lookImage,
  plainDescription,
  recommend,
  suitableFor,
  type Answers,
  type Result,
} from "@/lib/gifting";

type Key = keyof Answers;
const STEPS: { key: Key; title: string; hint: string }[] = [
  { key: "who", title: "Who are you celebrating?", hint: "This helps us choose the right feel." },
  { key: "occasion", title: "What’s the occasion?", hint: "So the saree suits the moment." },
  { key: "look", title: "What kind of look would she love?", hint: "Go with your instinct about her style." },
  { key: "colour", title: "What colour would she love?", hint: "Pick her favourite, or leave it to us." },
  { key: "budget", title: "What’s your budget?", hint: "Every range has beautiful options." },
];

function load(): { answers: Answers; step: number } {
  try {
    const raw = sessionStorage.getItem(ANSWERS_KEY);
    if (raw) return { answers: { ...EMPTY_ANSWERS, ...JSON.parse(raw).answers }, step: JSON.parse(raw).step ?? 0 };
  } catch {
    /* fresh start */
  }
  return { answers: EMPTY_ANSWERS, step: 0 };
}

/**
 * The gift finder: five plain-language questions, one per screen on phones, then
 * a short selection of real sarees from the catalogue with a note on why each was
 * chosen. Answers are kept for this visit, so Back, refresh and returning from a
 * saree all keep them. Step 5 is the last question; step 5 (index) shows results.
 */
export default function GiftFinderPage() {
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [restored, setRestored] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const s = load();
    setAnswers(s.answers);
    setStep(s.step);
    setRestored(true);
  }, []);
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(ANSWERS_KEY, JSON.stringify({ answers, step }));
    } catch {
      /* not essential */
    }
  }, [answers, step, restored]);
  // Move focus to each new question for keyboard and screen-reader users.
  useEffect(() => {
    if (restored) heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, restored]);

  const showResults = step >= STEPS.length;
  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const choose = (key: Key, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    // A short pause so the choice registers, then on to the next question.
    window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length)), 280);
  };
  const skip = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => {
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
  };

  if (!restored) return <div className="wrap min-h-[70vh]" aria-busy="true" />;

  return (
    <div className="wrap pb-40 pt-10 max-md:pb-44 max-md:pt-6 lg:pt-14">
      <title>Find the Perfect Gift · Kanchiberry</title>
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/gifting" className="inline-flex min-h-11 items-center gap-2 text-[14px] text-ink-soft hover:text-ink">
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden /> Gifting
        </Link>
        <p className="text-[13px] text-ink-soft" aria-live="polite">
          {showResults ? "Your selection" : `Step ${step + 1} of ${STEPS.length}`}
        </p>
      </div>
      <div className="mt-3 h-[3px] w-full bg-sand-soft" aria-hidden>
        <div className="h-full bg-[#87264D] transition-[width] duration-500 ease-[var(--ease-cloth)]" style={{ width: `${(Math.min(step, STEPS.length) / STEPS.length) * 100}%` }} />
      </div>

      {showResults ? (
        <Results answers={answers} onEdit={(i) => setStep(i)} onRestart={restart} headingRef={heading} />
      ) : (
        <section aria-labelledby="q-title" className="gift-step mt-10 max-md:mt-8" key={current.key}>
          <h1 id="q-title" ref={heading} tabIndex={-1} className="text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] outline-none max-md:text-[30px]" style={{ fontFamily: "var(--font-title)" }}>
            {current.title}
          </h1>
          <p className="mt-3 text-[16px] text-ink-soft">{current.hint}</p>
          <div className="mt-10 max-md:mt-8">
            <Options stepKey={current.key} value={answers[current.key]} onChoose={(v) => choose(current.key, v)} />
          </div>
        </section>
      )}

      {/* Back / Skip / Continue: a sticky bar above the tab bar on phones, inline below on desktop. */}
      {!showResults && (
        <div className="gift-nav">
          <button type="button" className="btn btn-ghost min-h-12!" onClick={back} disabled={step === 0}>
            Back
          </button>
          <div className="flex items-center gap-2">
            <button type="button" className="min-h-12 px-4 text-[14px] text-ink-soft underline-offset-4 hover:text-ink hover:underline" onClick={skip}>
              Skip
            </button>
            <button type="button" className="btn btn-primary min-h-12!" onClick={skip} disabled={!answers[current.key]}>
              {step === STEPS.length - 1 ? "See Her Gifts" : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Answer options ---------- */

function Options({ stepKey, value, onChoose }: { stepKey: Key; value: string | null; onChoose: (v: string) => void }) {
  const card = (id: string, children: React.ReactNode, className = "") => (
    <button key={id} type="button" role="radio" aria-checked={value === id} onClick={() => onChoose(id)} className={`gift-option ${className}`}>
      {children}
      {value === id && (
        <span className="gift-option-check" aria-hidden>
          <Check size={14} strokeWidth={2.2} />
        </span>
      )}
    </button>
  );

  if (stepKey === "who")
    return (
      <div role="radiogroup" aria-labelledby="q-title" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {WHO.map((w) => card(w.id, <span className="text-[20px] md:text-[24px]" style={{ fontFamily: "var(--font-title)" }}>{w.label}</span>, "min-h-28 md:min-h-40"))}
      </div>
    );
  if (stepKey === "occasion")
    return (
      <div role="radiogroup" aria-labelledby="q-title" className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {OCCASIONS.map((o) => card(o.id, <span className="text-[19px] md:text-[22px]" style={{ fontFamily: "var(--font-title)" }}>{o.label}</span>, "min-h-24 md:min-h-32"))}
      </div>
    );
  if (stepKey === "look")
    return (
      <div role="radiogroup" aria-labelledby="q-title" className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {LOOKS.map((l) => {
          const img = lookImage(l.id);
          return card(
            l.id,
            <>
              <span className="block aspect-[4/5] w-full overflow-hidden bg-sand-soft">
                <img src={img.src} alt="" className="size-full object-cover" loading="lazy" />
              </span>
              <span className="mt-3 block px-1 text-left text-[16px] leading-tight">{l.label}</span>
              <span className="mt-1 block px-1 pb-1 text-left text-[13px] leading-snug text-ink-soft">{l.line}</span>
            </>,
            "gift-option-photo",
          );
        })}
      </div>
    );
  if (stepKey === "colour")
    return (
      <div role="radiogroup" aria-labelledby="q-title" className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-9">
        {COLOURS.map((c) =>
          card(
            c.id,
            <>
              <span className="mx-auto block size-14 rounded-full ring-1 ring-black/10 md:size-16" style={{ background: c.swatch }} aria-hidden />
              <span className="mt-3 block text-center text-[14px] leading-tight">{c.label}</span>
            </>,
            "py-5",
          ),
        )}
      </div>
    );
  return (
    <div role="radiogroup" aria-labelledby="q-title" className="grid gap-3 md:grid-cols-5 md:gap-4">
      {BUDGETS.map((b) =>
        card(
          b.id,
          <>
            <span className="text-[20px]" style={{ fontFamily: "var(--font-title)" }}>{b.label}</span>
            <span className="mt-1 block text-[13px] text-ink-soft">{budgetCount(b.id)} sarees</span>
          </>,
          "min-h-24 md:min-h-32",
        ),
      )}
    </div>
  );
}

/* ---------- Results ---------- */

function Results({
  answers,
  onEdit,
  onRestart,
  headingRef,
}: {
  answers: Answers;
  onEdit: (step: number) => void;
  onRestart: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    // A brief moment to "choose" feels considered; the work itself is instant.
    const t = window.setTimeout(() => {
      try {
        setResult(recommend(answers));
      } catch {
        setError(true);
      }
      setLoading(false);
    }, 650);
    return () => window.clearTimeout(t);
  }, [answers, attempt]);

  const summary = useMemo(() => {
    const parts: { label: string; step: number }[] = [];
    const w = WHO.find((x) => x.id === answers.who);
    const o = OCCASIONS.find((x) => x.id === answers.occasion);
    const l = LOOKS.find((x) => x.id === answers.look);
    const c = COLOURS.find((x) => x.id === answers.colour);
    const b = BUDGETS.find((x) => x.id === answers.budget);
    if (w) parts.push({ label: w.label, step: 0 });
    if (o) parts.push({ label: o.label, step: 1 });
    if (l) parts.push({ label: l.label, step: 2 });
    if (c) parts.push({ label: c.label, step: 3 });
    if (b) parts.push({ label: b.label, step: 4 });
    return parts;
  }, [answers]);

  const her = WHO.find((x) => x.id === answers.who)?.her ?? "her";

  return (
    <section aria-labelledby="res-title" className="mt-10 max-md:mt-8">
      <h1 id="res-title" ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] outline-none max-md:text-[30px]" style={{ fontFamily: "var(--font-title)" }}>
        Sarees we think {her === "her" ? "she’ll" : `${her} will`} love
      </h1>
      {/* Answers, each a quick way back to change it */}
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Your answers">
        {summary.map((s) => (
          <li key={s.label}>
            <button type="button" className="search-tag" onClick={() => onEdit(s.step)} aria-label={`Change: ${s.label}`}>
              {s.label}
            </button>
          </li>
        ))}
        <li>
          <button type="button" className="inline-flex min-h-10 items-center gap-1.5 px-2 text-[14px] text-ink-soft underline-offset-4 hover:text-ink hover:underline" onClick={onRestart}>
            <RotateCcw size={14} strokeWidth={1.6} aria-hidden /> Start again
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="mt-10" aria-busy="true" aria-live="polite">
          <p className="text-[15px] text-ink-soft">Finding sarees {her === "her" ? "she’ll" : `${her} will`} love…</p>
          <div className="mt-6 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="gift-skeleton aspect-[4/5]" />
                <div className="gift-skeleton mt-4 h-5 w-2/3" />
                <div className="gift-skeleton mt-2 h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      ) : error || !result ? (
        <div className="empty-state mt-10" role="alert">
          <p className="empty-state-title">Something went wrong</p>
          <p className="empty-state-text">We couldn&rsquo;t put your selection together. Please try again.</p>
          <button type="button" className="btn btn-primary mt-7" onClick={() => setAttempt((n) => n + 1)}>
            Try Again
          </button>
        </div>
      ) : result.picks.length === 0 ? (
        <div className="empty-state mt-10">
          <p className="empty-state-title">No sarees available right now</p>
          <p className="empty-state-text">Please check back soon, or browse the full collection.</p>
          <Link href="/shop" className="btn btn-primary mt-7">
            Explore All Sarees
          </Link>
        </div>
      ) : (
        <>
          {result.relaxed.length > 0 && (
            <p className="note note-plain mt-6 max-w-2xl">
              <span>
                <strong className="font-medium text-ink">A few close matches included.</strong> To give you a good choice we&rsquo;ve widened {result.relaxed.join(" and ")}.
              </span>
            </p>
          )}
          <p className="sr-only" aria-live="polite">
            {result.picks.length} sarees chosen for {her}.
          </p>
          <ul className="mt-10 grid gap-x-6 gap-y-14 max-md:mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {result.picks.map(({ product: p, badge, why }, i) => (
              <li key={p.slug} className="flex flex-col">
                <Link href={`/sarees/${p.slug}?gift=1`} className="group relative block overflow-hidden bg-sand-soft" aria-label={`${p.name}: choose this gift`}>
                  <img src={p.images[0].src} alt={p.images[0].alt} loading={i < 3 ? "eager" : "lazy"} className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-cloth)] group-hover:scale-[1.03]" />
                  <span className="absolute left-3 top-3 bg-[#F3F4EF]/95 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-ink">{badge}</span>
                </Link>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h2 className="text-[20px] leading-tight">{p.name}</h2>
                  <p className="shrink-0 text-[16px] tabular-nums">
                    {formatPrice(p.price)}
                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                      <s className="ml-2 text-[13px] text-ink-soft">
                        <span className="sr-only">Was </span>
                        {formatPrice(p.compareAtPrice)}
                      </s>
                    )}
                  </p>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{plainDescription(p)}</p>
                <p className="mt-2 text-[13px] text-ink-soft">
                  <span className="text-ink">Lovely for:</span> {suitableFor(p)}
                </p>
                <p className="mt-3 border-l-2 border-[#87264D]/40 pl-3 text-[14px] leading-relaxed">{why}</p>
                <Link href={`/sarees/${p.slug}?gift=1`} className="btn btn-primary mt-5 w-full">
                  Choose This Gift
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-16 text-center">
            <p className="text-[15px] text-ink-soft">Not quite right?</p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
              <button type="button" className="text-link" onClick={() => onEdit(2)}>
                Try a different look
              </button>
              <Link href="/shop" className="text-link">
                Explore All Sarees <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
