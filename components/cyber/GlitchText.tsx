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
        "relative font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-cyber-accent-bright)] via-gray-100 to-[var(--color-cyber-accent)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
