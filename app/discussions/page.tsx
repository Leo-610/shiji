import Link from "next/link";
import { Plus } from "lucide-react";
import { ThreadCard } from "@/components/discussion/ThreadCard";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";
import { getCategories, getThreads } from "@/lib/queries";

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  const [categories, threads] = await Promise.all([
    getCategories(),
    getThreads(categorySlug),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cyan-300 font-orbitron tracking-wide">
            讨论区
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            按章节与话题浏览读者讨论
          </p>
        </div>
        <Link href="/discussions/new">
          <Button>
            <Plus className="size-4" />
            发帖
          </Button>
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <Link href="/discussions">
          <Button
            variant={!categorySlug ? "default" : "outline"}
            size="sm"
          >
            全部
          </Button>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/discussions?category=${cat.slug}`}>
            <Button
              variant={categorySlug === cat.slug ? "default" : "outline"}
              size="sm"
            >
              {cat.name}
            </Button>
          </Link>
        ))}
      </div>

      {/* Thread list */}
      {threads.length > 0 ? (
        <div className="space-y-3">
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      ) : (
        <NeonCard className="p-12 text-center">
          <p className="text-gray-500 mb-4">
            {categorySlug
              ? "该分类下暂无讨论"
              : "还没有讨论，成为第一个发言的读者"}
          </p>
          <Link href="/discussions/new">
            <Button>发起讨论</Button>
          </Link>
        </NeonCard>
      )}
    </div>
  );
}
