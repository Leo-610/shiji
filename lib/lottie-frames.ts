/** Self-hosted Lottie overlays (verified avatar ring animations). */
export const LOTTIE_ASSETS = {
  /** Full avatar-frame comp — same asset as升格神谕框 */
  avatarFrame: "/lottie/frames/avatar-frame.json",
  /** Slim widget ring stroke — tinted per theme for rare frames */
  widgetRing: "/lottie/frames/widget-ring.json",
} as const;

export const ADMIN_LOTTIE_SRC = LOTTIE_ASSETS.avatarFrame;
