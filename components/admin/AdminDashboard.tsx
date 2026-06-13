import {
  CalendarCheck,
  MessageSquare,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";
import { NeonCard } from "@/components/cyber/NeonCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import type { AdminDashboardStats } from "@/lib/admin-stats";

interface AdminDashboardProps {
  stats: AdminDashboardStats;
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "cyan",
}: {
  label: string;
  value: number;
  hint?: string;
  icon: typeof Users;
  accent?: "cyan" | "purple" | "gold";
}) {
  const glow =
    accent === "purple" ? "purple" : accent === "gold" ? "purple" : "cyan";
  const valueClass =
    accent === "purple"
      ? "text-theme-accent-secondary"
      : accent === "gold"
        ? "text-amber-400"
        : "text-theme-accent";

  return (
    <NeonCard className="p-5 sm:p-6" glow={glow}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-theme-muted mb-1">{label}</p>
          <p className={`font-orbitron text-3xl font-bold tabular-nums ${valueClass}`}>
            {value}
          </p>
          {hint && (
            <p className="text-[10px] text-theme-subtle mt-2 leading-relaxed">
              {hint}
            </p>
          )}
        </div>
        <Icon className={`size-5 shrink-0 opacity-70 ${valueClass}`} aria-hidden />
      </div>
    </NeonCard>
  );
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left">
        <GlitchText as="h1" className="text-2xl font-bold mb-2">
          站长后台
        </GlitchText>
        <p className="text-sm text-theme-muted">
          仅至尊站长可见 · 本周 {stats.weekLabel}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-orbitron tracking-widest text-theme-accent opacity-80 uppercase">
          读者
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="注册读者"
            value={stats.users}
            hint="累计登录账号（GitHub / 邮箱）"
            icon={Users}
          />
          <StatCard
            label="本周新注册"
            value={stats.newUsersThisWeek}
            hint="周一至今日新加入"
            icon={UserPlus}
            accent="purple"
          />
          <StatCard
            label="本周活跃"
            value={stats.activeThisWeek}
            hint="本周发帖、评论或签到过的读者"
            icon={Users}
          />
          <StatCard
            label="今日签到"
            value={stats.checkedInToday}
            hint={`本周累计签到 ${stats.checkedInThisWeek} 人`}
            icon={CalendarCheck}
            accent="gold"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-orbitron tracking-widest text-theme-accent opacity-80 uppercase">
          社区
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="讨论帖"
            value={stats.threads}
            icon={MessageSquare}
          />
          <StatCard
            label="评论"
            value={stats.comments}
            icon={MessageSquare}
            accent="purple"
          />
          <StatCard
            label="商店兑换"
            value={stats.shopPurchases}
            hint="累计兑换次数"
            icon={ShoppingBag}
            accent="gold"
          />
        </div>
      </section>

      <p className="text-xs text-theme-subtle text-center sm:text-left">
        数据按上海时区统计 · 每周一 0:00 刷新周维度指标
      </p>
    </div>
  );
}
