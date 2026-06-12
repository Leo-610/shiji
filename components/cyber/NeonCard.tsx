import { cn } from "@/lib/utils";

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "purple" | "none";
}

export function NeonCard({ children, className, glow = "cyan" }: NeonCardProps) {
  const borderClass =
    glow === "none"
      ? "border-white/[0.06]"
      : "border-white/[0.08] hover:border-[color:var(--color-cyber-accent)]/25 hover:bg-white/[0.02]";

  return (
    <div
      className={cn(
        "rounded-lg border bg-white/[0.03] backdrop-blur-sm transition-colors duration-200",
        borderClass,
        className
      )}
    >
      {children}
    </div>
  );
}
