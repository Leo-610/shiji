import type { FrameTheme } from "@/lib/shop-items";

function gemPoints(cx: number, cy: number, radius: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const rad = ((360 / count) * i * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  });
}

export function AvatarFrameSvg({ theme }: { theme: FrameTheme }) {
  const { id, primary, secondary, accent, glow, rarity, frameStyle } = theme;
  const uid = id.replace(/[^a-z0-9-]/gi, "");
  const style = frameStyle ?? "gems";
  const gemCount =
    style === "entropy" ? 6 : style === "gems" ? 5 : rarity === "legendary" ? 8 : 4;
  const gems = gemPoints(50, 50, 46.5, gemCount);
  const arcs = gemPoints(50, 50, 44, 4);
  const isEpic = rarity === "epic" || rarity === "legendary";
  const showChevrons = isEpic || style === "prism";

  return (
    <svg
      viewBox="0 0 100 100"
      className="avatar-frame-svg"
      aria-hidden
      overflow="visible"
    >
      <defs>
        <linearGradient id={`fg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="45%" stopColor={accent} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id={`fg2-${uid}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={primary} />
        </linearGradient>
        {style === "prism" && (
          <linearGradient id={`fg3-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="33%" stopColor={accent} />
            <stop offset="66%" stopColor={secondary} />
            <stop offset="100%" stopColor={primary} />
          </linearGradient>
        )}
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor={glow} stopOpacity="0" />
          <stop offset="78%" stopColor={glow} stopOpacity="0.35" />
          <stop offset="100%" stopColor={glow} stopOpacity="0.65" />
        </radialGradient>
        <filter id={`soft-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="49"
        fill={`url(#glow-${uid})`}
        className="avatar-frame-breathe"
      />

      <g className="avatar-frame-rotate-slow" filter={`url(#soft-${uid})`}>
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={`url(#fg-${uid})`}
          strokeWidth={style === "entropy" ? 3 : 2.8}
        />
        {style !== "prism" &&
          gems.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={style === "entropy" ? 2.2 : rarity === "legendary" ? 2.4 : 2}
              fill={accent}
              opacity="0.95"
            />
          ))}
      </g>

      <g className="avatar-frame-rotate-fast">
        <circle
          cx="50"
          cy="50"
          r="43.5"
          fill="none"
          stroke={accent}
          strokeWidth={style === "entropy" ? 1.6 : 1.2}
          strokeDasharray={style === "entropy" ? "3 5" : "5 7"}
          opacity="0.75"
        />
      </g>

      {style === "entropy" && (
        <g className="avatar-frame-rotate-reverse">
          <circle
            cx="50"
            cy="50"
            r="41"
            fill="none"
            stroke={primary}
            strokeWidth="1.4"
            strokeDasharray="8 6"
            opacity="0.55"
          />
        </g>
      )}

      {style === "prism" && (
        <g className="avatar-frame-rotate-fast" opacity="0.9">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#fg3-${uid})`}
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <circle
            cx="50"
            cy="50"
            r="40.5"
            fill="none"
            stroke={accent}
            strokeWidth="1.1"
            strokeDasharray="2 6"
            opacity="0.8"
          />
        </g>
      )}

      {showChevrons && (
        <g className="avatar-frame-rotate-slow" opacity="0.85">
          {arcs.map((p, i) => (
            <path
              key={i}
              d={`M ${p.x} ${p.y} l 3 -5 l 3 5`}
              fill="none"
              stroke={primary}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      )}

      <circle
        cx="50"
        cy="50"
        r="39.5"
        fill="none"
        stroke={`url(#fg2-${uid})`}
        strokeWidth="2.2"
        opacity="0.9"
      />

      {rarity === "legendary" && (
        <g filter={`url(#soft-${uid})`}>
          <path
            d="M46 10 L50 5 L54 10 L52 14 L48 14 Z"
            fill={primary}
            opacity="0.9"
          />
          <path
            d="M42 14 L50 8 L58 14"
            fill="none"
            stroke={accent}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}

export function AdminFrameSvg() {
  return (
    <AvatarFrameSvg
      theme={{
        id: "admin",
        primary: "#ffd700",
        secondary: "#ff6b6b",
        accent: "#48dbfb",
        glow: "#ffd700",
        rarity: "legendary",
      }}
    />
  );
}
