import Link from "next/link";
import { Coins } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMyLevelProfile } from "@/app/actions/level";
import { getMyAchievements } from "@/app/actions/achievements";
import { getXpRuleDescriptions } from "@/lib/level";
import { NeonCard } from "@/components/cyber/NeonCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import { LevelBadge } from "@/components/user/LevelBadge";
import { CheckInButton } from "@/components/user/CheckInButton";
import { AchievementGrid } from "@/components/user/AchievementGrid";
import { AvatarWithFrame } from "@/components/user/AvatarWithFrame";
import { getPointRuleDescriptions } from "@/lib/points";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/profile");
  }

  const profile = await getMyLevelProfile();
  const achievements = await getMyAchievements();
  const rules = getXpRuleDescriptions();
  const pointRules = getPointRuleDescriptions();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <GlitchText as="h1" className="text-2xl font-bold mb-2">
          我的等级
        </GlitchText>
        <p className="text-sm text-theme-muted">
          登录用户专属成长体系 · 每日签到抽运势卡
        </p>
      </div>

      <NeonCard className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <AvatarWithFrame
            name={session.user.name}
            image={session.user.image}
            role={session.user.role}
            frameSlug={session.user.equippedAvatarFrame}
            size="lg"
          />
          <div className="min-w-0">
            <p className="text-lg font-medium text-theme-heading truncate">
              {session.user.name ?? "读者"}
            </p>
            {profile ? (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <LevelBadge level={profile.level} />
                <span className="text-sm text-theme-accent">{profile.title}</span>
              </div>
            ) : (
              <p className="text-sm text-theme-muted mt-1">
                等级数据加载中…
              </p>
            )}
          </div>
        </div>

        {profile && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-theme-muted">
              <span>{profile.xp} 经验</span>
              {profile.progress.next !== null && (
                <span>
                  距 Lv.{profile.level + 1} 还需{" "}
                  {profile.progress.next - profile.xp}
                </span>
              )}
            </div>
            <div className="level-progress-track">
              <div
                className="level-progress-fill"
                style={{ width: `${profile.progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {profile && (
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm text-theme-muted hover:text-theme-accent transition-colors"
          >
            <Coins className="size-4" />
            <span className="font-orbitron text-theme-accent">{profile.points}</span>
            <span>积分 · 去商店兑换头像框</span>
          </Link>
        )}

        {profile && (
          <CheckInButton
            checkedInToday={profile.checkedInToday}
            streak={profile.checkInStreak}
            todayXp={profile.todayCheckInXp}
            initialFortune={profile.dailyFortune}
          />
        )}
      </NeonCard>

      {achievements && (
        <NeonCard className="p-6">
          <AchievementGrid
            items={achievements.items}
            unlocked={achievements.unlocked}
            total={achievements.total}
          />
        </NeonCard>
      )}

      <NeonCard className="p-6 space-y-4">
        <h2 className="text-sm font-orbitron tracking-widest text-theme-accent opacity-80 uppercase">
          积分获取 · 商店兑换
        </h2>
        <ul className="space-y-3">
          {pointRules.map((rule) => (
            <li
              key={rule.action}
              className="flex items-start justify-between gap-4 text-sm border-b border-theme-subtle pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-theme-heading">{rule.action}</p>
                <p className="text-xs text-theme-muted mt-0.5">{rule.note}</p>
              </div>
              <span className="text-theme-accent font-orbitron shrink-0">
                +{rule.points}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-theme-muted">
          <Link href="/shop" className="text-theme-accent hover:underline">
            打开积分商店 →
          </Link>
        </p>
      </NeonCard>

      <NeonCard className="p-6 space-y-4">
        <h2 className="text-sm font-orbitron tracking-widest text-theme-accent opacity-80 uppercase">
          经验获取规则
        </h2>
        <ul className="space-y-3">
          {rules.map((rule) => (
            <li
              key={rule.action}
              className="flex items-start justify-between gap-4 text-sm border-b border-theme-subtle pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-theme-heading">{rule.action}</p>
                <p className="text-xs text-theme-muted mt-0.5">{rule.note}</p>
              </div>
              <span className="text-theme-accent font-orbitron shrink-0">
                +{rule.xp}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-theme-muted">
          游客发言不计经验。最高等级 Lv.64，称号随等级提升。
        </p>
      </NeonCard>

      <p className="text-center text-sm text-theme-muted">
        <Link href="/discussions" className="hover:text-theme-accent transition-colors">
          去讨论区活跃 →
        </Link>
      </p>
    </div>
  );
}
