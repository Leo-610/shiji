"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { sendEmailLoginOtp } from "@/lib/email-otp";
import {
  rateLimitEmailOtpVerify,
  rateLimitEmailSignIn,
} from "@/lib/rate-limit";

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

  const result = await sendEmailLoginOtp(email);
  if (result.error) {
    return { error: result.error };
  }

  return { success: true, email: result.email };
}

export async function verifyEmailOtp(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const code = (formData.get("code") as string)?.trim();
  const callbackUrl = (formData.get("callbackUrl") as string)?.trim();
  const safeCallback =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/discussions";

  if (!email || !code) {
    return { error: "请输入验证码" };
  }

  const rate = await rateLimitEmailOtpVerify(email);
  if (!rate.allowed) {
    return { error: rate.error };
  }

  try {
    await signIn("email-otp", {
      email,
      code,
      redirectTo: safeCallback,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "验证码错误或已过期" };
    }
    throw error;
  }

  return { error: "验证码错误或已过期" };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
