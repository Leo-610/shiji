import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getShopPageData } from "@/app/actions/shop";
import { formatShopValidityNote } from "@/lib/shop-duration";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { NeonCard } from "@/components/cyber/NeonCard";
import { GlitchText } from "@/components/cyber/GlitchText";

export default async function ShopPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/shop");
  }

  const shop = await getShopPageData();
  const pointRules = getPointRuleDescriptions();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <GlitchText as="h1" className="text-2xl font-bold mb-2">
          积分商店
        </GlitchText>
        <p className="text-sm text-theme-muted">
          签到、发帖、互动获得积分 · 兑换头像框与称号
        </p>
        <p className="text-xs text-theme-muted mt-1">{formatShopValidityNote()}</p>
      </div>

      {shop ? (
        <ShopGrid
          initialPoints={shop.points}
          userImage={session.user.image}
          userName={session.user.name}
          items={shop.items}
        />
      ) : (
        <NeonCard className="p-8 text-center text-theme-muted">
          商店加载失败，请稍后再试
        </NeonCard>
      )}

      <NeonCard className="p-6 space-y-4">
        <h2 className="text-sm font-orbitron tracking-widest text-theme-accent opacity-80 uppercase">
          积分获取方式
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
          积分用于商店兑换，不影响等级经验。{" "}
          <Link href="/profile" className="text-theme-accent hover:underline">
            去签到抽卡 →
          </Link>
        </p>
      </NeonCard>
    </div>
  );
}
