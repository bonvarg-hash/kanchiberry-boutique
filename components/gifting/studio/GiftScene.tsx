"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PresentationControls, useTexture } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

/**
 * The gift studio's one 3D scene: a Kanchiberry gift box (base, lid, ribbon and
 * bow), the curated sarees floating on a ring above it, the chosen saree folded
 * inside, and the message card. Sarees are the real product photographs on flat
 * planes at their true proportions; they are not simulated fabric.
 *
 * Every object moves between named poses with GSAP; the unboxing is one timeline.
 */

export type StageMode = "hero" | "choose" | "customize" | "unbox" | "reveal";

export interface CardFace {
  paper: string;
  ink: string;
  accent: string;
  message: string;
  from: string;
}

export interface GiftSceneProps {
  mode: StageMode;
  /** Image sources of the curated sarees (choose mode). */
  sarees: string[];
  focus: number;
  onFocus?: (i: number) => void;
  /** Image of the saree in the box. */
  chosenSrc: string | null;
  /** Increments when the focused saree is chosen, to fly it into the box. */
  chooseRun?: number;
  onChosen?: () => void;
  packaging: "signature" | "classic";
  ribbon: string;
  card: CardFace;
  /** Lid lifted to peek inside (customize mode). */
  open?: boolean;
  /** Increments to play the unboxing; `skipRun` increments to jump to its end. */
  unboxRun?: number;
  skipRun?: number;
  onUnboxed?: () => void;
  onBoxClick?: () => void;
  reduced: boolean;
  onReady?: () => void;
}

const W = 2.4;
const D = 1.7;
const H = 0.7;
const T = 0.05;
const RING_Y = 2.55;
const RING_Z = -0.4;
const RING_R = 2.2;
const ITEM_H = 1.75;
const PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

type V3 = [number, number, number];
interface Pose {
  p?: V3;
  r?: V3;
  s?: V3;
}

const LID_CLOSED: Pose = { p: [0, H + 0.02, 0], r: [0, 0, 0] };
const LID_PEEK: Pose = { p: [0, 1.3, -1.0], r: [-1.15, 0, 0] };
const LID_ASIDE: Pose = { p: [1.85, 0.1, -1.15], r: [0, -0.55, 0] };
const CARD_IN: Pose = { p: [0.62, 0.5, 0.3], r: [-Math.PI / 2, 0, 0.18], s: [0.75, 0.5, 1] };
const CARD_OUT: Pose = { p: [1.2, 1.05, 1.0], r: [-0.18, -0.38, 0.04], s: [0.95, 0.633, 1] };

const CAMERA: Record<StageMode | "close", { p: V3; t: V3 }> = {
  hero: { p: [0, 1.95, 4.4], t: [0, 0.45, 0] },
  choose: { p: [0, 2.5, 7.6], t: [0, 1.65, 0] },
  customize: { p: [0, 2.6, 5.6], t: [0, 0.45, 0] },
  unbox: { p: [0, 2.6, 5.6], t: [0, 0.45, 0] },
  close: { p: [0, 2.25, 4.2], t: [0, 0.7, 0] },
  reveal: { p: [0.3, 1.95, 5.3], t: [0.3, 1.15, 0] },
};

const sareeIn = (a: number): Pose => {
  const s = Math.min(2.1 / a, 1.45);
  return { p: [-0.05, 0.48, -0.05], r: [-Math.PI / 2, 0, 0], s: [s * a, s, 1] };
};
const sareeOut = (a: number): Pose => ({ p: [-0.3, 1.78, 0.1], r: [-0.04, 0.14, 0], s: [2.05 * a, 2.05, 1] });

/** Tween (or set, when `dur` is 0) an object to a pose. Returns the tweens for a timeline. */
function toPose(o: THREE.Object3D | null, pose: Pose, dur: number, tl?: gsap.core.Timeline, at?: number | string, ease = "power3.inOut") {
  if (!o) return;
  if (!tl) gsap.killTweensOf([o.position, o.rotation, o.scale]);
  const parts: [object, V3 | undefined][] = [
    [o.position, pose.p],
    [o.rotation, pose.r],
    [o.scale, pose.s],
  ];
  for (const [target, v] of parts) {
    if (!v) continue;
    const vars = { x: v[0], y: v[1], z: v[2] };
    if (dur === 0 && !tl) gsap.set(target, vars);
    else if (tl) tl.to(target, { ...vars, duration: dur, ease }, at);
    else gsap.to(target, { ...vars, duration: dur, ease });
  }
}

