import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-md border border-[color:var(--app-border)] bg-theme-input px-3 py-2 text-sm text-[var(--app-fg-heading)] shadow-sm transition-colors placeholder:text-theme-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-accent)]/50 focus-visible:border-[color:var(--app-accent)]/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
