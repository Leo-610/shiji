const RESEND_API_URL = "https://api.resend.com/emails";

export function getResendApiKey(): string | null {
  return process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY ?? null;
}

/** Verified sender on shiji.ink — set AUTH_RESEND_FROM after Resend domain setup. */
export function getResendFromAddress(): string {
  return (
    process.env.AUTH_RESEND_FROM ??
    process.env.RESEND_FROM ??
    "量子余烬 <notify@shiji.ink>"
  );
}

export async function sendResendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { ok: false, error: "邮箱服务尚未配置" };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getResendFromAddress(),
        to,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Resend API error:", response.status, body);
      return { ok: false, error: "邮件发送失败，请稍后再试" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "邮件发送失败，请稍后再试" };
  }
}
