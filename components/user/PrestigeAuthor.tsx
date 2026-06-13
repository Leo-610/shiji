import { Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LevelBadge } from "@/components/user/LevelBadge";
import { cn } from "@/lib/utils";
import { isSuperAdmin } from "@/lib/roles";

interface PrestigeAuthorProps {
  name: string;
  image?: string | null;
  role?: string | null;
  level?: number | null;
  isThreadOp?: boolean;
  size?: "xs" | "sm" | "md";
  showAvatar?: boolean;
  showLevel?: boolean;
  className?: string;
}

export function PrestigeAuthor({
  name,
  image,
  role,
  level,
  isThreadOp = false,
  size = "md",
  showAvatar = true,
  showLevel = true,
  className,
}: PrestigeAuthorProps) {
  const admin = isSuperAdmin(role);
  const avatarSize =
    size === "xs" ? "size-6" : size === "sm" ? "size-8" : "size-10";
  const wrapClass = admin
    ? "svip-avatar-wrap-admin"
    : isThreadOp
      ? "svip-avatar-wrap-op"
      : null;

  const nameStyleClass = admin
    ? "svip-name-admin"
    : isThreadOp
      ? "svip-name-op"
      : "text-theme-heading";

  const avatarBlock = wrapClass ? (
    <div className={cn("shrink-0", wrapClass, avatarSize)}>
      <div className={cn("svip-avatar-inner", avatarSize)}>
        <Avatar className="size-full">
          <AvatarImage src={image ?? undefined} />
          <AvatarFallback>{name[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="svip-avatar-shimmer" aria-hidden />
      </div>
    </div>
  ) : (
    <Avatar className={cn("shrink-0 border border-[color:var(--app-border)]", avatarSize)}>
      <AvatarImage src={image ?? undefined} />
      <AvatarFallback>{name[0]?.toUpperCase() ?? "?"}</AvatarFallback>
    </Avatar>
  );

  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      {showAvatar && avatarBlock}

      <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
        <span
          className={cn(
            "font-medium truncate",
            size === "xs" ? "text-xs" : size === "sm" ? "text-sm" : "text-base",
            nameStyleClass
          )}
        >
          {name}
        </span>
        {admin && (
          <span className="svip-badge svip-badge-admin">
            <Crown className="size-3 shrink-0" aria-hidden />
            至尊站长
          </span>
        )}
        {showLevel && level && level > 0 && !admin && (
          <LevelBadge level={level} className="scale-90" />
        )}
        {isThreadOp && <span className="svip-badge svip-badge-op">贴主</span>}
      </div>
    </div>
  );
}
