import { AlertTriangle } from "lucide-react";

export function WeChatEmailTip({ variant = "default" }: { variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <p className="text-[11px] text-amber-400/90 leading-relaxed flex gap-1.5 items-start">
        <AlertTriangle className="size-3.5 shrink-0 mt-0.5" aria-hidden />
        <span>
          QQ / 微信内打开邮件可能被拦截。请复制验证码到浏览器登录，或使用 GitHub 登录。
        </span>
      </p>
    );
  }

  return (
    <div
      className="rounded-lg border border-amber-500/35 bg-amber-500/8 px-3 py-2.5 text-left space-y-1"
      role="note"
    >
      <p className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
        <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
        微信 / QQ 用户请注意
      </p>
      <p className="text-[11px] text-theme-muted leading-relaxed">
        请勿在微信里点击邮件中的链接（可能被误拦为不安全）。请在本站输入
        <strong className="text-theme-heading"> 6 位验证码 </strong>
        登录，或改用 Chrome / Safari 打开网站后使用 GitHub 登录。
      </p>
    </div>
  );
}
