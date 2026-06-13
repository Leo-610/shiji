import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/lib/db/schema";
import {
  getSuperAdminGitHubUsername,
  SUPER_ADMIN_ROLE,
  type UserRole,
} from "@/lib/roles";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
    ...((process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY)
      ? [
          Resend({
            apiKey:
              process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY ?? "",
            from:
              process.env.AUTH_RESEND_FROM ??
              "量子余烬 <onboarding@resend.dev>",
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn({ user, account, profile }) {
      if (!user.id || account?.provider !== "github") return;

      const profileLogin = (profile as { login?: string } | undefined)?.login;
      if (
        profileLogin?.toLowerCase() ===
        getSuperAdminGitHubUsername().toLowerCase()
      ) {
        try {
          await db
            .update(users)
            .set({ role: SUPER_ADMIN_ROLE })
            .where(eq(users.id, user.id));
        } catch {
          // role column may be missing until migration is applied
        }
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      if (token.id) {
        try {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.id as string),
            columns: {
              role: true,
              level: true,
              xp: true,
              points: true,
              equippedAvatarFrame: true,
              equippedTitleBadge: true,
            },
          });
          token.role = (dbUser?.role as UserRole | undefined) ?? "user";
          token.level = dbUser?.level ?? 1;
          token.xp = dbUser?.xp ?? 0;
          token.points = dbUser?.points ?? 0;
          token.equippedAvatarFrame = dbUser?.equippedAvatarFrame ?? null;
          token.equippedTitleBadge = dbUser?.equippedTitleBadge ?? null;
        } catch {
          token.role = "user";
          token.level = 1;
          token.xp = 0;
          token.points = 0;
          token.equippedAvatarFrame = null;
          token.equippedTitleBadge = null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole | undefined) ?? "user";
        session.user.level = (token.level as number | undefined) ?? 1;
        session.user.xp = (token.xp as number | undefined) ?? 0;
        session.user.points = (token.points as number | undefined) ?? 0;
        session.user.equippedAvatarFrame =
          (token.equippedAvatarFrame as string | null | undefined) ?? null;
        session.user.equippedTitleBadge =
          (token.equippedTitleBadge as string | null | undefined) ?? null;
      }
      return session;
    },
  },
});
