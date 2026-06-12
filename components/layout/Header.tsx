import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-orbitron text-lg font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
            SHIJI
          </span>
          <span className="text-xs text-purple-400/80 hidden sm:inline">
            // 科幻讨论区
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/discussions"
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors px-2 py-1"
          >
            讨论区
          </Link>
          <Link
            href="/discussions/new"
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors px-2 py-1"
          >
            发帖
          </Link>

          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <Avatar className="size-7">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-300 hidden sm:inline max-w-[100px] truncate">
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
