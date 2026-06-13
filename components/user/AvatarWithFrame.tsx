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

const sizeMap = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
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
  const avatarSize = sizeMap[size];
  const shopFrame = !admin ? getFrameClass(frameSlug) : null;

  const wrapClass = admin
    ? "svip-avatar-wrap-admin"
    : shopFrame ?? null;

  const fallback = name?.[0]?.toUpperCase() ?? "U";

  if (wrapClass) {
    return (
      <div className={cn("shrink-0", wrapClass, avatarSize, className)}>
        <div className={cn("svip-avatar-inner", avatarSize)}>
          <Avatar className="size-full">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div className="svip-avatar-shimmer" aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <Avatar
      className={cn(
        "shrink-0 border border-[color:var(--app-border)]",
        avatarSize,
        className
      )}
    >
      <AvatarImage src={image ?? undefined} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
