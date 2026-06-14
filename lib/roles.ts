export type UserRole = "user" | "super_admin";

export const SUPER_ADMIN_ROLE: UserRole = "super_admin";

/** 至尊站长：数据库 role，仅站长账号一人，与登录方式无关。 */
export function isSuperAdmin(role?: string | null): boolean {
  return role === SUPER_ADMIN_ROLE;
}

/** GitHub 用户名，用于发帖/评论限流豁免（仅站长 GitHub 账号 Leo-610）。 */
export function getOwnerGitHubUsername(): string {
  return process.env.OWNER_GITHUB_USERNAME ?? process.env.SUPER_ADMIN_GITHUB_USERNAME ?? "Leo-610";
}

export function isOwnerGitHubLogin(login?: string | null): boolean {
  if (!login) return false;
  return login.toLowerCase() === getOwnerGitHubUsername().toLowerCase();
}
