import Link from "next/link";
import { redirect } from "next/navigation";
import { NeonCard } from "@/components/cyber/NeonCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Button } from "@/components/ui/button";
import { VerifyCodeForm } from "@/components/auth/VerifyCodeForm";

export default async function VerifyCodePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; callbackUrl?: string }>;
}) {
  const { email: rawEmail, callbackUrl } = await searchParams;
  const email = rawEmail?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/auth/signin");
  }

  const safeCallback =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/discussions";

  return (
    <div className="max-w-md mx-auto py-16">
      <div className="text-center mb-8">
        <GlitchText as="h1" className="text-2xl font-bold mb-2">
          输入验证码
        </GlitchText>
        <p className="text-sm text-theme-muted">在站内完成登录，无需点击邮件链接</p>
      </div>

      <NeonCard className="p-8 space-y-6">
        <VerifyCodeForm email={email} callbackUrl={safeCallback} />
        <Link href="/auth/signin">
          <Button variant="outline" className="w-full" type="button">
            返回重新发送
          </Button>
        </Link>
      </NeonCard>
    </div>
  );
}
