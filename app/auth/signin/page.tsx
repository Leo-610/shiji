import { signIn } from "@/lib/auth";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/cyber/GlitchText";
import { EmailSignInForm } from "@/components/auth/EmailSignInForm";

const githubConfigured =
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET;
const resendConfigured =
  process.env.AUTH_RESEND_KEY || process.env.RESEND_API_KEY;

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto py-16">
      <div className="text-center mb-8">
        <GlitchText as="h1" className="text-2xl font-bold mb-2">
          登录
        </GlitchText>
        <p className="text-sm text-gray-500">
          登录后可点赞、收藏并管理自己的帖子和评论
        </p>
      </div>

      <NeonCard className="p-8 space-y-6">
        {resendConfigured && (
          <div>
            <p className="text-xs font-orbitron tracking-widest text-cyan-400/70 mb-4 uppercase">
              邮箱魔法链接
            </p>
            <EmailSignInForm />
          </div>
        )}

        {resendConfigured && githubConfigured && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-cyan-500/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black/40 px-2 text-gray-500">或</span>
            </div>
          </div>
        )}

        {githubConfigured ? (
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/discussions" });
            }}
          >
            <Button type="submit" size="lg" className="w-full font-orbitron">
              使用 GitHub 登录
            </Button>
          </form>
        ) : (
          !resendConfigured && (
            <p className="text-sm text-gray-400 text-center">
              登录尚未配置。请在 Vercel 环境变量中设置 AUTH_GITHUB_ID / SECRET
              或 AUTH_RESEND_KEY。
            </p>
          )
        )}

        <p className="text-xs text-gray-500 text-center">
          不登录也可以匿名发帖和评论；点赞与收藏需登录
        </p>
      </NeonCard>
    </div>
  );
}
