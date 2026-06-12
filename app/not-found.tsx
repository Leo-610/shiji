import Link from "next/link";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center py-24">
      <NeonCard className="p-12 text-center max-w-md">
        <p className="font-orbitron text-6xl font-bold text-theme-accent opacity-30 mb-4">
          404
        </p>
        <h1 className="text-xl text-theme-heading mb-2">页面不存在</h1>
        <p className="text-sm text-theme-muted mb-6">
          这个页面可能已被删除或从未存在
        </p>
        <Link href="/">
          <Button>返回首页</Button>
        </Link>
      </NeonCard>
    </div>
  );
}
