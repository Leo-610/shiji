import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAdminDashboard } from "@/app/actions/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { isSuperAdmin } from "@/lib/roles";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || !isSuperAdmin(session.user.role)) {
    redirect("/");
  }

  const stats = await getAdminDashboard();
  if (!stats) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-theme-muted">
        数据加载失败，请稍后再试。
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AdminDashboard stats={stats} />
    </div>
  );
}
