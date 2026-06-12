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
  sm: { wrap: "w-36 h-[13.5rem] sm:w-40 sm:h-60", img: 160 },
  md: { wrap: "w-48 h-72 sm:w-56 sm:h-80", img: 224 },
  lg: { wrap: "w-56 h-[21rem] sm:w-64 sm:h-96 lg:w-72 lg:h-[28rem]", img: 288 },
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

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), {
    stiffness: 180,
    damping: 22,
  });
  const glareOpacity = useSpring(
    useTransform(mx, [-0.5, 0, 0.5], [0.35, 0.15, 0.35]),
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

  const { wrap, img } = SIZES[size];

  return (
    <div
      ref={ref}
      className={cn("perspective-[1200px] select-none", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className={cn("relative mx-auto", wrap)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className="absolute inset-0 rounded-xl bg-cyan-500/25 blur-2xl"
          style={{ transform: "translateZ(-40px) translateY(16px) scale(0.95)" }}
        />

        <div
          className="absolute inset-0 rounded-xl border border-purple-500/20 bg-black/60"
          style={{ transform: "translateZ(-24px) scale(0.96)" }}
        />

        <div
          className="relative overflow-hidden rounded-xl border border-cyan-400/40 shadow-[0_0_40px_rgba(0,240,255,0.25),0_20px_60px_rgba(0,0,0,0.5)]"
        >
          <Image
            src="/images/novel-cover.png"
            alt="《量子余烬》小说封面"
            width={img}
            height={Math.round(img * 1.5)}
            priority={priority}
            className="h-full w-full object-cover"
          />

          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/30 via-transparent to-purple-500/25 mix-blend-screen"
            style={{ opacity: glareOpacity }}
          />

          <motion.div
            className="pointer-events-none absolute left-0 right-0 h-1/3 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent"
            animate={{ top: ["-40%", "140%"] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 2,
            }}
          />

          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
        </div>

        <div
          className="pointer-events-none absolute -right-2 top-8 size-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff]"
          style={{ transform: "translateZ(30px)" }}
        />
        <div
          className="pointer-events-none absolute -left-3 bottom-12 size-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_#bf00ff]"
          style={{ transform: "translateZ(20px)" }}
        />
      </motion.div>
    </div>
  );
}
