import { cn } from "@/lib/utils";

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "purple" | "none";
}

export function NeonCard({ children, className, glow = "cyan" }: NeonCardProps) {
  const glowClass =
    glow === "none"
      ? "border-[color:var(--app-border-subtle)]"
      : glow === "purple"
        ? "border-[color:var(--app-border)] hover:shadow-[0_0_25px_var(--app-shadow-purple)]"
        : "border-[color:var(--app-border)] hover:shadow-[0_0_25px_var(--app-shadow-glow)]";

  return (
    <div
      className={cn(
        "rounded-lg border bg-theme-surface backdrop-blur-sm transition-all duration-300",
        glowClass,
        className
      )}
    >
      {children}
    </div>
  );
}
