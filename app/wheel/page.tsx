import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getWheelPageData } from "@/app/actions/wheel";
import { WheelLottery } from "@/components/wheel/WheelLottery";
import { NeonCard } from "@/components/cyber/NeonCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import { formatShopValidityNote } from "@/lib/shop-duration";
import { getWheelRuleDescriptions } from "@/lib/wheel";

export default async function WheelPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/wheel");
  }

  const data = await getWheelPageData();
  const rules = getWheelRuleDescriptions();

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="text-center">
        <GlitchText as="h1" className="text-2xl font-bold mb-2">
          余烬大转盘
        </GlitchText>
        <p className="text-sm text-theme-muted">
          消耗积分或代积分券 · 赢取积分、券与限时装扮
        </p>
      </div>

      {data ? (
        <WheelLottery initialData={data} />
      ) : (
        <NeonCard className="p-8 text-center text-theme-muted">
          转盘加载失败，请稍后再试
        </NeonCard>
      )}

      <NeonCard className="p-6 space-y-4">
        <h2 className="text-sm font-orbitron tracking-widest text-theme-accent opacity-80 uppercase">
          规则说明
        </h2>
        <ul className="space-y-3">
          {rules.map((rule) => (
            <li
              key={rule.action}
              className="text-sm border-b border-theme-subtle pb-3 last:border-0 last:pb-0"
            >
              <p className="text-theme-heading">{rule.action}</p>
              <p className="text-xs text-theme-muted mt-0.5">{rule.note}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-theme-muted">
          <Link href="/shop" className="text-theme-accent hover:underline">
            积分商店兑换限时装扮（{formatShopValidityNote()}）→
          </Link>
        </p>
      </NeonCard>
    </div>
  );
}
