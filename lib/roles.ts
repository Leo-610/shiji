export type UserRole = "user" | "super_admin";

export const SUPER_ADMIN_ROLE: UserRole = "super_admin";

export function isSuperAdmin(role?: string | null): boolean {
  return role === SUPER_ADMIN_ROLE;
}

export function getSuperAdminGitHubUsername(): string {
  return process.env.SUPER_ADMIN_GITHUB_USERNAME ?? "Leo-610";
}