/* ---------- Canvas textures ---------- */

function titleFont() {
  const el = document.createElement("span");
  el.style.fontFamily = "var(--font-title)";
  document.body.appendChild(el);
  const f = getComputedStyle(el).fontFamily;
  el.remove();
  return f || "Georgia, serif";
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function useCardTexture(card: CardFace) {
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 800;
    return c;
  }, []);
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [canvas]);
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    document.fonts?.ready.then(() => setFontsReady(true));
  }, []);
  useEffect(() => {
    const ctx = canvas.getContext("2d")!;
    const font = titleFont();
    ctx.fillStyle = card.paper;
    ctx.fillRect(0, 0, 1200, 800);
    // Faint paper grain
    for (let i = 0; i < 2200; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.025})`;
      ctx.fillRect(Math.random() * 1200, Math.random() * 800, 2, 2);
    }
    ctx.strokeStyle = card.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 1120, 720);
    ctx.lineWidth = 1;
    ctx.strokeRect(54, 54, 1092, 692);
    ctx.fillStyle = card.accent;
    ctx.textAlign = "center";
    ctx.font = `500 30px ${font}`;
    ctx.letterSpacing = "10px";
    ctx.fillText("KANCHIBERRY", 600, 132);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = card.ink;
    const msg = card.message.trim() || "Something beautiful, just for you.";
    let size = 60;
    let lines: string[] = [];
    do {
      ctx.font = `italic 400 ${size}px ${font}`;
      lines = wrap(ctx, msg, 920);
      size -= 4;
    } while (lines.length * size * 1.35 > 400 && size > 30);
    const lh = (size + 4) * 1.35;
    const top = 400 - ((lines.length - 1) * lh) / 2 + 10;
    lines.forEach((l, i) => ctx.fillText(l, 600, top + i * lh));
    if (card.from.trim()) {
      ctx.textAlign = "right";
      ctx.font = `400 40px ${font}`;
      ctx.fillText(`— ${card.from.trim()}`, 1080, 700);
    }
    texture.needsUpdate = true;
  }, [canvas, texture, card.paper, card.ink, card.accent, card.message, card.from, fontsReady]);
  return texture;
}

function useFoilTexture(color: string) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 160;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `500 70px ${titleFont()}`;
    ctx.letterSpacing = "26px";
    ctx.fillText("KANCHIBERRY", 512, 84);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [color]);
}

/* ---------- Gift box ---------- */

function RibbonMaterial({ color }: { color: string }) {
  return <meshPhysicalMaterial color={color} roughness={0.32} sheen={0.5} sheenRoughness={0.5} sheenColor={color} clearcoat={0.25} clearcoatRoughness={0.4} />;
}

function Bow({ color }: { color: string }) {
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.23, 0.11, 0]} rotation={[0.25, side * 0.25, side * -0.32]} scale={[1.15, 0.72, 0.55]} castShadow>
            <torusGeometry args={[0.2, 0.05, 14, 40]} />
            <RibbonMaterial color={color} />
          </mesh>
          <mesh position={[side * 0.2, 0.004, 0.34]} rotation={[0, side * 0.5, 0]}>
            <boxGeometry args={[0.13, 0.008, 0.5]} />
            <RibbonMaterial color={color} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.07, 0]} scale={[1, 0.85, 0.85]}>
        <sphereGeometry args={[0.085, 24, 16]} />
        <RibbonMaterial color={color} />
      </mesh>
    </group>
  );
}

function GiftBox({
  packaging,
  ribbon,
  lidRef,
  bowRef,
  bandsRef,
  onClick,
  clickable,
}: {
  packaging: "signature" | "classic";
  ribbon: string;
  lidRef: RefObject<THREE.Group | null>;
  bowRef: RefObject<THREE.Group | null>;
  bandsRef: RefObject<THREE.Group | null>;
  onClick?: () => void;
  clickable: boolean;
}) {
  const sig = packaging === "signature";
  const shell = sig ? "#2a1c22" : "#ece4d4";
  const inner = sig ? "#2b1f25" : "#e2d8c6";
  const foil = useFoilTexture(sig ? "#d6b46e" : "#87264d");
  const mat = <meshStandardMaterial color={shell} roughness={sig ? 0.58 : 0.82} metalness={0.02} />;
  const [hover, setHover] = useState(false);
  useEffect(() => {
    document.body.style.cursor = hover && clickable ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover, clickable]);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Base: an open box (floor and four walls) lined with tissue */}
      <mesh position={[0, T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, T, D]} />
        {mat}
      </mesh>
      {([
        [[0, H / 2, D / 2 - T / 2], [W, H, T]],
        [[0, H / 2, -D / 2 + T / 2], [W, H, T]],
        [[W / 2 - T / 2, H / 2, 0], [T, H, D - 2 * T]],
        [[-W / 2 + T / 2, H / 2, 0], [T, H, D - 2 * T]],
      ] as [V3, V3][]).map(([p, s], i) => (
        <mesh key={i} position={p} castShadow receiveShadow>
          <boxGeometry args={s} />
          {i < 2 ? mat : <meshStandardMaterial color={shell} roughness={sig ? 0.58 : 0.82} />}
        </mesh>
      ))}
      <mesh position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W - 2 * T - 0.01, D - 2 * T - 0.01]} />
        <meshStandardMaterial color="#f3ebdf" roughness={0.95} />
      </mesh>
      {/* Tissue folded over the rim, front and back */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0.5, s * (D / 2 - T - 0.08)]} rotation={[-Math.PI / 2 + s * 0.5, 0, 0]}>
          <planeGeometry args={[W - 2 * T - 0.02, 0.22]} />
          <meshStandardMaterial color="#f6efe5" roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Ribbon round the base, outside faces only */}
      <group ref={bandsRef}>
        {([
          [[0, H / 2, D / 2 + 0.003], [0.2, H, 0.006]],
          [[0, H / 2, -D / 2 - 0.003], [0.2, H, 0.006]],
          [[W / 2 + 0.003, H / 2, 0], [0.006, H, 0.2]],
          [[-W / 2 - 0.003, H / 2, 0], [0.006, H, 0.2]],
        ] as [V3, V3][]).map(([p, s], i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={s} />
            <RibbonMaterial color={ribbon} />
          </mesh>
        ))}
      </group>

      {/* Lid: a shallow shell that overlaps the base, with its own ribbon, foil wordmark and bow */}
      <group ref={lidRef} position={LID_CLOSED.p}>
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[W + 0.08, 0.04, D + 0.08]} />
          {mat}
        </mesh>
        {([
          [[0, 0, D / 2 + 0.025], [W + 0.08, 0.2, 0.03]],
          [[0, 0, -D / 2 - 0.025], [W + 0.08, 0.2, 0.03]],
          [[W / 2 + 0.025, 0, 0], [0.03, 0.2, D + 0.02]],
          [[-W / 2 - 0.025, 0, 0], [0.03, 0.2, D + 0.02]],
        ] as [V3, V3][]).map(([p, s], i) => (
          <mesh key={i} position={p} castShadow>
            <boxGeometry args={s} />
            {mat}
          </mesh>
        ))}
        {([
          [[0, 0.123, 0], [0.2, 0.006, D + 0.09]],
          [[0, 0.123, 0], [W + 0.09, 0.006, 0.2]],
          [[0, 0.01, D / 2 + 0.043], [0.2, 0.22, 0.006]],
          [[0, 0.01, -D / 2 - 0.043], [0.2, 0.22, 0.006]],
          [[W / 2 + 0.043, 0.01, 0], [0.006, 0.22, 0.2]],
          [[-W / 2 - 0.043, 0.01, 0], [0.006, 0.22, 0.2]],
        ] as [V3, V3][]).map(([p, s], i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={s} />
            <RibbonMaterial color={ribbon} />
          </mesh>
        ))}
        <mesh position={[-0.62, 0.1215, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.82, 0.128]} />
          <meshStandardMaterial map={foil} transparent metalness={sig ? 0.7 : 0.1} roughness={0.3} />
        </mesh>
        <group ref={bowRef} position={[0, 0.126, 0]}>
          <Bow color={ribbon} />
        </group>
      </group>
    </group>
  );
}

/* ---------- Sarees ---------- */

function SareeRing({
  textures,
  focus,
  onFocus,
  hidden,
  ringRef,
}: {
  textures: THREE.Texture[];
  focus: number;
  onFocus?: (i: number) => void;
  hidden: number | null;
  ringRef: RefObject<THREE.Group | null>;
}) {
  const n = textures.length;
  const step = (Math.PI * 2) / n;
  const items = useRef<(THREE.Mesh | null)[]>([]);
  const hovered = useRef<number | null>(null);
  const turn = useRef({ y: 0 });

  // Rotate the ring the short way round so the focused saree faces the camera.
  useEffect(() => {
    const cur = turn.current.y;
    let target = -focus * step;
    while (target - cur > Math.PI) target -= Math.PI * 2;
    while (target - cur < -Math.PI) target += Math.PI * 2;
    gsap.to(turn.current, { y: target, duration: 0.9, ease: "power3.out" });
  }, [focus, step]);

  useFrame((state) => {
    const ring = ringRef.current;
    if (!ring) return;
    ring.rotation.y = turn.current.y;
    const t = state.clock.elapsedTime;
    items.current.forEach((m, i) => {
      if (!m) return;
      const facing = Math.cos(i * step + turn.current.y); // 1 at the front
      const front = (facing + 1) / 2;
      const hov = hovered.current === i ? 1.06 : 1;
      const k = (0.72 + 0.28 * front) * hov;
      const a = (m.userData.aspect as number) ?? 0.7;
      m.scale.lerp(new THREE.Vector3(ITEM_H * a * k, ITEM_H * k, 1), 0.15);
      m.position.y = Math.sin(t * 0.9 + i * 1.3) * 0.06;
      // Lean gently towards the pointer when it is over this saree.
      const lean = hovered.current === i ? state.pointer.x * 0.18 : 0;
      m.rotation.y += (lean - m.rotation.y) * 0.1;
      const mat = m.material as THREE.MeshStandardMaterial;
      const shade = 0.45 + 0.55 * front ** 1.6;
      mat.color.setScalar(shade);
      m.visible = hidden !== i;
    });
  });

  return (
    <group ref={ringRef} position={[0, RING_Y, RING_Z]} scale={0}>
      {textures.map((tex, i) => {
        const img = tex.image as HTMLImageElement;
        const aspect = img?.width && img?.height ? img.width / img.height : 0.7;
        const theta = i * step;
        return (
          <group key={i} position={[Math.sin(theta) * RING_R, 0, Math.cos(theta) * RING_R]} rotation={[0, theta, 0]}>
            <mesh
              ref={(m) => {
                items.current[i] = m;
                if (m) m.userData.aspect = aspect;
              }}
              scale={[ITEM_H * aspect, ITEM_H, 1]}
              onClick={(e) => {
                e.stopPropagation();
                onFocus?.(i);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                hovered.current = i;
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                if (hovered.current === i) hovered.current = null;
                document.body.style.cursor = "";
              }}
            >
              <planeGeometry />
              <meshStandardMaterial map={tex} roughness={0.75} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ---------- Scene ---------- */

function aspectOf(tex: THREE.Texture | undefined) {
  const img = tex?.image as HTMLImageElement | undefined;
  return img?.width && img?.height ? img.width / img.height : 0.7;
}

function Scene(props: GiftSceneProps) {
  const { mode, sarees, focus, chosenSrc, packaging, ribbon, card, open, reduced } = props;
  const srcs = useMemo(() => {
    const all = [...sarees];
    if (chosenSrc && !all.includes(chosenSrc)) all.push(chosenSrc);
    return all.length ? all : [PIXEL];
  }, [sarees, chosenSrc]);
  const loaded = useTexture(srcs) as THREE.Texture[];
  useMemo(() => {
    for (const t of loaded) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    }
  }, [loaded]);
  const ringTextures = sarees.length ? loaded.slice(0, sarees.length) : [];
  const chosenTex = chosenSrc ? loaded[srcs.indexOf(chosenSrc)] : undefined;
  const chosenAspect = aspectOf(chosenTex);
  const cardTex = useCardTexture(card);

  const { camera, size } = useThree();
  const cam = useRef({ p: new THREE.Vector3(...CAMERA[mode].p), t: new THREE.Vector3(...CAMERA[mode].t) });
  const floatRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const bowRef = useRef<THREE.Group>(null);
  const bandsRef = useRef<THREE.Group>(null);
  const sareeRef = useRef<THREE.Mesh>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [flying, setFlying] = useState<number | null>(null);
  const callbacks = useRef(props);
  callbacks.current = props;

  useEffect(() => {
    props.onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveCamera = (to: StageMode | "close", dur: number, tl?: gsap.core.Timeline, at?: number | string) => {
    const c = CAMERA[to];
    const run = (target: THREE.Vector3, v: V3) => {
      const vars = { x: v[0], y: v[1], z: v[2] };
      if (tl) tl.to(target, { ...vars, duration: dur, ease: "power2.inOut" }, at);
      else if (dur === 0) gsap.set(target, vars);
      else gsap.to(target, { ...vars, duration: dur, ease: "power2.inOut", overwrite: true });
    };
    run(cam.current.p, c.p);
    run(cam.current.t, c.t);
  };

  // Settle every object into the pose for this mode.
  useEffect(() => {
    timeline.current?.kill();
    const d = reduced ? 0 : 1.1;
    moveCamera(mode, d);
    const bowOn: Pose = { p: [0, 0.126, 0], r: [0, 0, 0], s: [1, 1, 1] };
    if (mode === "hero") {
      toPose(lidRef.current, LID_CLOSED, d);
      toPose(bowRef.current, bowOn, d);
      toPose(bandsRef.current, { s: [1, 1, 1] }, d);
      toPose(ringRef.current, { s: [0, 0, 0] }, d);
      toPose(sareeRef.current, { s: [0, 0, 0] }, 0);
      toPose(cardRef.current, { s: [0, 0, 0] }, 0);
    }
    if (mode === "choose") {
      toPose(lidRef.current, LID_ASIDE, d);
      toPose(bowRef.current, bowOn, d);
      toPose(bandsRef.current, { s: [1, 1, 1] }, d);
      toPose(ringRef.current, { s: [1, 1, 1] }, reduced ? 0 : 1.2);
      toPose(sareeRef.current, { s: [0, 0, 0] }, 0);
      toPose(cardRef.current, { s: [0, 0, 0] }, 0);
      setFlying(null);
    }
    if (mode === "customize" || mode === "unbox") {
      toPose(ringRef.current, { s: [0, 0, 0] }, d * 0.6);
      toPose(lidRef.current, mode === "customize" && open ? LID_PEEK : LID_CLOSED, d);
      toPose(bowRef.current, bowOn, d);
      toPose(bandsRef.current, { s: [1, 1, 1] }, d);
      if (chosenSrc) toPose(sareeRef.current, sareeIn(chosenAspect), sareeRef.current && sareeRef.current.scale.x > 0.01 ? d : 0);
      toPose(cardRef.current, CARD_IN, d);
    }
    if (mode === "reveal") revealPoses(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, open, reduced]);

  const revealPoses = (d: number) => {
    moveCamera("reveal", d);
    toPose(ringRef.current, { s: [0, 0, 0] }, 0);
    toPose(lidRef.current, LID_ASIDE, d);
    toPose(bowRef.current, { p: [0, 0.5, 0], r: [0, 0, 0.6], s: [0, 0, 0] }, d);
    toPose(bandsRef.current, { s: [1, 0, 1] }, d);
    toPose(sareeRef.current, sareeOut(chosenAspect), d);
    toPose(cardRef.current, CARD_OUT, d);
  };

  // Choosing: the focused saree leaves the ring and folds down into the box, then the lid closes.
  useEffect(() => {
    if (!props.chooseRun || mode !== "choose" || !sareeRef.current) return;
    const i = focus;
    const a = aspectOf(ringTextures[i]);
    const s = sareeRef.current;
    setFlying(i);
    const start: Pose = { p: [0, RING_Y, RING_Z + RING_R], r: [0, 0, 0], s: [ITEM_H * a, ITEM_H, 1] };
    toPose(s, start, 0);
    gsap.killTweensOf([s.position, s.rotation, s.scale]);
    s.position.set(...start.p!);
    s.rotation.set(0, 0, 0);
    s.scale.set(...start.s!);
    const tl = gsap.timeline({ onComplete: () => callbacks.current.onChosen?.() });
    timeline.current = tl;
    if (reduced) {
      toPose(s, sareeIn(a), 0.01, tl, 0);
      toPose(ringRef.current, { s: [0, 0, 0] }, 0.01, tl, 0);
      toPose(lidRef.current, LID_CLOSED, 0.01, tl, 0);
    } else {
      tl.to(s.scale, { x: ITEM_H * a * 1.12, y: ITEM_H * 1.12, duration: 0.3, ease: "back.out(2)" }, 0);
      toPose(ringRef.current, { s: [0, 0, 0] }, 0.7, tl, 0.15, "power2.in");
      toPose(s, { p: [0, 1.7, 0.6], r: [-0.7, 0, 0.12] }, 0.7, tl, 0.3, "power2.inOut");
      toPose(s, sareeIn(a), 0.8, tl, 1.0, "power3.out");
      moveCamera("customize", 1.4, tl, 0.4);
      toPose(lidRef.current, { p: [0, 1.5, 0], r: [0, 0, 0] }, 0.7, tl, 1.5, "power2.out");
      toPose(lidRef.current, LID_CLOSED, 0.6, tl, 2.15, "power2.in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chooseRun]);

  // The unboxing.
  useEffect(() => {
    if (!props.unboxRun || !sareeRef.current) return;
    timeline.current?.kill();
    const a = chosenAspect;
    // Reset to the wrapped box so a replay starts from the beginning.
    toPose(lidRef.current, LID_CLOSED, 0);
    toPose(bowRef.current, { p: [0, 0.126, 0], r: [0, 0, 0], s: [1, 1, 1] }, 0);
    toPose(bandsRef.current, { s: [1, 1, 1] }, 0);
    toPose(sareeRef.current, sareeIn(a), 0);
    toPose(cardRef.current, CARD_IN, 0);
    moveCamera("unbox", 0);
    const tl = gsap.timeline({ onComplete: () => callbacks.current.onUnboxed?.() });
    timeline.current = tl;
    if (reduced) {
      tl.call(() => revealPoses(0));
      return;
    }
    moveCamera("close", 1.0, tl, 0);
    // Untie: the bow lifts, twists and falls away; the bands slip down.
    tl.to(bowRef.current!.position, { y: 0.55, duration: 0.7, ease: "power2.out" }, 0.6);
    tl.to(bowRef.current!.rotation, { z: 0.9, y: 0.6, duration: 0.7, ease: "power2.out" }, 0.6);
    tl.to(bowRef.current!.scale, { x: 0, y: 0, z: 0, duration: 0.45, ease: "power2.in" }, 1.0);
    tl.to(bandsRef.current!.scale, { y: 0, duration: 0.5, ease: "power2.in" }, 0.9);
    // Lid lifts, turns and is set down beside the box.
    toPose(lidRef.current, { p: [0, 1.75, -0.2], r: [-0.3, 0.25, 0.05] }, 0.75, tl, 1.3, "power2.out");
    toPose(lidRef.current, LID_ASIDE, 0.85, tl, 2.05, "power2.inOut");
    // The saree rises out of the tissue and turns to face her.
    toPose(sareeRef.current, { p: [-0.1, 1.2, 0.0], r: [-0.9, 0.05, 0] }, 0.8, tl, 2.0, "power2.out");
    toPose(sareeRef.current, sareeOut(a), 1.0, tl, 2.75, "power3.out");
    // Then the card.
    toPose(cardRef.current, { p: [0.8, 0.95, 0.6], r: [-0.9, -0.2, 0.1] }, 0.6, tl, 3.2, "power2.out");
    toPose(cardRef.current, CARD_OUT, 0.8, tl, 3.75, "power3.out");
    moveCamera("reveal", 1.2, tl, 3.4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.unboxRun]);

  useEffect(() => {
    if (props.skipRun && timeline.current) timeline.current.progress(1);
  }, [props.skipRun]);

  // A narrow (phone) canvas needs the camera further back to keep the same framing.
  const fit = size.width / size.height < 0.9 ? (mode === "choose" ? 1.75 : 1.6) : size.width / size.height < 1.25 ? 1.2 : 1;
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, delta) => {
    tmp.copy(cam.current.p).sub(cam.current.t).multiplyScalar(fit).add(cam.current.t);
    camera.position.copy(tmp);
    camera.lookAt(cam.current.t);
    const t = state.clock.elapsedTime;
    if (floatRef.current) {
      const amp = reduced ? 0 : mode === "hero" ? 0.08 : mode === "reveal" ? 0.025 : 0;
      floatRef.current.position.y += (Math.sin(t * 1.1) * amp - floatRef.current.position.y) * 0.1;
    }
    if (spinRef.current) {
      if (mode === "hero" && !reduced) spinRef.current.rotation.y += delta * 0.18;
      else {
        // Return to facing front the short way.
        const r = spinRef.current.rotation.y;
        const wrapped = Math.atan2(Math.sin(r), Math.cos(r));
        spinRef.current.rotation.y = wrapped * 0.9;
      }
    }
  });

  const controls = mode !== "choose" && mode !== "unbox";
  const showSaree = !!chosenSrc && (mode !== "choose" || flying !== null) && mode !== "hero";

  return (
    <>
      <ambientLight intensity={0.7} />
      <hemisphereLight args={["#fff8ee", "#d9c6ad", 0.8]} />
      <directionalLight position={[3, 6, 4]} intensity={1.6} color="#fff4e6" />
      <directionalLight position={[-4, 3, -2]} intensity={0.5} color="#ffe2d0" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 2]} scale={[6, 3, 1]} rotation={[Math.PI / 2.4, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#ffe9d6" position={[-5, 1.5, 1]} scale={[3, 4, 1]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer form="ring" intensity={1.4} position={[4, 2, 3]} scale={2} />
      </Environment>
      <PresentationControls
        enabled={controls}
        global={false}
        cursor={controls}
        snap={mode === "hero"}
        speed={1.4}
        polar={[-0.15, 0.25]}
        azimuth={[-0.8, 0.8]}
      >
        <group ref={floatRef}>
          <group ref={spinRef} rotation={[0, mode === "hero" ? 0.6 : 0, 0]}>
            <GiftBox
              packaging={packaging}
              ribbon={ribbon}
              lidRef={lidRef}
              bowRef={bowRef}
              bandsRef={bandsRef}
              clickable={mode === "unbox"}
              onClick={() => callbacks.current.onBoxClick?.()}
            />
            <mesh ref={sareeRef} visible={showSaree} scale={0} castShadow>
              <planeGeometry />
              <meshStandardMaterial map={chosenTex ?? null} roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={cardRef} visible={mode === "customize" || mode === "unbox" || mode === "reveal"} scale={0} castShadow>
              <planeGeometry />
              <meshStandardMaterial map={cardTex} roughness={0.85} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </PresentationControls>
      {ringTextures.length > 0 && <SareeRing textures={ringTextures} focus={focus} onFocus={props.onFocus} hidden={flying} ringRef={ringRef} />}
      <ContactShadows position={[0, 0.002, 0]} opacity={0.42} scale={10} blur={2.4} far={3.2} resolution={512} color="#3a2a22" />
    </>
  );
}

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function GiftScene(props: GiftSceneProps & { onError: () => void }) {
  return (
    <Boundary onError={props.onError}>
      <Canvas dpr={[1, 1.75]} camera={{ fov: 34, near: 0.1, far: 60, position: CAMERA[props.mode].p }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => (gl.toneMapping = THREE.ACESFilmicToneMapping)}>
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </Boundary>
  );
}
