"use client";

import { WHEEL_SEGMENT_ANGLE, type WheelPrizeTier } from "@/lib/wheel";
import { cn } from "@/lib/utils";

export type WheelDiscPrize = {
  id: string;
  shortLabel: string;
  tier: WheelPrizeTier;
};

const TIER_FILL: Record<
  WheelPrizeTier,
  { from: string; to: string; stroke: string }
> = {
  junk: { from: "#1e293b", to: "#0b1220", stroke: "#334155" },
  low: { from: "#1e3a5f", to: "#0f172a", stroke: "#38bdf8" },
  mid: { from: "#312e81", to: "#1e1b4b", stroke: "#818cf8" },
  rare: { from: "#9a3412", to: "#431407", stroke: "#fb923c" },
  epic: { from: "#6d28d9", to: "#3b0764", stroke: "#c084fc" },
  legendary: { from: "#4338ca", to: "#1e1b4b", stroke: "#a5b4fc" },
  ultimate: { from: "#fbbf24", to: "#b45309", stroke: "#fde68a" },
};

function segmentPath(
  index: number,
  count: number,
  radius: number,
  cx = 100,
  cy = 100
): string {
  const slice = 360 / count;
  const start = ((index * slice - 90) * Math.PI) / 180;
  const end = (((index + 1) * slice - 90) * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(start);
  const y1 = cy + radius * Math.sin(start);
  const x2 = cx + radius * Math.cos(end);
  const y2 = cy + radius * Math.sin(end);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
}

interface WheelDiscProps {
  prizes: WheelDiscPrize[];
  rotation: number;
  spinning: boolean;
}

export function WheelDisc({ prizes, rotation, spinning }: WheelDiscProps) {
  const count = prizes.length;

  return (
    <div
      className={cn("wheel-disc-rotor", spinning && "wheel-disc-rotor-spinning")}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="wheel-disc-svg"
        aria-hidden
      >
        <defs>
          {prizes.map((prize, i) => {
            const pal = TIER_FILL[prize.tier];
            return (
              <linearGradient
                key={prize.id}
                id={`wheel-seg-${prize.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={pal.from} />
                <stop offset="100%" stopColor={pal.to} />
              </linearGradient>
            );
          })}
          <filter id="wheel-inner-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {prizes.map((prize, i) => {
          const pal = TIER_FILL[prize.tier];
          const mid = i * WHEEL_SEGMENT_ANGLE + WHEEL_SEGMENT_ANGLE / 2;
          const rad = ((mid - 90) * Math.PI) / 180;
          const lx = 100 + 62 * Math.cos(rad);
          const ly = 100 + 62 * Math.sin(rad);
          return (
            <g key={prize.id}>
              <path
                d={segmentPath(i, count, 92)}
                fill={`url(#wheel-seg-${prize.id})`}
                stroke={pal.stroke}
                strokeWidth="0.35"
                className={cn(
                  prize.tier === "ultimate" && "wheel-seg-ultimate"
                )}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${mid}, ${lx}, ${ly})`}
                className={cn(
                  "wheel-svg-label",
                  prize.tier === "ultimate" && "wheel-svg-label-ultimate",
                  prize.tier === "epic" && "wheel-svg-label-epic"
                )}
              >
                {prize.shortLabel}
              </text>
            </g>
          );
        })}

        <circle
          cx="100"
          cy="100"
          r="91"
          fill="none"
          stroke="rgba(0,240,255,0.25)"
          strokeWidth="0.5"
        />
        <circle
          cx="100"
          cy="100"
          r="38"
          fill="var(--app-surface)"
          stroke="rgba(0,240,255,0.35)"
          strokeWidth="1"
          filter="url(#wheel-inner-glow)"
        />
      </svg>
    </div>
  );
}
