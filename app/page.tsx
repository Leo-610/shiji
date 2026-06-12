import Link from "next/link";
import { ArrowRight, MessageSquare, Users } from "lucide-react";
import { GlitchText } from "@/components/cyber/GlitchText";
import { NeonCard } from "@/components/cyber/NeonCard";
import { ThreadCard } from "@/components/discussion/ThreadCard";
import { Button } from "@/components/ui/button";
import { getRecentThreads, getStats } from "@/lib/queries";

export default async function HomePage() {
  const [stats, recentThreads] = await Promise.all([
    getStats(),
    getRecentThreads(5),
  ]);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 text-center">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div
            className="h-[300px] w-[600px] rounded-full opacity-10 blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, #00f0ff 0%, #bf00ff 50%, transparent 70%)",
            }}
          />
        </div>

        <p className="font-orbitron text-xs tracking-[0.3em] text-purple-400 mb-4 uppercase">
          Sci-Fi Novel Forum
        </p>

        <GlitchText className="text-4xl sm:text-6xl font-bold mb-4">
          史记
        </GlitchText>

        <h2 className="text-xl sm:text-2xl text-gray-300 mb-2 font-light">
          一部尚未写完的科幻史诗
        </h2>

        <p className="text-gray-500 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
          在霓虹与暗影交织的未来都市，一段关于记忆、身份与真相的故事正在书写。
          欢迎加入讨论，你的每一个建议都可能改变故事的走向。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/discussions">
            <Button size="lg" className="font-orbitron tracking-wider">
              进入讨论区
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/discussions/new">
            <Button variant="outline" size="lg">
              发表建议
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto">
        <NeonCard className="p-6 text-center" glow="cyan">
          <MessageSquare className="size-6 text-cyan-400 mx-auto mb-2" />
          <p className="font-orbitron text-3xl font-bold text-cyan-400">
            {stats.threads}
          </p>
          <p className="text-sm text-gray-500 mt-1">讨论帖</p>
        </NeonCard>
        <NeonCard className="p-6 text-center" glow="purple">
          <Users className="size-6 text-purple-400 mx-auto mb-2" />
          <p className="font-orbitron text-3xl font-bold text-purple-400">
            {stats.comments}
          </p>
          <p className="text-sm text-gray-500 mt-1">评论</p>
        </NeonCard>
      </section>

      {/* Recent discussions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-cyan-300">
            最新讨论
          </h2>
          <Link
            href="/discussions"
            className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
          >
            查看全部 →
          </Link>
        </div>

        {recentThreads.length > 0 ? (
          <div className="space-y-3">
            {recentThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        ) : (
          <NeonCard className="p-12 text-center">
            <p className="text-gray-500 mb-4">还没有讨论，成为第一个发言的读者</p>
            <Link href="/discussions/new">
              <Button>发起第一个讨论</Button>
            </Link>
          </NeonCard>
        )}
      </section>

      {/* About */}
      <section className="text-center py-8">
        <NeonCard className="p-8 max-w-2xl mx-auto" glow="purple">
          <p className="font-orbitron text-xs tracking-[0.2em] text-cyan-400/60 mb-3">
            ABOUT THIS PROJECT
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            这是一个开放的小说创作讨论空间。无论你是资深科幻迷还是偶然路过的读者，
            都可以在这里分享对世界观、角色、剧情走向的看法，帮助作者打磨这部科幻作品。
            匿名发言或登录后管理自己的帖子，选择权在你手中。
          </p>
        </NeonCard>
      </section>
    </div>
  );
}
