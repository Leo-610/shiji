"use server";

import { signIn } from "@/lib/auth";

export async function signInWithEmail(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "请输入有效的邮箱地址" };
  }

  if (!process.env.AUTH_RESEND_KEY) {
    return { error: "邮箱登录尚未配置" };
  }

  await signIn("resend", {
    email,
    redirectTo: "/discussions",
  });
}
