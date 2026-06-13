import { and, eq } from "drizzle-orm";
import { awardPoints } from "@/lib/award";
import { getWeeklyTaskPointBonus } from "@/lib/points";
import { formatWeekRangeLabel, getWeekStartInShanghai } from "@/lib/date";
import { db } from "@/lib/db";
import { userWeeklyTasks } from "@/lib/db/schema";

export type WeeklyTaskId = "post_thread" | "post_comments" | "check_in_days";

export interface WeeklyTaskDef {
  id: WeeklyTaskId;
  name: string;
  description: string;
  target: number;
  points: number;
}

export const WEEKLY_TASKS: WeeklyTaskDef[] = [
  {
    id: "post_thread",
    name: "本周发声",
    description: "发布 1 篇帖子",
    target: 1,
    points: 50,
  },
  {
    id: "post_comments",
    name: "热情讨论",
    description: "发表 3 条评论",
    target: 3,
    points: 40,
  },
  {
    id: "check_in_days",
    name: "周间守约",
    description: "本周签到 5 天",
    target: 5,
    points: 80,
  },
];

const TASK_MAP = new Map(WEEKLY_TASKS.map((t) => [t.id, t]));

export interface WeeklyTaskView {
  id: WeeklyTaskId;
  name: string;
  description: string;
  target: number;
  progress: number;
  points: number;
  completed: boolean;
  completedAt: string | null;
}

export interface WeeklyTasksBoard {
  weekStart: string;
  weekLabel: string;
  items: WeeklyTaskView[];
  completed: number;
  total: number;
  totalPoints: number;
  earnedPoints: number;
}

export async function getWeeklyTasksBoard(userId: string): Promise<WeeklyTasksBoard> {
  const weekStart = getWeekStartInShanghai();

  const rows = await db.query.userWeeklyTasks.findMany({
    where: and(
      eq(userWeeklyTasks.userId, userId),
      eq(userWeeklyTasks.weekStart, weekStart)
    ),
    columns: {
      taskId: true,
      progress: true,
      completedAt: true,
    },
  });

  const rowMap = new Map(rows.map((r) => [r.taskId, r]));

  const items: WeeklyTaskView[] = WEEKLY_TASKS.map((def) => {
    const row = rowMap.get(def.id);
    const progress = row?.progress ?? 0;
    const completed = row?.completedAt != null;
    const bonusPoints = getWeeklyTaskPointBonus(
      def.id,
      def.target,
      def.points
    );
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      target: def.target,
      progress: Math.min(progress, def.target),
      points: bonusPoints,
      completed,
      completedAt: row?.completedAt?.toISOString() ?? null,
    };
  });

  const completed = items.filter((i) => i.completed).length;
  const earnedPoints = items
    .filter((i) => i.completed)
    .reduce((sum, i) => sum + i.points, 0);
  const totalPoints = WEEKLY_TASKS.reduce(
    (sum, t) =>
      sum + getWeeklyTaskPointBonus(t.id, t.target, t.points),
    0
  );

  return {
    weekStart,
    weekLabel: formatWeekRangeLabel(weekStart),
    items,
    completed,
    total: WEEKLY_TASKS.length,
    totalPoints,
    earnedPoints,
  };
}

export interface WeeklyTaskReward {
  taskId: WeeklyTaskId;
  name: string;
  points: number;
}

export async function trackWeeklyTask(
  userId: string,
  taskId: WeeklyTaskId,
  delta = 1
): Promise<WeeklyTaskReward[]> {
  if (delta <= 0) return [];

  const def = TASK_MAP.get(taskId);
  if (!def) return [];

  const weekStart = getWeekStartInShanghai();
  const existing = await db.query.userWeeklyTasks.findFirst({
    where: and(
      eq(userWeeklyTasks.userId, userId),
      eq(userWeeklyTasks.weekStart, weekStart),
      eq(userWeeklyTasks.taskId, taskId)
    ),
  });

  const rewards: WeeklyTaskReward[] = [];

  if (!existing) {
    const progress = delta;
    const completed = progress >= def.target;
    await db.insert(userWeeklyTasks).values({
      userId,
      weekStart,
      taskId,
      progress,
      completedAt: completed ? new Date() : null,
    });
    if (completed) {
      const bonus = getWeeklyTaskPointBonus(def.id, def.target, def.points);
      if (bonus > 0) {
        await awardPoints(userId, bonus);
      }
      rewards.push({ taskId, name: def.name, points: bonus });
    }
    return rewards;
  }

  if (existing.completedAt) return [];

  const progress = (existing.progress ?? 0) + delta;
  const completed = progress >= def.target;

  await db
    .update(userWeeklyTasks)
    .set({
      progress,
      completedAt: completed ? new Date() : null,
    })
    .where(
      and(
        eq(userWeeklyTasks.userId, userId),
        eq(userWeeklyTasks.weekStart, weekStart),
        eq(userWeeklyTasks.taskId, taskId)
      )
    );

  if (completed) {
    const bonus = getWeeklyTaskPointBonus(def.id, def.target, def.points);
    if (bonus > 0) {
      await awardPoints(userId, bonus);
    }
    rewards.push({ taskId, name: def.name, points: bonus });
  }

  return rewards;
}
