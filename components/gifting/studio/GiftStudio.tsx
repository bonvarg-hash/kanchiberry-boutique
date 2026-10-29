"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Cake, Check, Gem, Heart, Pencil, RotateCcw, Sparkles, Sun, SkipForward } from "lucide-react";
import { formatPrice, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { MESSAGE_SUGGESTIONS, PACKAGING, deliveryWindow, type Packaging } from "@/lib/gifting";
import {
  BUDGET_TIERS,
  CARD_DESIGNS,
  EMPTY_JOURNEY,
  GIFT_OCCASIONS,
  PERSONALITIES,
  RIBBONS,
  SMILES,
  STUDIO_KEY,
  curate,
  type Journey,
} from "@/lib/giftExperience";
import type { GiftSceneProps, StageMode } from "./GiftScene";

const GiftScene = dynamic(() => import("./GiftScene"), { ssr: false });

type Phase = "landing" | "discover" | "choose" | "customize" | "unbox" | "reveal";

interface Recipient {
  name: string;
  phone: string;
  address: string;
  city: string;
  pin: string;
}
interface StudioState {
  phase: Phase;
  step: number;
  journey: Journey;
  focus: number;
  chosen: string | null;
  packaging: Packaging;
  ribbon: string;
  cardDesign: string;
  message: string;
  from: string;
  recipient: Recipient;
  hidePrice: boolean;
}
const INITIAL: StudioState = {
  phase: "landing",
  step: 0,
  journey: EMPTY_JOURNEY,
  focus: 0,
  chosen: null,
  packaging: "signature",
  ribbon: RIBBONS[0].id,
  cardDesign: CARD_DESIGNS[0].id,
  message: "",
  from: "",
  recipient: { name: "", phone: "", address: "", city: "", pin: "" },
  hidePrice: true,
};
const MAX_NOTE = 220;
const TITLE = { fontFamily: "var(--font-title)" } as const;

const QUESTIONS = [
  { key: "personality", title: "What kind of woman is she?", hint: "Go with your heart." },
  { key: "smile", title: "What makes her smile?", hint: "The little things say the most." },
  { key: "occasion", title: "What’s the occasion?", hint: "So it suits the moment." },
  { key: "budget", title: "What would you like to spend?", hint: "Every range has something beautiful." },
] as const;

const OCCASION_ICON = { birthday: Cake, anniversary: Heart, wedding: Gem, festival: Sun, "just-because": Sparkles } as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

/**
 * The gift studio: a landing with a 3D gift box, four visual questions, the
 * curated sarees floating over the box, wrapping and a message card, a
 * cinematic unboxing, and the finished gift added to the bag for checkout.
 * Progress is kept for this visit (sessionStorage), so refresh and Back are safe.
 */
export default function GiftStudio() {
  const [s, setS] = useState<StudioState>(INITIAL);
  const [restored, setRestored] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [chooseRun, setChooseRun] = useState(0);
  const [unboxRun, setUnboxRun] = useState(0);
  const [skipRun, setSkipRun] = useState(0);
  const [peek, setPeek] = useState(false);
  const swipeX = useRef(0);
  const reduced = useReducedMotion();
  const set = (patch: Partial<StudioState>) => setS((x) => ({ ...x, ...patch }));

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STUDIO_KEY);
      if (raw) {
        const saved = { ...INITIAL, ...JSON.parse(raw) } as StudioState;
        if (saved.phase === "unbox") saved.phase = "customize";
        if (saved.chosen && !getProduct(saved.chosen)) Object.assign(saved, { chosen: null, phase: "choose" });
        setS(saved);
      }
    } catch {
      /* fresh start */
    }
    setWebgl(hasWebGL());
    setRestored(true);
  }, []);
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STUDIO_KEY, JSON.stringify(s));
    } catch {
      /* not essential */
    }
  }, [s, restored]);
  useEffect(() => {
    if (restored) window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [s.phase, restored, reduced]);

  const picks = useMemo(() => (s.journey.budget ? curate(s.journey) : []), [s.journey]);
  const chosen = s.chosen ? getProduct(s.chosen) ?? null : null;
  const design = CARD_DESIGNS.find((c) => c.id === s.cardDesign) ?? CARD_DESIGNS[0];
  const ribbonHex = RIBBONS.find((r) => r.id === s.ribbon)?.hex ?? RIBBONS[0].hex;

  if (!restored) return <div className="studio-bg min-h-[80vh]" aria-busy="true" />;

  const stageMode: StageMode | null = s.phase === "landing" ? "hero" : s.phase === "discover" ? null : s.phase;
  const sceneProps: GiftSceneProps = {
    mode: stageMode ?? "hero",
    sarees: s.phase === "choose" ? picks.map((p) => p.product.images[0].src) : [],
    focus: s.focus,
    onFocus: (i) => set({ focus: i }),
    chosenSrc: s.phase === "choose" ? (chooseRun ? picks[s.focus]?.product.images[0].src ?? null : null) : (chosen?.images[0].src ?? null),
    chooseRun,
    onChosen: () => {
      set({ chosen: picks[s.focus].product.slug, phase: "customize" });
      setChooseRun(0);
    },
    packaging: s.packaging,
    ribbon: ribbonHex,
    card: { paper: design.paper, ink: design.ink, accent: design.accent, message: s.message, from: s.from },
    open: peek,
    unboxRun,
    skipRun,
    onUnboxed: () => set({ phase: "reveal" }),
    onBoxClick: () => {
      if (s.phase === "unbox" && !unboxRun) setUnboxRun(1);
    },
    reduced,
    onReady: () => setSceneReady(true),
  };

  const stage = (className: string, overlay?: ReactNode) => (
    <div className={`relative ${className}`}>
      {webgl ? (
        <>
          <GiftScene {...sceneProps} onError={() => setWebgl(false)} />
          {!sceneReady && (
            <div className="absolute inset-0 grid place-items-center" aria-live="polite">
              <span className="studio-loader" aria-label="Preparing the gift box" />
            </div>
          )}
        </>
      ) : (
        <StageFallback state={s} picks={picks.map((p) => p.product.images[0].src)} chosenSrc={chosen?.images[0].src} design={design} />
      )}
      {overlay}
    </div>
  );

  /* ---------- Landing ---------- */
  if (s.phase === "landing")
    return (
      <div className="studio-bg overflow-hidden pb-28 max-md:pb-24">
        <section aria-labelledby="studio-title" className="wrap grid items-center gap-6 pt-14 md:min-h-[78vh] md:grid-cols-[1fr_1.1fr] max-md:pt-8 lg:pt-16">
          <div className="studio-in">
            <p className="eyebrow">Gifting</p>
            <h1 id="studio-title" className="mt-4 text-[clamp(2.4rem,5.4vw,5.2rem)] leading-[1] tracking-[-0.015em] max-md:text-[38px]" style={TITLE}>
              You don&rsquo;t need to know sarees.
              <em className="mt-2 block text-[#87264D]">You just need to know her.</em>
            </h1>
            <p className="mt-6 max-w-[40ch] text-[17px] leading-relaxed text-ink-soft max-md:mt-4 max-md:text-[16px]">Let&rsquo;s find something she&rsquo;ll love.</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 max-md:mt-7">
              <button type="button" className="studio-cta max-sm:w-full" onClick={() => set({ phase: "discover", step: 0 })}>
                Let&rsquo;s Make Her Day <ArrowRight size={18} strokeWidth={1.6} aria-hidden />
              </button>
              <Link href="/shop" className="text-link">
                Explore All Sarees <span aria-hidden>→</span>
              </Link>
            </div>
            <p className="mt-6 text-[13px] text-ink-soft">Four quick taps, then choose, wrap and unbox her gift.</p>
          </div>
          {stage("h-[clamp(340px,62vh,640px)] max-md:-mx-(--wrap-pad) max-md:h-[360px]", (
            <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[12px] tracking-[0.12em] text-ink-soft uppercase">{webgl ? "Drag to turn the box" : ""}</p>
          ))}
        </section>
        <ul className="wrap mt-6 grid gap-6 text-[14px] text-ink-soft sm:grid-cols-3">
          {[
            ["Real sarees, chosen for her", "Every pick is from our collection, with a note on why it suits her."],
            ["Wrapped your way", "Signature box, ribbon colour and a card in your words."],
            ["Free delivery in India", `Arrives ${deliveryWindow()}, price kept private if you like.`],
          ].map(([t, d]) => (
            <li key={t} className="border-t border-sand pt-4">
              <span className="block text-[15px] text-ink">{t}</span>
              <span className="mt-1 block leading-relaxed">{d}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  /* ---------- Discovery ---------- */
  if (s.phase === "discover") {
    const q = QUESTIONS[s.step];
    const value = s.journey[q.key];
    const choose = (v: string) => {
      const journey = { ...s.journey, [q.key]: v };
      setS((x) => ({ ...x, journey }));
      window.setTimeout(
        () => setS((x) => (x.step < QUESTIONS.length - 1 ? { ...x, step: x.step + 1 } : { ...x, phase: "choose", focus: 0, chosen: null })),
        reduced ? 0 : 320,
      );
    };
    const back = () => (s.step === 0 ? set({ phase: "landing" }) : set({ step: s.step - 1 }));
    return (
      <div className="studio-bg min-h-[80vh] pb-36 max-md:pb-32">
        <div className="wrap pt-8 max-md:pt-5">
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={back} className="inline-flex min-h-11 items-center gap-2 text-[14px] text-ink-soft hover:text-ink">
              <ArrowLeft size={16} strokeWidth={1.5} aria-hidden /> Back
            </button>
            <p className="text-[13px] text-ink-soft" aria-live="polite">
              {s.step + 1} of {QUESTIONS.length}
            </p>
          </div>
          <ol className="mt-3 grid grid-cols-4 gap-1.5" aria-label="Progress">
            {QUESTIONS.map((x, i) => (
              <li key={x.key}>
                <button
                  type="button"
                  disabled={i > s.step && !s.journey[QUESTIONS[i - 1]?.key]}
                  onClick={() => set({ step: i })}
                  aria-label={`Question ${i + 1}: ${x.title}`}
                  aria-current={i === s.step ? "step" : undefined}
                  className="block h-6 w-full disabled:cursor-default"
                >
                  <span className={`block h-[3px] w-full transition-colors duration-500 ${i <= s.step ? "bg-[#87264D]" : "bg-[#e2d6c3]"}`} />
                </button>
              </li>
            ))}
          </ol>
          <section key={q.key} aria-labelledby="q-title" className="studio-in mt-8 max-md:mt-5">
            <h1 id="q-title" className="text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] max-md:text-[30px]" style={TITLE}>
              {q.title}
            </h1>
            <p className="mt-3 text-[16px] text-ink-soft">{q.hint}</p>
            <div role="radiogroup" aria-labelledby="q-title" className="mt-8 max-md:mt-6">
              {q.key === "personality" && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                  {PERSONALITIES.map((p, i) => (
                    <Card key={p.id} on={value === p.id} onClick={() => choose(p.id)} i={i} className="p-0!">
                      <span className="block aspect-[4/5] w-full overflow-hidden">
                        <img src={p.image.src} alt="" className="studio-card-img size-full object-cover" />
                      </span>
                      <span className="block p-4 text-left max-md:p-3">
                        <span className="block text-[20px] leading-tight max-md:text-[17px]" style={TITLE}>
                          {p.label}
                        </span>
                        <span className="mt-1 block text-[13px] leading-snug text-ink-soft">{p.line}</span>
                      </span>
                    </Card>
                  ))}
                </div>
              )}
              {q.key === "smile" && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                  {SMILES.map((m, i) => (
                    <Card key={m.id} on={value === m.id} onClick={() => choose(m.id)} i={i}>
                      <span className="studio-orb mx-auto block size-24 rounded-full max-md:size-20" style={{ background: m.art }} aria-hidden />
                      <span className="mt-5 block text-center text-[20px] leading-tight max-md:text-[17px]" style={TITLE}>
                        {m.label}
                      </span>
                      <span className="mt-1 block text-center text-[13px] text-ink-soft">{m.line}</span>
                    </Card>
                  ))}
                </div>
              )}
              {q.key === "occasion" && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5 [&>*:last-child]:max-md:col-span-2">
                  {GIFT_OCCASIONS.map((o, i) => {
                    const Icon = OCCASION_ICON[o.id];
                    return (
                      <Card key={o.id} on={value === o.id} onClick={() => choose(o.id)} i={i} className="min-h-36 md:min-h-48">
                        <Icon size={34} strokeWidth={1.1} className="studio-icon mx-auto text-[#87264D]" aria-hidden />
                        <span className="mt-4 block text-center text-[21px]" style={TITLE}>
                          {o.label}
                        </span>
                      </Card>
                    );
                  })}
                </div>
              )}
              {q.key === "budget" && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                  {BUDGET_TIERS.map((b, i) => (
                    <Card key={b.id} on={value === b.id} onClick={() => choose(b.id)} i={i} className="min-h-40">
                      {/* Boxes that grow with the tier */}
                      <span className="flex h-16 items-end justify-center gap-1.5" aria-hidden>
                        {Array.from({ length: b.level }, (_, k) => (
                          <span key={k} className="studio-box" style={{ height: 22 + k * 10, width: 22 + k * 8 }} />
                        ))}
                      </span>
                      <span className="mt-4 block text-center text-[19px] leading-tight tabular-nums">{b.label}</span>
                      <span className="mt-1 block text-center text-[13px] text-ink-soft">{b.count} sarees</span>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  /* ---------- Choose ---------- */
  if (s.phase === "choose") {
    const pick = picks[s.focus];
    const go = (d: number) => set({ focus: (s.focus + d + picks.length) % picks.length });
    return (
      <div className="studio-bg pb-28">
        <div className="wrap flex items-center justify-between gap-4 pt-6">
          <button type="button" onClick={() => set({ phase: "discover", step: QUESTIONS.length - 1 })} className="inline-flex min-h-11 items-center gap-2 text-[14px] text-ink-soft hover:text-ink">
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden /> Change answers
          </button>
          <p className="text-[13px] text-ink-soft">{picks.length} sarees chosen for her</p>
        </div>
        <h1 className="wrap mt-2 text-[clamp(1.9rem,3.6vw,3rem)] leading-tight max-md:text-[28px]" style={TITLE}>
          We think she&rsquo;ll love these.
        </h1>
        <div
          onPointerDown={(e) => (swipeX.current = e.clientX)}
          onPointerUp={(e) => {
            const dx = e.clientX - swipeX.current;
            if (Math.abs(dx) > 50 && !chooseRun) go(dx < 0 ? 1 : -1);
          }}
          style={{ touchAction: "pan-y" }}
        >
          {stage("h-[clamp(420px,62vh,680px)] max-md:h-[460px]")}
        </div>
        {pick && (
          <div className="wrap -mt-6 max-md:-mt-4">
            <div key={pick.product.slug} className="studio-in studio-panel mx-auto max-w-2xl p-6 max-md:p-5" aria-live="polite">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[22px] leading-tight max-md:text-[19px]" style={TITLE}>
                    {pick.product.name}
                  </p>
                  <p className="mt-1 text-[15px] tabular-nums">{formatPrice(pick.product.price)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" className="studio-round" onClick={() => go(-1)} aria-label="Previous saree" disabled={!!chooseRun}>
                    <ArrowLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button type="button" className="studio-round" onClick={() => go(1)} aria-label="Next saree" disabled={!!chooseRun}>
                    <ArrowRight size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{pick.why}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <button
                  type="button"
                  className="studio-cta max-sm:w-full"
                  disabled={!!chooseRun}
                  onClick={() => (webgl ? setChooseRun((n) => n + 1) : set({ chosen: pick.product.slug, phase: "customize" }))}
                >
                  Choose This Saree <Check size={18} strokeWidth={1.6} aria-hidden />
                </button>
                <Link href={`/sarees/${pick.product.slug}`} className="text-link text-[14px]">
                  See every detail <span aria-hidden>→</span>
                </Link>
              </div>
              <p className="mt-4 flex justify-center gap-1.5" aria-hidden>
                {picks.map((p, i) => (
                  <span key={p.product.slug} className={`h-1.5 rounded-full transition-all ${i === s.focus ? "w-6 bg-[#87264D]" : "w-1.5 bg-[#d8ccb9]"}`} />
                ))}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------- Customize, unbox and reveal share the stage ---------- */
  const suggestions = MESSAGE_SUGGESTIONS[s.journey.occasion ?? "default"] ?? MESSAGE_SUGGESTIONS.default;
  const pack = PACKAGING.find((p) => p.id === s.packaging)!;

  return (
    <div className="studio-bg pb-28 max-md:pb-32">
      <div className="wrap grid gap-8 pt-6 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <div className="lg:sticky lg:top-20 lg:self-start">
          {stage(
            "h-[clamp(380px,72vh,720px)] max-lg:-mx-(--wrap-pad) max-md:h-[400px]",
            s.phase === "unbox" ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-3">
                {!unboxRun ? (
                  <>
                    <p className="studio-pulse rounded-full bg-[#190E14] px-5 py-2.5 text-[13px] tracking-[0.08em] text-white">{webgl ? "Tap the box to open it" : ""}</p>
                    {!webgl && (
                      <button type="button" className="studio-cta pointer-events-auto" onClick={() => set({ phase: "reveal" })}>
                        Open her gift
                      </button>
                    )}
                  </>
                ) : (
                  <button type="button" className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-white/85 px-4 text-[13px] backdrop-blur" onClick={() => setSkipRun((n) => n + 1)}>
                    <SkipForward size={15} strokeWidth={1.6} aria-hidden /> Skip
                  </button>
                )}
              </div>
            ) : s.phase === "customize" && webgl ? (
              <div className="absolute inset-x-0 bottom-3 flex justify-center">
                <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/85 px-4 text-[13px] backdrop-blur" onClick={() => setPeek((p) => !p)} aria-pressed={peek}>
                  {peek ? "Close the lid" : "Peek inside"}
                </button>
              </div>
            ) : null,
          )}
        </div>

        <div className="lg:pt-6">
          {s.phase === "customize" && chosen && (
            <section aria-labelledby="wrap-title" className="studio-in">
              <button type="button" onClick={() => set({ phase: "choose", chosen: null })} className="inline-flex min-h-11 items-center gap-2 text-[14px] text-ink-soft hover:text-ink">
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden /> Choose another saree
              </button>
              <h1 id="wrap-title" className="mt-2 text-[clamp(1.9rem,3.2vw,2.8rem)] leading-tight" style={TITLE}>
                Now, make it hers.
              </h1>
              <p className="mt-2 text-[15px] text-ink-soft">
                {chosen.name}, {formatPrice(chosen.price)}
              </p>

              <Field label="Packaging">
                <div className="grid grid-cols-2 gap-3">
                  {PACKAGING.map((p) => (
                    <button key={p.id} type="button" aria-pressed={s.packaging === p.id} onClick={() => set({ packaging: p.id })} className="studio-choice text-left">
                      <span className="block text-[15px]">{p.id === "signature" ? "Signature Box" : "Classic Box"}</span>
                      <span className="mt-1 block text-[12px] leading-snug text-ink-soft">{p.price ? `+ ${formatPrice(p.price)}` : "Included"}</span>
                    </button>
                  ))}
                </div>
              </Field>
              <Field label={`Ribbon · ${s.ribbon}`}>
                <div className="flex gap-3">
                  {RIBBONS.map((r) => (
                    <button key={r.id} type="button" aria-label={`${r.id} ribbon`} aria-pressed={s.ribbon === r.id} onClick={() => set({ ribbon: r.id })} className="studio-swatch" style={{ background: r.hex }} />
                  ))}
                </div>
              </Field>
              <Field label={`Card · ${s.cardDesign}`}>
                <div className="flex gap-3">
                  {CARD_DESIGNS.map((c) => (
                    <button key={c.id} type="button" aria-label={`${c.id} card`} aria-pressed={s.cardDesign === c.id} onClick={() => set({ cardDesign: c.id })} className="studio-cardchip" style={{ background: c.paper, color: c.accent, borderColor: c.accent }}>
                      Aa
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Your message">
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((m) => (
                    <button key={m} type="button" className={`search-tag text-left ${s.message === m ? "border-ink! text-ink" : ""}`} onClick={() => set({ message: m })}>
                      {m}
                    </button>
                  ))}
                </div>
                <textarea
                  className="studio-input mt-3 min-h-24 resize-y"
                  value={s.message}
                  maxLength={MAX_NOTE}
                  placeholder="Or write your own…"
                  aria-label="Your message"
                  onChange={(e) => set({ message: e.target.value })}
                />
                <p className="mt-1 text-right text-[12px] text-ink-soft tabular-nums">
                  {s.message.length}/{MAX_NOTE}
                </p>
                <input className="studio-input mt-2" value={s.from} maxLength={40} placeholder="From (your name)" aria-label="From" onChange={(e) => set({ from: e.target.value })} />
              </Field>
              <div className="mt-8">
                <button
                  type="button"
                  className="studio-cta w-full"
                  onClick={() => {
                    setPeek(false);
                    setUnboxRun(0);
                    set({ phase: "unbox" });
                  }}
                >
                  Wrap It Up <ArrowRight size={18} strokeWidth={1.6} aria-hidden />
                </button>
                <p className="mt-3 text-center text-[13px] text-ink-soft">Next, see her open it.</p>
              </div>
            </section>
          )}

          {s.phase === "unbox" && chosen && (
            <section className="studio-in lg:pt-10">
              <p className="eyebrow">Her moment</p>
              <h1 className="mt-3 text-[clamp(1.9rem,3.2vw,2.8rem)] leading-tight" style={TITLE}>
                Imagine her opening it.
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {pack.id === "signature" ? "Signature box" : "Classic box"} with a {s.ribbon.toLowerCase()} ribbon, and your card tucked inside.
              </p>
              <button type="button" className="mt-6 inline-flex min-h-11 items-center gap-2 text-[14px] text-ink-soft hover:text-ink" onClick={() => set({ phase: "customize" })}>
                <Pencil size={15} strokeWidth={1.5} aria-hidden /> Make changes
              </button>
            </section>
          )}

          {s.phase === "reveal" && chosen && (
            <Reveal
              s={s}
              set={set}
              design={design}
              onReplay={() => {
                set({ phase: "unbox" });
                setUnboxRun((n) => n + 1);
              }}
              canReplay={!!webgl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Pieces ---------- */

function Card({ on, onClick, children, i, className = "" }: { on: boolean; onClick: () => void; children: ReactNode; i: number; className?: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick} className={`studio-option ${className}`} style={{ animationDelay: `${i * 60}ms` }}>
      {children}
      {on && (
        <span className="studio-check" aria-hidden>
          <Check size={14} strokeWidth={2.2} />
        </span>
      )}
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-7">
      <p className="mb-3 text-[12px] tracking-[0.14em] text-ink-soft uppercase">{label}</p>
      {children}
    </div>
  );
}

function Reveal({
  s,
  set,
  design,
  onReplay,
  canReplay,
}: {
  s: StudioState;
  set: (p: Partial<StudioState>) => void;
  design: (typeof CARD_DESIGNS)[number];
  onReplay: () => void;
  canReplay: boolean;
}) {
  const { addGift } = useStore();
  const router = useRouter();
  const [tried, setTried] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const chosen = getProduct(s.chosen!)!;
  const pack = PACKAGING.find((p) => p.id === s.packaging)!;
  const r = s.recipient;
  const errors = {
    name: !r.name.trim(),
    phone: !/^\+?[\d\s-]{10,15}$/.test(r.phone.trim()),
    address: !r.address.trim(),
    city: !r.city.trim(),
    pin: !/^\d{6}$/.test(r.pin.trim()),
  };
  const valid = !Object.values(errors).some(Boolean);
  const setR = (patch: Partial<Recipient>) => set({ recipient: { ...r, ...patch } });

  const send = () => {
    setTried(true);
    if (!valid) {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    addGift(chosen.slug, {
      packaging: s.packaging,
      message: s.message.trim(),
      from: s.from.trim(),
      recipient: { name: r.name.trim(), phone: r.phone.trim(), address: r.address.trim(), city: r.city.trim(), pin: r.pin.trim() },
      instructions: "",
      hidePrice: s.hidePrice,
      sendToRecipient: true,
      occasion: s.journey.occasion,
      who: null,
      ribbon: s.ribbon,
      cardDesign: s.cardDesign,
    });
    router.push("/checkout");
  };

  const input = (key: keyof Recipient, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="mb-1 block text-[13px] text-ink-soft">{label}</span>
      <input className="studio-input" value={r[key]} onChange={(e) => setR({ [key]: e.target.value })} aria-invalid={tried && errors[key]} {...extra} />
      {tried && errors[key] && <span className="mt-1 block text-[12px] text-danger">Please check {label.toLowerCase()}.</span>}
    </label>
  );

  return (
    <section aria-labelledby="reveal-title" className="studio-in">
      <h1 id="reveal-title" className="text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.05]" style={TITLE}>
        A beautiful gift.
        <em className="block text-[#87264D]">A little piece of you.</em>
      </h1>
      <dl className="mt-6 grid gap-2 border-y border-[#e2d6c3] py-5 text-[14px]">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-soft">Saree</dt>
          <dd className="text-right">
            {chosen.name} · <span className="tabular-nums">{formatPrice(chosen.price)}</span>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-soft">Wrapping</dt>
          <dd className="text-right">
            {pack.id === "signature" ? "Signature box" : "Classic box"}, {s.ribbon.toLowerCase()} ribbon · {pack.price ? formatPrice(pack.price) : "Included"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-soft">Card</dt>
          <dd className="max-w-[60%] text-right italic">
            {s.message ? `“${s.message}”${s.from ? ` — ${s.from}` : ""}` : "No message"}
          </dd>
        </div>
        <div className="flex justify-between gap-4 pt-2 text-[16px]">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(chosen.price + pack.price)}</dd>
        </div>
      </dl>

      <form ref={formRef} className="mt-6" onSubmit={(e) => (e.preventDefault(), send())} noValidate>
        <p className="text-[12px] tracking-[0.14em] text-ink-soft uppercase">Where should it go?</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {input("name", "Her name", { autoComplete: "off" })}
          {input("phone", "Her phone", { inputMode: "tel", autoComplete: "off" })}
          <div className="sm:col-span-2">{input("address", "Address", { autoComplete: "off" })}</div>
          {input("city", "City", { autoComplete: "off" })}
          {input("pin", "PIN code", { inputMode: "numeric", maxLength: 6, autoComplete: "off" })}
        </div>
        <label className="mt-4 flex items-center gap-3 text-[14px]">
          <input type="checkbox" checked={s.hidePrice} onChange={(e) => set({ hidePrice: e.target.checked })} className="size-4 accent-[#87264D]" />
          Keep the price private from her
        </label>
        <p className="mt-2 text-[13px] text-ink-soft">Free delivery, arriving {deliveryWindow()}.</p>
        <button type="submit" className="studio-cta mt-6 w-full">
          Send Her Something Beautiful <ArrowRight size={18} strokeWidth={1.6} aria-hidden />
        </button>
      </form>
      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
        <button type="button" className="inline-flex min-h-11 items-center gap-2 text-[14px] underline-offset-4 hover:underline" onClick={() => set({ phase: "customize" })}>
          <Pencil size={15} strokeWidth={1.5} aria-hidden /> Make Changes
        </button>
        {canReplay && (
          <button type="button" className="inline-flex min-h-11 items-center gap-2 text-[14px] text-ink-soft underline-offset-4 hover:underline" onClick={onReplay}>
            <RotateCcw size={15} strokeWidth={1.5} aria-hidden /> Replay the unboxing
          </button>
        )}
      </div>
    </section>
  );
}

/** Without WebGL: the same journey with the photographs and a drawn card, no 3D. */
function StageFallback({ state, picks, chosenSrc, design }: { state: StudioState; picks: string[]; chosenSrc?: string; design: (typeof CARD_DESIGNS)[number] }) {
  if (state.phase === "landing")
    return <img src="/photos/gift-box.jpg" alt="A folded gold silk saree in a black Kanchiberry gift box, with a berry ribbon and a note card" className="size-full object-cover" />;
  if (state.phase === "choose")
    return (
      <div className="grid size-full place-items-center">
        <img src={picks[state.focus]} alt="" className="max-h-[90%] max-w-[80%] object-contain shadow-xl" />
      </div>
    );
  return (
    <div className="relative grid size-full place-items-center">
      {chosenSrc && <img src={chosenSrc} alt="" className="max-h-[85%] max-w-[60%] object-contain shadow-xl" />}
      {state.phase !== "customize" || state.message ? (
        <div className="absolute right-[8%] bottom-[8%] w-[46%] max-w-72 p-4 text-center shadow-lg" style={{ background: design.paper, color: design.ink, border: `1px solid ${design.accent}` }}>
          <p className="text-[10px] tracking-[0.3em]" style={{ color: design.accent }}>
            KANCHIBERRY
          </p>
          <p className="mt-2 text-[14px] italic leading-snug" style={TITLE}>
            {state.message || "Something beautiful, just for you."}
          </p>
          {state.from && <p className="mt-2 text-right text-[12px]">— {state.from}</p>}
        </div>
      ) : null}
    </div>
  );
}
