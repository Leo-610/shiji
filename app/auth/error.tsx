"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-4">
      <h1 className="text-xl font-bold text-theme-heading">页面加载失败</h1>
      <p className="text-sm text-theme-muted leading-relaxed">
        可能是网络或缓存问题。请刷新页面重试；若刚发送验证码，也可返回登录页重新发送。
      </p>
      <div className="flex flex-col gap-2">
        <Button type="button" onClick={reset} className="w-full">
          重试
        </Button>
        <Link href="/auth/signin">
          <Button variant="outline" className="w-full" type="button">
            返回登录
          </Button>
        </Link>
      </div>
    </div>
  );
}
