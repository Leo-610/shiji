export function validateDisplayName(
  input: string
): { ok: true; value: string } | { ok: false; error: string } {
  const value = input.trim();
  if (value.length < 2) {
    return { ok: false, error: "昵称至少 2 个字符" };
  }
  if (value.length > 24) {
    return { ok: false, error: "昵称最多 24 个字符" };
  }
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9_\-.·]+$/.test(value)) {
    return {
      ok: false,
      error: "昵称仅支持中文、字母、数字及 _ - . ·",
    };
  }
  return { ok: true, value };
}

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
