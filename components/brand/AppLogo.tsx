import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  xs: 28,
  sm: 36,
  md: 48,
  lg: 72,
  xl: 96,
  boot: 140,
} as const;

type AppLogoProps = {
  size?: keyof typeof SIZES;
  className?: string;
  priority?: boolean;
};

export function AppLogo({ size = "sm", className, priority }: AppLogoProps) {
  const px = SIZES[size];

  return (
    <Image
      src="/logo.png"
      alt="量子余烬"
      width={px}
      height={px}
      className={cn("rounded-[22%] shrink-0 object-cover", className)}
      priority={priority}
    />
  );
}
