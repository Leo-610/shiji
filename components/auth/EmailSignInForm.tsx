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
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-400">
          邮箱地址
        </Label>
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
        {pending ? "发送中…" : "发送登录链接"}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        我们将向你的邮箱发送一次性登录链接，24 小时内有效
      </p>
    </form>
  );
}
