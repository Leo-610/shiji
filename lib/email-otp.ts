import { randomInt } from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { verificationTokens } from "@/lib/db/schema";
import { sendResendEmail } from "@/lib/resend";

const OTP_TTL_MS = 10 * 60 * 1000;

function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function sendEmailLoginOtp(email: string) {
  const code = generateOtpCode();
  const expires = new Date(Date.now() + OTP_TTL_MS);

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, email));

  await db.insert(verificationTokens).values({
    identifier: email,
    token: code,
    expires,
  });

  const minutes = OTP_TTL_MS / 60000;

  const result = await sendResendEmail({
    to: email,
    subject: `【量子余烬】登录验证码 ${code}`,
    text: `你的登录验证码是 ${code}，${minutes} 分钟内有效。请在网站登录页输入验证码，勿将验证码转发给他人。`,
    html: `
      <div style="font-family:sans-serif;line-height:1.6;color:#111">
        <p style="font-size:16px;margin:0 0 12px">《量子余烬》读者论坛登录验证码</p>
        <p style="font-size:28px;font-weight:bold;letter-spacing:0.2em;margin:16px 0">${code}</p>
        <p style="font-size:14px;color:#555;margin:0 0 8px">验证码 ${minutes} 分钟内有效。</p>
        <p style="font-size:13px;color:#555;margin:0">请打开 <a href="https://shiji.ink/auth/signin">shiji.ink</a> 输入验证码完成登录。</p>
        <p style="font-size:12px;color:#888;margin:16px 0 0">请勿在微信内点击可疑链接；本邮件仅含验证码，无需点击任何按钮。</p>
      </div>
    `,
  });

  if (!result.ok) {
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, email),
          eq(verificationTokens.token, code)
        )
      );
    return { error: result.error };
  }

  return { success: true as const, email };
}

export async function verifyEmailLoginOtp(email: string, code: string) {
  const normalizedCode = code.trim();
  if (!/^\d{6}$/.test(normalizedCode)) {
    return false;
  }

  const row = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.identifier, email),
      eq(verificationTokens.token, normalizedCode)
    ),
  });

  if (!row || row.expires < new Date()) {
    return false;
  }

  await db
    .delete(verificationTokens)
    .where(
      and(
        eq(verificationTokens.identifier, email),
        eq(verificationTokens.token, normalizedCode)
      )
    );

  return true;
}
