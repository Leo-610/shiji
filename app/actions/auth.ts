"use server";

import { signIn, signOut } from "@/lib/auth";
import { rateLimitEmailSignIn } from "@/lib/rate-limit";

export async function signInWithEmail(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "请输入有效的邮箱地址" };
  }

  if (!process.env.AUTH_RESEND_KEY && !process.env.RESEND_API_KEY) {
    return { error: "邮箱登录尚未配置" };
  }

  const rate = await rateLimitEmailSignIn();
  if (!rate.allowed) {
    return { error: rate.error };
  }

  await signIn("resend", {
    email,
    redirectTo: "/discussions",
  });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
