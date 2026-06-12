import { cn } from "@/lib/utils";

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "purple" | "none";
}

export function NeonCard({ children, className, glow = "cyan" }: NeonCardProps) {
  const glowClass =
    glow === "cyan"
      ? "hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] border-cyan-500/30"
      : glow === "purple"
        ? "hover:shadow-[0_0_25px_rgba(191,0,255,0.15)] border-purple-500/30"
        : "border-gray-700/50";

  return (
    <div
      className={cn(
        "rounded-lg border bg-black/40 backdrop-blur-sm transition-all duration-300",
        glowClass,
        className
      )}
    >
      {children}
    </div>
  );
}
