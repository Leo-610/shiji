import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}

export function GlitchText({
  children,
  className,
  as: Tag = "h1",
}: GlitchTextProps) {
  return (
    <Tag
      className={cn(
        "relative font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[var(--app-accent)] via-[color:var(--app-accent-hover)] to-[var(--app-accent-secondary)] animate-pulse-slow",
        className
      )}
    >
      {children}
    </Tag>
  );
}
