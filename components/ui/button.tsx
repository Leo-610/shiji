import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]",
        destructive:
          "bg-red-600 text-white hover:bg-red-500",
        outline:
          "border border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]",
        ghost: "text-cyan-400 hover:bg-cyan-500/10",
        link: "text-cyan-400 underline-offset-4 hover:underline",
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
