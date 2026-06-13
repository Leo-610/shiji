import Link from "next/link";
import { Coins } from "lucide-react";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LevelBadge } from "@/components/user/LevelBadge";
import { AvatarWithFrame } from "@/components/user/AvatarWithFrame";
import { isSuperAdmin } from "@/lib/roles";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    level?: number;
    points?: number;
    equippedAvatarFrame?: string | null;
  } | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-theme-subtle backdrop-blur-md"
      style={{ backgroundColor: "var(--app-header-bg)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-bold text-theme-accent group-hover:opacity-80 transition-opacity tracking-wide">
            量子余烬
          </span>
          <span className="text-xs text-theme-accent-secondary hidden sm:inline opacity-80">
            {"// 时寂"}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/discussions"
            className="text-sm text-theme-muted hover:text-theme-accent transition-colors px-2 py-1"
          >
            讨论区
          </Link>
          <Link
            href="/discussions/new"
            className="text-sm text-theme-muted hover:text-theme-accent transition-colors px-2 py-1"
          >
            发帖
          </Link>
          {user && (
            <>
              <Link
                href="/shop"
                className="text-sm text-theme-muted hover:text-theme-accent transition-colors px-2 py-1 hidden sm:inline"
              >
                商店
              </Link>
              <Link
                href="/profile"
                className="text-sm text-theme-muted hover:text-theme-accent transition-colors px-2 py-1 hidden sm:inline"
              >
                等级
              </Link>
            </>
          )}

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 ml-1">
              <Link
                href="/shop"
                title="积分商店"
                className="hidden sm:flex items-center gap-1.5 text-xs text-theme-muted hover:text-theme-accent transition-colors"
              >
                <Coins className="size-3.5 shrink-0 text-theme-accent" aria-hidden />
                <span className="tabular-nums text-theme-heading font-medium">
                  {Number.isFinite(Number(user.points))
                    ? Number(user.points)
                    : 0}
                </span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <AvatarWithFrame
                  name={user.name}
                  image={user.image}
                  role={user.role}
                  frameSlug={user.equippedAvatarFrame}
                  size="sm"
                />
                <LevelBadge level={user.level ?? 1} className="hidden sm:inline-flex" />
              </Link>
              <span className="text-sm text-theme-heading hidden md:inline max-w-[100px] truncate">
                {user.name}
              </span>
              {isSuperAdmin(user.role) && (
                <span className="svip-badge svip-badge-admin hidden sm:inline-flex">
                  至尊
                </span>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="ghost" size="sm" type="submit">
                  退出
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">
                登录
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
