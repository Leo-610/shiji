"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  AVATAR_ALLOWED_TYPES,
  AVATAR_MAX_BYTES,
  validateDisplayName,
} from "@/lib/profile";
import { isNicknameTaken } from "@/lib/reader-id";

export async function updateProfileName(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  const raw = (formData.get("name") as string) ?? "";
  const parsed = validateDisplayName(raw);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  if (await isNicknameTaken(parsed.value, session.user.id)) {
    return { error: "该昵称已被使用，请换一个" };
  }

  await db
    .update(users)
    .set({ name: parsed.value })
    .where(eq(users.id, session.user.id));

  revalidatePath("/profile");
  revalidatePath("/discussions");
  return { success: true, name: parsed.value };
}

export async function uploadProfileAvatar(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { error: "头像上传尚未配置，请联系站长" };
  }

  const file = formData.get("avatar");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "请选择图片" };
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return { error: "图片不超过 2MB" };
  }

  if (!AVATAR_ALLOWED_TYPES.has(file.type)) {
    return { error: "仅支持 JPG、PNG、WebP、GIF" };
  }

  const ext =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : file.type === "image/gif"
          ? "gif"
          : "webp";

  const blob = await put(
    `avatars/${session.user.id}/${Date.now()}.${ext}`,
    file,
    { access: "public", addRandomSuffix: false }
  );

  await db
    .update(users)
    .set({ image: blob.url })
    .where(eq(users.id, session.user.id));

  revalidatePath("/profile");
  revalidatePath("/discussions");
  return { success: true, imageUrl: blob.url };
}
