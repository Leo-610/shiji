"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { w: 140, h: 210, d: 32 },
  md: { w: 200, h: 300, d: 42 },
  lg: { w: 240, h: 360, d: 50 },
} as const;

interface NovelCover3DProps {
  className?: string;
  size?: keyof typeof SIZES;
  priority?: boolean;
}

export function NovelCover3D({
  className,
  size = "md",
  priority = false,
}: NovelCover3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const baseY = -42;

  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const tiltY = useSpring(
    useTransform(mx, [-0.5, 0.5], [baseY - 10, baseY + 10]),
    { stiffness: 150, damping: 20 }
  );
  const glareOpacity = useSpring(
    useTransform(mx, [-0.5, 0, 0.5], [0.3, 0.1, 0.3]),
    { stiffness: 120, damping: 20 }
  );

  function handlePointerMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
  }

  const { w, h, d } = SIZES[size];
  const half = d / 2;

  return (
    <div
      ref={ref}
      className={cn("perspective-[1600px]", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="relative select-none"
        style={{
          width: w + d + 16,
          height: h + 20,
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* shadow on "table" */}
        <div
          className="absolute rounded-full bg-cyan-500/15 blur-2xl"
          style={{
            width: w * 0.9,
            height: 24,
            left: d / 2 + 8,
            bottom: 0,
            transform: "rotateX(90deg) translateZ(-20px)",
          }}
        />

        {/* 3D book block — all faces share this preserve-3d context */}
        <div
          className="absolute left-0 top-0"
          style={{
            width: w,
            height: h,
            marginLeft: d + 8,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Back */}
          <div
            className="absolute inset-0 rounded-[2px] bg-gradient-to-br from-zinc-900 to-black"
            style={{
              transform: `rotateY(180deg) translateZ(${half}px)`,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Spine (left) */}
          <div
            className="absolute top-0 left-0 rounded-l-[2px] border-l border-cyan-500/25 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 shadow-[inset_-6px_0_16px_rgba(0,240,255,0.12)]"
            style={{
              width: d,
              height: h,
              transformOrigin: "left center",
              transform: `rotateY(-90deg)`,
              backfaceVisibility: "hidden",
            }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-4 px-0.5">
              <span
                className="font-orbitron text-[8px] sm:text-[9px] tracking-[0.3em] text-cyan-400/90"
                style={{ writingMode: "vertical-rl" }}
              >
                量子余烬
              </span>
              <div className="h-10 w-px bg-cyan-500/40" />
              <span
                className="text-[7px] tracking-widest text-zinc-500"
                style={{ writingMode: "vertical-rl" }}
              >
                时寂
              </span>
            </div>
          </div>

          {/* Pages (right edge) */}
          <div
            className="absolute top-0 right-0 rounded-r-[1px] border-r border-zinc-500/50"
            style={{
              width: d,
              height: h,
              transformOrigin: "right center",
              transform: `rotateY(90deg)`,
              backfaceVisibility: "hidden",
              background:
                "repeating-linear-gradient(to bottom, #f6f1e8 0 2px, #d8d3ca 2px 3px, #ede8df 3px 5px)",
              boxShadow: "inset 4px 0 8px rgba(0,0,0,0.25)",
            }}
          />

          {/* Top edge */}
          <div
            className="absolute left-0 top-0 bg-gradient-to-r from-zinc-700 via-zinc-500 to-amber-100/80"
            style={{
              width: w,
              height: d,
              transformOrigin: "top center",
              transform: `rotateX(90deg)`,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Bottom edge */}
          <div
            className="absolute bottom-0 left-0 bg-gradient-to-r from-zinc-800 via-zinc-600 to-amber-100/60"
            style={{
              width: w,
              height: d,
              transformOrigin: "bottom center",
              transform: `rotateX(-90deg)`,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Front cover */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[2px] border border-cyan-400/40 shadow-[0_0_30px_rgba(0,240,255,0.18),0_20px_45px_rgba(0,0,0,0.55)]"
            style={{
              transform: `translateZ(${half}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src="/images/novel-cover.png"
              alt="《量子余烬》小说封面"
              width={w}
              height={h}
              priority={priority}
              className="h-full w-full object-cover"
            />
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-200/20 via-transparent to-purple-400/15 mix-blend-screen"
              style={{ opacity: glareOpacity }}
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
