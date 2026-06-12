import { signIn } from "@/lib/auth";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/cyber/GlitchText";

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto py-16">
      <div className="text-center mb-8">
        <GlitchText as="h1" className="text-2xl font-bold mb-2">
          登录
        </GlitchText>
        <p className="text-sm text-gray-500">
          登录后可管理自己的帖子和评论
        </p>
      </div>

      <NeonCard className="p-8">
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

        <p className="text-xs text-gray-500 text-center mt-6">
          不登录也可以匿名发帖和评论
        </p>
      </NeonCard>
    </div>
  );
}
