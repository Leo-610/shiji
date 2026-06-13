"use server";

import { auth } from "@/lib/auth";
import { getWeeklyTasksBoard } from "@/lib/weekly-tasks";

export async function getMyWeeklyTasks() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    return await getWeeklyTasksBoard(session.user.id);
  } catch {
    return null;
  }
}
