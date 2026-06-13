"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/app/actions/auth";

export function EmailSignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const result = await signInWithEmail(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    if (result?.success && result.email) {
      window.location.assign(
        `/auth/verify-code?email=${encodeURIComponent(result.email)}`
      );
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">邮箱地址</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="reader@example.com"
          required
          autoComplete="email"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        <Mail className="size-4" />
        {pending ? "发送中…" : "发送验证码"}
      </Button>
      <p className="text-xs text-theme-muted text-center">
        我们将向你的邮箱发送 6 位验证码，10 分钟内有效。在站内输入即可登录，无需点击邮件链接
      </p>
    </form>
  );
}
