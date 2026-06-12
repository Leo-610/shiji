import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-cyber-accent)]/40",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-cyber-accent)] text-[#0a0a0f] hover:bg-[var(--color-cyber-accent-bright)]",
        destructive: "bg-red-600/90 text-white hover:bg-red-500",
        outline:
          "border border-white/15 bg-transparent text-gray-200 hover:bg-white/[0.04] hover:border-[color:var(--color-cyber-accent)]/35",
        ghost: "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]",
        link: "text-[var(--color-cyber-accent-bright)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
