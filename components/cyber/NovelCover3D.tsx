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
  sm: { w: 140, h: 210 },
  md: { w: 200, h: 300 },
  lg: { w: 240, h: 360 },
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

  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 140,
    damping: 22,
  });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 140,
    damping: 22,
  });
  const glareOpacity = useSpring(
    useTransform(mx, [-0.5, 0, 0.5], [0.26, 0.07, 0.26]),
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

  const { w, h } = SIZES[size];

  return (
    <div
      ref={ref}
      className={cn("perspective-[1100px]", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="relative select-none"
        style={{
          width: w,
          height: h,
          rotateX: tiltX,
          rotateY: tiltY,
        }}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 blur-2xl"
          style={{ width: w * 0.82, height: 22 }}
        />
        <div
          className="absolute inset-0 rounded-[4px] bg-[color:var(--app-accent)]/12 blur-2xl"
          style={{ transform: "scale(0.94) translateY(6px)" }}
        />

        <div
          className="relative overflow-hidden rounded-[4px] border border-[color:var(--app-border)] shadow-[0_24px_48px_rgba(0,0,0,0.35)] light:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
          style={{ width: w, height: h }}
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
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[color:var(--app-accent)]/10 mix-blend-screen"
            style={{ opacity: glareOpacity }}
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
      </motion.div>
    </div>
  );
}
