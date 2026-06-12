import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-[color:var(--app-border)] bg-theme-input px-3 py-1 text-sm text-[var(--app-fg-heading)] shadow-sm transition-colors placeholder:text-theme-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--app-accent)]/50 focus-visible:border-[color:var(--app-accent)]/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
