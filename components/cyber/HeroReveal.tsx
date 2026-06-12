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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: appleEase, delay }}
    >
      {children}
    </motion.div>
  );
}
