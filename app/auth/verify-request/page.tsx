import Link from "next/link";
import { Mail } from "lucide-react";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/cyber/GlitchText";

export default function VerifyRequestPage() {
  return (
    <div className="max-w-md mx-auto py-16">
      <div className="text-center mb-8">
        <GlitchText as="h1" className="text-2xl font-bold mb-2">
          查收邮件
        </GlitchText>
        <p className="text-sm text-gray-500">登录链接已发送</p>
      </div>

      <NeonCard className="p-8 text-center space-y-4">
        <Mail className="size-12 text-cyan-400 mx-auto opacity-80" />
        <p className="text-gray-300 text-sm leading-relaxed">
          我们已向你的邮箱发送了一封包含登录链接的邮件。
          点击邮件中的按钮即可登录，链接 24 小时内有效。
        </p>
        <p className="text-xs text-gray-500">
          没收到？检查垃圾箱，或稍等几分钟后重试。
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
