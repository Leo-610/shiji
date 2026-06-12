import Link from "next/link";
import { ArrowRight, MessageSquare, Users } from "lucide-react";
import { GlitchText } from "@/components/cyber/GlitchText";
import { HeroReveal } from "@/components/cyber/HeroReveal";
import { NovelCover3D } from "@/components/cyber/NovelCover3D";
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
      <section className="relative py-12 sm:py-20">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-1/2 -translate-y-1/2 left-[5%] lg:left-[2%] h-[260px] w-[380px] rounded-full blur-[90px] opacity-[0.14]"
            style={{
              background:
                "radial-gradient(circle, rgba(91,159,212,0.35) 0%, rgba(61,98,133,0.12) 45%, transparent 72%)",
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            <HeroReveal delay={0.1} className="shrink-0">
              <NovelCover3D size="lg" priority />
            </HeroReveal>

          <div className="relative flex-1 text-center lg:text-left">
            <div
              className="pointer-events-none absolute -inset-x-4 -inset-y-2 -z-10 rounded-2xl bg-[#0a0a0f]/55 lg:bg-gradient-to-r lg:from-[#0a0a0f]/75 lg:via-[#0a0a0f]/45 lg:to-transparent"
              aria-hidden
            />
            <HeroReveal delay={0.05}>
              <p className="font-display text-[11px] tracking-[0.12em] text-gray-500 mb-4 uppercase">
                Sci-Fi Planet Award · Novel Forum
              </p>
            </HeroReveal>

            <HeroReveal delay={0.15}>
              <GlitchText className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 !font-[family-name:var(--font-noto)]">
                量子余烬
              </GlitchText>
            </HeroReveal>

            <HeroReveal delay={0.25}>
              <p className="text-sm text-gray-400 mb-4">
                作者笔名：时寂
              </p>
            </HeroReveal>

            <HeroReveal delay={0.35}>
              <h2 className="text-xl sm:text-2xl text-gray-200 mb-2 font-light">
                当意识可以被数据化，死亡还算终点吗？
              </h2>
            </HeroReveal>

            <HeroReveal delay={0.45}>
              <p className="text-gray-300/90 max-w-2xl mb-8 text-sm sm:text-base leading-relaxed lg:mx-0 mx-auto">
                《量子余烬》是一部以量子意识与灵魂数据化为核心的近未来硬科幻长篇。
                人类发现意识源于神经元微管中的量子相干过程，由此诞生了捕获、储存乃至延续意识的技术——
                当悲欢可以被量化，普通人走进将意识商业化的阴影里，每一步都在追问：
                我们怕失去的，究竟是那个人，还是关于那个人的一切记忆？
                欢迎加入讨论，你的每一个建议都可能改变故事的走向。
              </p>
            </HeroReveal>

            <HeroReveal delay={0.55}>
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Link href="/discussions">
                  <Button size="lg">
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
            </HeroReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto">
        <NeonCard className="p-6 text-center">
          <MessageSquare className="size-6 text-[var(--color-cyber-accent-bright)] mx-auto mb-2 opacity-80" />
          <p className="text-3xl font-semibold tabular-nums text-gray-100">
            {stats.threads}
          </p>
          <p className="text-sm text-gray-500 mt-1">讨论帖</p>
        </NeonCard>
        <NeonCard className="p-6 text-center">
          <Users className="size-6 text-[var(--color-cyber-accent-bright)] mx-auto mb-2 opacity-80" />
          <p className="text-3xl font-semibold tabular-nums text-gray-100">
            {stats.comments}
          </p>
          <p className="text-sm text-gray-500 mt-1">评论</p>
        </NeonCard>
      </section>

      {/* Recent discussions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-200">
            最新讨论
          </h2>
          <Link
            href="/discussions"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
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
      <section className="text-center py-8 space-y-6">
        <NeonCard className="p-8 max-w-3xl mx-auto">
          <p className="font-display text-[11px] tracking-[0.12em] text-gray-500 mb-3 uppercase">
            ABOUT · 作品简介
          </p>
          <p className="text-gray-400 text-sm leading-relaxed text-left sm:text-center">
            《量子余烬》以严谨的硬科幻推演为骨，以亲情与人物成长为魂：谁有权决定一段意识的命运？
            当技术把「复活」变成商品，少年林川为留住最在乎的人，一步步走进他从未预料的深渊。
            作品入围第四届科幻星球大赛文学方向新星扶持计划（全球仅 4 项），探讨意识上传、伦理困境与人性温度——
            不给标准答案，只把问题留在读者心里：如果今天技术真的能留住你最在乎的人，
            你愿意付出什么代价，又能接受什么代价？
          </p>
        </NeonCard>

        <NeonCard className="p-6 max-w-3xl mx-auto">
          <p className="font-display text-[11px] tracking-[0.12em] text-gray-500 mb-3 uppercase">
            FORUM · 讨论区说明
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            这里是《量子余烬》的读者共创空间，由作者「时寂」主持交流。
            你可以讨论世界观设定、角色弧光、剧情反转与写作建议，匿名发言或登录后管理自己的帖子。
            科幻星球大赛倡导「科幻 + 科技 + 人文」的融合表达——期待听见你对这部作品的每一次真诚追问。
          </p>
        </NeonCard>
      </section>
    </div>
  );
}
