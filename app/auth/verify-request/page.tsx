import Link from "next/link";
import { Mail } from "lucide-react";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/cyber/GlitchText";
import { WeChatEmailTip } from "@/components/auth/WeChatEmailTip";

export default function VerifyRequestPage() {
  return (
    <div className="max-w-md mx-auto py-16">
      <div className="text-center mb-8">
        <GlitchText as="h1" className="text-2xl font-bold mb-2">
          查收邮件
        </GlitchText>
        <p className="text-sm text-theme-muted">验证码已发送</p>
      </div>

      <NeonCard className="p-8 text-center space-y-4">
        <Mail className="size-12 text-theme-accent mx-auto opacity-80" />
        <WeChatEmailTip />
        <p className="text-theme-heading text-sm leading-relaxed">
          我们已向你的邮箱发送了一封包含
          <strong className="text-theme-accent"> 6 位验证码 </strong>
          的邮件。请在本站登录页输入验证码完成登录，无需点击邮件中的任何链接。
        </p>
        <p className="text-xs text-theme-muted">
          没收到？检查垃圾箱，或返回登录页重新发送。验证码 10 分钟内有效。
        </p>
        <Link href="/auth/signin">
          <Button variant="outline" className="w-full">
            返回登录
          </Button>
        </Link>
      </NeonCard>
    </div>
  );
}
