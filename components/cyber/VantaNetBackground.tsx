"use client";

import { useEffect, useRef } from "react";

type VantaEffect = { destroy: () => void };

export function VantaNetBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let effect: VantaEffect | null = null;
    let cancelled = false;

    (async () => {
      const THREE = await import("three");
      const NET = (await import("vanta/dist/vanta.net.min")).default;

      if (cancelled || !containerRef.current) return;

      effect = NET({
        el: containerRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 0.85,
        color: 0x00f0ff,
        backgroundColor: 0x030308,
        points: 11,
        maxDistance: 22,
        spacing: 16,
        showDots: true,
      });
    })();

    return () => {
      cancelled = true;
      effect?.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 opacity-90"
      aria-hidden
    />
  );
}
