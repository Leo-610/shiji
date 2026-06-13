import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, threads, comments } from "@/lib/db/schema";

const threadListOrder = [
  desc(threads.pinned),
  desc(threads.pinnedAt),
  desc(threads.createdAt),
];

export async function getCategories() {
  return db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });
}

export async function getStats() {
  const [threadCount] = await db.select({ count: count() }).from(threads);
  const [commentCount] = await db.select({ count: count() }).from(comments);
  return {
    threads: threadCount?.count ?? 0,
    comments: commentCount?.count ?? 0,
  };
}

export async function getRecentThreads(limit = 5) {
  return db.query.threads.findMany({
    limit,
    orderBy: threadListOrder,
    with: {
      category: true,
      author: true,
      comments: true,
    },
  });
}

export async function getThreads(categorySlug?: string) {
  if (categorySlug) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });
    if (!category) return [];

    return db.query.threads.findMany({
      where: eq(threads.categoryId, category.id),
      orderBy: threadListOrder,
      with: {
        category: true,
        author: true,
        comments: true,
      },
    });
  }

  return db.query.threads.findMany({
    orderBy: threadListOrder,
    with: {
      category: true,
      author: true,
      comments: true,
    },
  });
}

export async function getThreadBySlug(slug: string) {
  return db.query.threads.findFirst({
    where: eq(threads.slug, slug),
    with: {
      category: true,
      author: true,
      comments: {
        orderBy: (c, { asc }) => [asc(c.createdAt)],
        with: {
          author: true,
        },
      },
    },
  });
}
