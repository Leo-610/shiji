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
        await db
          .update(users)
          .set({ role: SUPER_ADMIN_ROLE })
          .where(eq(users.id, user.id));
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      if (token.id) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.id as string),
          columns: { role: true },
        });
        token.role = (dbUser?.role as UserRole | undefined) ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole | undefined) ?? "user";
      }
      return session;
    },
  },
});
