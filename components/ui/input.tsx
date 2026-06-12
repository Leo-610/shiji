import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-cyan-500/30 bg-black/50 px-3 py-1 text-sm text-gray-100 shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
