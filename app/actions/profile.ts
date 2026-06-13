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
import {
  getAvatarEditCost,
  getNicknameEditCost,
} from "@/lib/profile-edit-cost";
import { isNicknameTaken } from "@/lib/reader-id";

export type ProfileEditMeta = {
  points: number;
  nameChangeCount: number;
  avatarChangeCount: number;
  nextNameCost: number;
  nextAvatarCost: number;
};

export async function getProfileEditMeta(): Promise<ProfileEditMeta | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        points: true,
        nameChangeCount: true,
        avatarChangeCount: true,
      },
    });
    if (!user) return null;

    const nameChangeCount = user.nameChangeCount ?? 0;
    const avatarChangeCount = user.avatarChangeCount ?? 0;

    return {
      points: user.points ?? 0,
      nameChangeCount,
      avatarChangeCount,
      nextNameCost: getNicknameEditCost(nameChangeCount),
      nextAvatarCost: getAvatarEditCost(avatarChangeCount),
    };
  } catch {
    return null;
  }
}

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

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      name: true,
      points: true,
      nameChangeCount: true,
    },
  });
  if (!user) {
    return { error: "用户不存在" };
  }

  const currentName = user.name?.trim() ?? "";
  if (parsed.value === currentName) {
    return { error: "昵称未变更" };
  }

  if (await isNicknameTaken(parsed.value, session.user.id)) {
    return { error: "该昵称已被使用，请换一个" };
  }

  const priorChanges = user.nameChangeCount ?? 0;
  const cost = getNicknameEditCost(priorChanges);
  const points = user.points ?? 0;

  if (points < cost) {
    return {
      error:
        cost === 0
          ? "积分不足"
          : `积分不足，修改昵称需 ${cost} 积分（当前 ${points}）`,
    };
  }

  await db
    .update(users)
    .set({
      name: parsed.value,
      points: points - cost,
      nameChangeCount: priorChanges + 1,
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/profile");
  revalidatePath("/discussions");
  return {
    success: true,
    name: parsed.value,
    points: points - cost,
    cost,
    nameChangeCount: priorChanges + 1,
    nextNameCost: getNicknameEditCost(priorChanges + 1),
  };
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

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      points: true,
      avatarChangeCount: true,
    },
  });
  if (!user) {
    return { error: "用户不存在" };
  }

  const priorChanges = user.avatarChangeCount ?? 0;
  const cost = getAvatarEditCost(priorChanges);
  const points = user.points ?? 0;

  if (points < cost) {
    return {
      error:
        cost === 0
          ? "积分不足"
          : `积分不足，修改头像需 ${cost} 积分（当前 ${points}）`,
    };
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
    .set({
      image: blob.url,
      points: points - cost,
      avatarChangeCount: priorChanges + 1,
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/profile");
  revalidatePath("/discussions");
  return {
    success: true,
    imageUrl: blob.url,
    points: points - cost,
    cost,
    avatarChangeCount: priorChanges + 1,
    nextAvatarCost: getAvatarEditCost(priorChanges + 1),
  };
}
