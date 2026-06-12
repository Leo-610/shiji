"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const STORAGE_KEY = "shiji-boot-v1";
const DURATION_MS = 3600;

const BOOT_LINES = [
  "初始化量子意识协议…",
  "同步神经接口…",
  "载入《量子余烬》讨论矩阵…",
  "建立安全通道…",
];

const appleEase = [0.22, 1, 0.36, 1] as const;

export function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  const finish = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      return;
    }

    setVisible(true);
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      setLineIndex(
        Math.min(Math.floor(eased * BOOT_LINES.length), BOOT_LINES.length - 1)
      );

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        window.setTimeout(finish, 280);
      }
    };

    requestAnimationFrame(tick);
  }, [finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden bg-[#030308] select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(24px)",
          }}
          transition={{ duration: 0.85, ease: appleEase }}
          aria-hidden={!visible}
        >
          {/* Ambient orbs */}
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[100px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,240,255,0.45) 0%, transparent 70%)",
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1.2, ease: appleEase }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full opacity-20 blur-[90px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(191,0,255,0.5) 0%, transparent 70%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1.4, delay: 0.2, ease: appleEase }}
            />
          </div>

          {/* Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,240,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.2) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Scan line */}
          <motion.div
            className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: ["0%", "100%", "0%"], opacity: [0, 0.8, 0] }}
            transition={{ duration: 2.8, ease: "linear", repeat: Infinity }}
          />

          {/* Center mark */}
          <div className="relative flex h-full flex-col items-center justify-center px-6">
            <motion.div
              className="relative mb-10 flex items-center justify-center"
              initial={{ scale: 0.88, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: appleEase, delay: 0.15 }}
            >
              {/* Orbital ring — inspired by premium product reveal motion */}
              <svg
                className="absolute size-28 sm:size-32 animate-[spin_12s_linear_infinite] opacity-70"
                viewBox="0 0 120 120"
                fill="none"
                aria-hidden
              >
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="url(#boot-ring)"
                  strokeWidth="1"
                  strokeDasharray="4 10"
                />
                <defs>
                  <linearGradient id="boot-ring" x1="0" y1="0" x2="120" y2="120">
                    <stop stopColor="#00f0ff" />
                    <stop offset="1" stopColor="#bf00ff" />
                  </linearGradient>
                </defs>
              </svg>
              <svg
                className="absolute size-20 sm:size-24 animate-[spin_8s_linear_infinite_reverse] opacity-50"
                viewBox="0 0 100 100"
                fill="none"
                aria-hidden
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="rgba(0,240,255,0.35)"
                  strokeWidth="0.5"
                  strokeDasharray="2 8"
                />
              </svg>

              <div
                className="relative flex size-16 sm:size-20 items-center justify-center rounded-2xl border border-cyan-500/30 bg-black/40 shadow-[0_0_40px_rgba(0,240,255,0.15)] backdrop-blur-md"
              >
                <span className="font-orbitron text-lg sm:text-xl font-bold tracking-widest text-cyan-300">
                  QE
                </span>
              </div>
            </motion.div>

            <motion.p
              className="font-orbitron text-[10px] sm:text-xs tracking-[0.45em] text-cyan-400/70 uppercase mb-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: appleEase, delay: 0.45 }}
            >
              Quantum Embers · Sci-Fi Forum
            </motion.p>

            <motion.h1
              className="text-3xl sm:text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-purple-300"
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: appleEase, delay: 0.55 }}
            >
              量子余烬
            </motion.h1>

            <motion.p
              className="mt-2 text-sm text-purple-400/80 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: appleEase, delay: 0.75 }}
            >
              作者 · 时寂
            </motion.p>
          </div>

          {/* Bottom status */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 sm:pb-10">
            <div className="mx-auto max-w-md">
              <motion.p
                className="font-orbitron text-[10px] tracking-[0.2em] text-gray-500 mb-3 tabular-nums"
                key={lineIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {BOOT_LINES[lineIndex]}
              </motion.p>

              <div className="relative h-[2px] overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-200 to-purple-400 shadow-[0_0_12px_rgba(0,240,255,0.6)]"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-gray-600 font-orbitron tracking-wider">
                <span>SYS.BOOT</span>
                <span className="tabular-nums text-cyan-500/70">
                  {Math.round(progress * 100).toString().padStart(3, "0")}%
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={finish}
            className="absolute top-5 right-5 text-[10px] font-orbitron tracking-[0.2em] text-gray-600 hover:text-cyan-400/80 transition-colors uppercase"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
