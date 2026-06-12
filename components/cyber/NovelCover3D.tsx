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
  sm: { w: 140, h: 210, depth: 22, medal: 64, pad: 28 },
  md: { w: 200, h: 300, depth: 30, medal: 80, pad: 36 },
  lg: { w: 240, h: 360, depth: 36, medal: 96, pad: 44 },
} as const;

interface NovelCover3DProps {
  className?: string;
  size?: keyof typeof SIZES;
  priority?: boolean;
  showMedal?: boolean;
}

export function NovelCover3D({
  className,
  size = "md",
  priority = false,
  showMedal = true,
}: NovelCover3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const baseRotateY = -28;

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 160,
    damping: 22,
  });
  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [baseRotateY - 12, baseRotateY + 12]),
    { stiffness: 160, damping: 22 }
  );
  const glareOpacity = useSpring(
    useTransform(mx, [-0.5, 0, 0.5], [0.35, 0.12, 0.35]),
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

  const { w, h, depth, medal, pad } = SIZES[size];
  const halfD = depth / 2;

  return (
    <div
      ref={ref}
      className={cn("perspective-[1400px] select-none", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="relative mx-auto"
        style={{
          width: w + pad + (showMedal ? medal * 0.45 : 0),
          height: h + 24,
          rotateX,
          rotateY,
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Ground shadow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-2xl"
          style={{
            width: w * 0.85,
            height: 28,
            transform: "translateZ(-60px) rotateX(90deg)",
          }}
        />

        <div
          className="relative"
          style={{
            width: w,
            height: h,
            marginLeft: pad,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Back cover */}
          <div
            className="absolute inset-0 rounded-sm bg-gradient-to-br from-gray-900 via-gray-950 to-black shadow-inner"
            style={{
              transform: `rotateY(180deg) translateZ(${halfD}px)`,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Spine */}
          <div
            className="absolute top-0 left-0 overflow-hidden rounded-l-sm border-l border-cyan-500/20 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 shadow-[inset_-4px_0_12px_rgba(0,240,255,0.08)]"
            style={{
              width: depth,
              height: h,
              transform: `rotateY(-90deg) translateX(-${halfD}px) translateZ(0px)`,
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-3 px-1">
              <span
                className="font-orbitron text-[9px] tracking-[0.25em] text-cyan-400/90"
                style={{ writingMode: "vertical-rl" }}
              >
                量子余烬
              </span>
              <div className="h-12 w-px bg-cyan-500/30" />
              <span
                className="text-[7px] tracking-widest text-gray-500"
                style={{ writingMode: "vertical-rl" }}
              >
                时寂
              </span>
            </div>
          </div>

          {/* Page block (right edge) */}
          <div
            className="absolute top-0 right-0 overflow-hidden rounded-r-sm border-r border-gray-600/40"
            style={{
              width: depth,
              height: h,
              transform: `rotateY(90deg) translateX(${halfD}px) translateZ(${w - halfD}px)`,
              transformOrigin: "right center",
              backfaceVisibility: "hidden",
              background:
                "repeating-linear-gradient(to bottom, #f4efe6 0px, #f4efe6 2px, #c9c4bb 2px, #c9c4bb 3px, #ece7de 3px, #ece7de 5px)",
            }}
          />

          {/* Top edge */}
          <div
            className="absolute left-0 top-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-300"
            style={{
              width: w,
              height: depth,
              transform: `rotateX(90deg) translateY(-${halfD}px) translateZ(${halfD}px)`,
              transformOrigin: "top center",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Bottom edge */}
          <div
            className="absolute bottom-0 left-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-400"
            style={{
              width: w,
              height: depth,
              transform: `rotateX(-90deg) translateY(${halfD}px) translateZ(${h - halfD}px)`,
              transformOrigin: "bottom center",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Front cover */}
          <div
            className="absolute inset-0 overflow-hidden rounded-sm border border-cyan-400/35 shadow-[0_0_35px_rgba(0,240,255,0.2),0_25px_50px_rgba(0,0,0,0.55)]"
            style={{
              transform: `translateZ(${halfD}px)`,
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
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/25 via-transparent to-purple-500/20 mix-blend-screen"
              style={{ opacity: glareOpacity }}
            />

            <motion.div
              className="pointer-events-none absolute left-0 right-0 h-1/3 bg-gradient-to-b from-transparent via-cyan-400/12 to-transparent"
              animate={{ top: ["-40%", "140%"] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2.5,
              }}
            />

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>

          {/* Award medal — floats beside the book in 3D */}
          {showMedal && (
            <motion.div
              className="absolute overflow-hidden rounded-md border border-amber-400/30 shadow-[0_0_24px_rgba(251,191,36,0.25),0_12px_32px_rgba(0,0,0,0.5)]"
              style={{
                width: medal,
                height: medal * 1.45,
                right: -medal * 0.55,
                bottom: h * 0.08,
                transform: `translateZ(${halfD + 28}px) rotateY(-8deg) rotateZ(4deg)`,
                transformStyle: "preserve-3d",
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              title="第四届科幻星球大赛 · 科幻新星扶持计划 · 启明星"
            >
              <Image
                src="/images/award-medal.png"
                alt="科幻星球大赛 · 科幻新星扶持计划 · 启明星"
                width={medal}
                height={Math.round(medal * 1.45)}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-200/15 via-transparent to-cyan-300/10" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
