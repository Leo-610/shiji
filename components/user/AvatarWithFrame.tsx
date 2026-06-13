import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarFrameOverlay } from "@/components/user/AvatarFrameOverlay";
import { AvatarFrameSvg } from "@/components/user/AvatarFrameSvg";
import { ADMIN_LOTTIE_SRC } from "@/lib/lottie-frames";
import { getFrameTheme, type FrameTheme } from "@/lib/shop-items";
import { cn } from "@/lib/utils";
import { isSuperAdmin } from "@/lib/roles";

interface AvatarWithFrameProps {
  name?: string | null;
  image?: string | null;
  role?: string | null;
  frameSlug?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const plainSizeMap = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
};

const shellSizeMap = {
  xs: "avatar-premium-xs",
  sm: "avatar-premium-sm",
  md: "avatar-premium-md",
  lg: "avatar-premium-lg",
};

const ADMIN_THEME: FrameTheme = {
  id: "admin",
  primary: "#ffd700",
  secondary: "#ff6b6b",
  accent: "#48dbfb",
  glow: "#ffd700",
  rarity: "legendary",
  lottieSrc: ADMIN_LOTTIE_SRC,
};

function FrameOverlay({ theme }: { theme: FrameTheme }) {
  if (theme.lottieSrc) {
    return <AvatarFrameOverlay lottieSrc={theme.lottieSrc} theme={theme} />;
  }
  return <AvatarFrameSvg theme={theme} />;
}

export function AvatarWithFrame({
  name,
  image,
  role,
  frameSlug,
  size = "md",
  className,
}: AvatarWithFrameProps) {
  const admin = isSuperAdmin(role);
  const theme = admin ? ADMIN_THEME : getFrameTheme(frameSlug);
  const hasFrame = !!theme;
  const fallback = name?.[0]?.toUpperCase() ?? "U";

  if (hasFrame && theme) {
    return (
      <div
        className={cn(
          "avatar-premium-shell",
          shellSizeMap[size],
          theme.lottieSrc && "avatar-premium-animated",
          className
        )}
      >
        <div className="avatar-premium-face">
          <Avatar className="size-full">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
        </div>
        <div className="avatar-premium-overlay">
          <FrameOverlay theme={theme} />
        </div>
      </div>
    );
  }

  return (
    <Avatar
      className={cn(
        "shrink-0 border border-[color:var(--app-border)]",
        plainSizeMap[size],
        className
      )}
    >
      <AvatarImage src={image ?? undefined} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
