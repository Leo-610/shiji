"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyEmailOtp } from "@/app/actions/auth";
import { WeChatEmailTip } from "@/components/auth/WeChatEmailTip";

interface VerifyCodeFormProps {
  email: string;
  callbackUrl?: string;
}

export function VerifyCodeForm({ email, callbackUrl = "/discussions" }: VerifyCodeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const result = await verifyEmailOtp(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <WeChatEmailTip />

      <div className="space-y-2">
        <Label htmlFor="code">6 位验证码</Label>
        <Input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="000000"
          required
          autoComplete="one-time-code"
          className="font-orbitron text-center text-lg tracking-[0.35em]"
        />
        <p className="text-[11px] text-theme-muted">
          已发送至 <span className="text-theme-heading">{email}</span>，10 分钟内有效
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        <KeyRound className="size-4" />
        {pending ? "验证中…" : "确认登录"}
      </Button>
    </form>
  );
}
