"use client";

import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { FrameTheme } from "@/lib/shop-items";
import { AvatarFrameSvg } from "@/components/user/AvatarFrameSvg";

interface AvatarFrameOverlayProps {
  lottieSrc: string;
  theme: FrameTheme;
}

export function AvatarFrameOverlay({
  lottieSrc,
  theme,
}: AvatarFrameOverlayProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <AvatarFrameSvg theme={theme} />;
  }

  return (
    <DotLottieReact
      src={lottieSrc}
      loop
      autoplay
      className="avatar-lottie-player"
      dotLottieRefCallback={(instance) => {
        if (!instance) return;
        instance.addEventListener("loadError", () => setFailed(true));
      }}
    />
  );
}
