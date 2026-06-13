"use server";

import { auth } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/admin-stats";
import { isSuperAdmin } from "@/lib/roles";

export async function getAdminDashboard() {
  const session = await auth();
  if (!session?.user?.id || !isSuperAdmin(session.user.role)) {
    return null;
  }

  try {
    return await getAdminDashboardStats();
  } catch {
    return null;
  }
}
