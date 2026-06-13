import { Crown } from "lucide-react";
import { LevelBadge } from "@/components/user/LevelBadge";
import { AvatarWithFrame } from "@/components/user/AvatarWithFrame";
import { getTitleBadge, getTitleBadgeClass } from "@/lib/shop-items";
import { cn } from "@/lib/utils";
import { isSuperAdmin } from "@/lib/roles";

interface PrestigeAuthorProps {
  name: string;
  image?: string | null;
  role?: string | null;
  level?: number | null;
  avatarFrame?: string | null;
  titleBadge?: string | null;
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
  avatarFrame,
  titleBadge,
  isThreadOp = false,
  size = "md",
  showAvatar = true,
  showLevel = true,
  className,
}: PrestigeAuthorProps) {
  const admin = isSuperAdmin(role);
  const shopBadge = !admin ? getTitleBadge(titleBadge) : null;

  const nameStyleClass = admin
    ? "svip-name-admin"
    : isThreadOp
      ? "svip-name-op"
      : "text-theme-heading";

  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      {showAvatar && (
        <AvatarWithFrame
          name={name}
          image={image}
          role={role}
          frameSlug={avatarFrame}
          size={size}
        />
      )}

      <div className="flex items-center gap-1.5 min-w-0 flex-wrap max-w-full">
        <span
          className={cn(
            "font-medium truncate max-w-[9rem] sm:max-w-[12rem]",
            size === "xs" ? "text-xs" : size === "sm" ? "text-sm" : "text-base",
            nameStyleClass
          )}
        >
          {name}
        </span>
        <div className="flex items-center gap-1 flex-wrap max-w-full">
        {admin && (
          <span className="svip-badge svip-badge-admin shrink-0">
            <Crown className="size-3 shrink-0" aria-hidden />
            <span className="max-sm:hidden">至尊站长</span>
            <span className="sm:hidden">至尊</span>
          </span>
        )}
        {shopBadge && (
          <span
            className={cn(
              "shop-title-badge shop-title-badge-inline shrink-0 max-w-[7rem] truncate",
              getTitleBadgeClass(titleBadge)
            )}
          >
            {shopBadge}
          </span>
        )}
        {showLevel && level && level > 0 && !admin && (
          <LevelBadge level={level} className="scale-90 shrink-0" />
        )}
        {isThreadOp && (
          <span className="svip-badge svip-badge-op shrink-0">贴主</span>
        )}
        </div>
      </div>
    </div>
  );
}
