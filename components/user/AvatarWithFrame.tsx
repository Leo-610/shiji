import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFrameClass } from "@/lib/shop-items";
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

/** Plain avatar diameter (no frame). */
const plainSizeMap = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
};

const shellSizeMap = {
  xs: "avatar-shell-xs",
  sm: "avatar-shell-sm",
  md: "avatar-shell-md",
  lg: "avatar-shell-lg",
};

export function AvatarWithFrame({
  name,
  image,
  role,
  frameSlug,
  size = "md",
  className,
}: AvatarWithFrameProps) {
  const admin = isSuperAdmin(role);
  const shopFrame = !admin ? getFrameClass(frameSlug) : null;
  const frameClass = admin ? "avatar-frame-admin" : shopFrame;
  const fallback = name?.[0]?.toUpperCase() ?? "U";

  if (frameClass) {
    return (
      <div
        className={cn(
          "avatar-frame-shell",
          shellSizeMap[size],
          frameClass,
          className
        )}
      >
        <div className="avatar-frame-halo" aria-hidden />
        <div className="avatar-frame-orbit" aria-hidden />
        <div className="avatar-frame-ring" aria-hidden />
        <div className="avatar-frame-face">
          <Avatar className="size-full">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div className="avatar-frame-shine" aria-hidden />
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
