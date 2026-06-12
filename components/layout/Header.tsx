import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
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

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3 ml-1">
              <Avatar className="size-7">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-theme-heading hidden sm:inline max-w-[100px] truncate">
                {user.name}
              </span>
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
