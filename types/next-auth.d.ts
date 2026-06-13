import { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/roles";

declare module "next-auth" {
    interface Session {
    user: {
      id: string;
      role: UserRole;
      level: number;
      xp: number;
      points: number;
      readerId: number | null;
      equippedAvatarFrame: string | null;
      equippedTitleBadge: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    level?: number;
    xp?: number;
    points?: number;
    readerId?: number | null;
    equippedAvatarFrame?: string | null;
    equippedTitleBadge?: string | null;
  }
}
