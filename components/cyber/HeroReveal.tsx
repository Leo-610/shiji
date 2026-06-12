"use client";

import { motion } from "motion/react";

const appleEase = [0.22, 1, 0.36, 1] as const;

export function HeroReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: appleEase, delay }}
    >
      {children}
    </motion.div>
  );
}
