"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Coins,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  PenLine,
  ShoppingBag,
  Trophy,
  X,
} from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LevelBadge } from "@/components/user/LevelBadge";
import { AvatarWithFrame } from "@/components/user/AvatarWithFrame";
import { isSuperAdmin } from "@/lib/roles";
import { getLevelTitle } from "@/lib/level";
import { cn } from "@/lib/utils";

export type MobileNavUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  level?: number;
  points?: number;
  equippedAvatarFrame?: string | null;
};

interface MobileNavDrawerProps {
  user?: MobileNavUser | null;
}

const navLinks: {
  href: string;
  label: string;
  icon: typeof MessageSquare;
  highlight?: boolean;
  authOnly?: boolean;
}[] = [
  { href: "/discussions", label: "讨论区", icon: MessageSquare },
  { href: "/discussions/new", label: "发帖", icon: PenLine, highlight: true },
  { href: "/shop", label: "积分商店", icon: ShoppingBag, authOnly: true },
  { href: "/profile", label: "我的等级 · 成就", icon: Trophy, authOnly: true },
];

export function MobileNavDrawer({ user }: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const links = navLinks.filter((link) => !link.authOnly || user);

  const overlay =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              className="mobile-nav-backdrop"
              aria-label="关闭菜单"
              onClick={() => setOpen(false)}
            />
            <div className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="站点导航">
              <div className="mobile-nav-header">
                <span className="text-xs font-orbitron tracking-widest text-theme-accent uppercase">
                  导航
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label="关闭菜单"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="mobile-nav-body">
                {user ? (
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="mobile-nav-user-card"
                  >
                    <AvatarWithFrame
                      name={user.name}
                      image={user.image}
                      role={user.role}
                      frameSlug={user.equippedAvatarFrame}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-theme-heading truncate">
                        {user.name ?? "读者"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <LevelBadge level={user.level ?? 1} />
                        <span className="text-xs text-theme-accent">
                          {getLevelTitle(user.level ?? 1)}
                        </span>
                        {isSuperAdmin(user.role) && (
                          <span className="svip-badge svip-badge-admin">至尊</span>
                        )}
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-theme-muted mt-1.5">
                        <Coins className="size-3 text-theme-accent shrink-0" />
                        <span className="font-orbitron text-theme-heading tabular-nums">
                          {Number.isFinite(Number(user.points))
                            ? Number(user.points)
                            : 0}
                        </span>
                        <span>积分</span>
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="mobile-nav-guest-card">
                    <p className="text-sm text-theme-muted mb-3 leading-relaxed">
                      登录后可签到、兑换装扮与解锁成就
                    </p>
                    <Link href="/auth/signin" onClick={() => setOpen(false)}>
                      <Button size="sm" className="w-full">
                        <LogIn className="size-4" />
                        登录
                      </Button>
                    </Link>
                  </div>
                )}

                <nav className="mobile-nav-list">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "mobile-nav-link",
                          link.highlight && "mobile-nav-link-highlight"
                        )}
                      >
                        <Icon className="size-4 shrink-0 opacity-90" />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="mobile-nav-footer">
                <div className="flex items-center justify-between gap-2 py-1">
                  <span className="text-xs text-theme-muted">主题</span>
                  <ThemeToggle />
                </div>
                {user && (
                  <form action={signOutAction}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-theme-muted hover:text-theme-heading"
                    >
                      <LogOut className="size-4" />
                      退出登录
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <div className="sm:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        aria-label="打开菜单"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="size-4" />
      </Button>
      {overlay}
    </div>
  );
}
