"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarWithFrame } from "@/components/user/AvatarWithFrame";
import {
  updateProfileName,
  uploadProfileAvatar,
  type ProfileEditMeta,
} from "@/app/actions/profile";
import { formatProfileEditCost } from "@/lib/profile-edit-cost";
import type { UserRole } from "@/lib/roles";

interface ProfileSettingsFormProps {
  initialName: string | null;
  initialImage: string | null;
  readerId: number | null;
  role: UserRole;
  frameSlug: string | null;
  editMeta: ProfileEditMeta;
}

export function ProfileSettingsForm({
  initialName,
  initialImage,
  readerId,
  role,
  frameSlug,
  editMeta: initialEditMeta,
}: ProfileSettingsFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName ?? "");
  const [previewImage, setPreviewImage] = useState(initialImage);
  const [nameError, setNameError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [namePending, setNamePending] = useState(false);
  const [avatarPending, setAvatarPending] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [editMeta, setEditMeta] = useState(initialEditMeta);

  async function handleNameSave() {
    setNameError(null);
    setNameSaved(false);
    setNamePending(true);
    const formData = new FormData();
    formData.set("name", name);
    const result = await updateProfileName(formData);
    setNamePending(false);
    if (result?.error) {
      setNameError(result.error);
      return;
    }
    setNameSaved(true);
    if (result.points !== undefined) {
      setEditMeta((prev) => ({
        ...prev,
        points: result.points!,
        nameChangeCount: result.nameChangeCount ?? prev.nameChangeCount,
        nextNameCost: result.nextNameCost ?? prev.nextNameCost,
      }));
    }
    router.refresh();
  }

  async function handleAvatarChange(file: File) {
    setAvatarError(null);
    setAvatarPending(true);
    const formData = new FormData();
    formData.set("avatar", file);
    const result = await uploadProfileAvatar(formData);
    setAvatarPending(false);
    if (result?.error) {
      setAvatarError(result.error);
      return;
    }
    if (result?.imageUrl) {
      setPreviewImage(result.imageUrl);
    }
    if (result.points !== undefined) {
      setEditMeta((prev) => ({
        ...prev,
        points: result.points!,
        avatarChangeCount: result.avatarChangeCount ?? prev.avatarChangeCount,
        nextAvatarCost: result.nextAvatarCost ?? prev.nextAvatarCost,
      }));
    }
    router.refresh();
  }

  return (
    <div className="space-y-5 border-b border-theme-subtle pb-6">
      <div>
        <h2 className="text-sm font-orbitron tracking-widest text-theme-accent opacity-80 uppercase">
          个人资料
        </h2>
        <p className="text-xs text-theme-muted mt-1">
          设置昵称与头像，讨论区将展示你的形象
          {readerId != null && readerId > 0 && (
            <span className="ml-2 font-orbitron text-theme-accent tabular-nums">
              读者 ID #{readerId}
            </span>
          )}
        </p>
        <p className="text-[11px] text-theme-muted mt-1">
          昵称与头像各有一次免费修改机会，之后消耗积分且费用逐次递增（当前积分{" "}
          <span className="font-orbitron text-theme-accent tabular-nums">
            {editMeta.points}
          </span>
          ）
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative shrink-0">
          <AvatarWithFrame
            name={name || initialName}
            image={previewImage}
            role={role}
            frameSlug={frameSlug}
            size="lg"
          />
          <button
            type="button"
            disabled={
              avatarPending ||
              (editMeta.nextAvatarCost > 0 &&
                editMeta.points < editMeta.nextAvatarCost)
            }
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border border-theme-subtle bg-theme-surface text-theme-accent shadow-lg hover:bg-[color:var(--app-accent)]/15 transition-colors disabled:opacity-50"
            aria-label="上传头像"
          >
            {avatarPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Camera className="size-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) handleAvatarChange(file);
            }}
          />
        </div>

        <div className="flex-1 w-full space-y-3 min-w-0">
          <p className="text-[11px] text-theme-muted text-center sm:text-left">
            支持 JPG / PNG / WebP / GIF，最大 2MB · 本次修改{" "}
            <span className="text-theme-accent">
              {formatProfileEditCost(editMeta.nextAvatarCost)}
            </span>
          </p>
          {avatarError && (
            <p className="text-sm text-red-400">{avatarError}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="profile-name">昵称</Label>
            <div className="flex gap-2">
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameSaved(false);
                }}
                placeholder="输入你的昵称"
                maxLength={24}
                autoComplete="nickname"
              />
              <Button
                type="button"
                variant="outline"
                disabled={
                  namePending ||
                  (editMeta.nextNameCost > 0 &&
                    editMeta.points < editMeta.nextNameCost)
                }
                onClick={handleNameSave}
                className="shrink-0"
              >
                {namePending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UserPen className="size-4" />
                )}
                {editMeta.nextNameCost === 0
                  ? "保存"
                  : `保存 · ${editMeta.nextNameCost}`}
              </Button>
            </div>
            {nameError && <p className="text-sm text-red-400">{nameError}</p>}
            {nameSaved && (
              <p className="text-xs text-emerald-400">昵称已更新</p>
            )}
            <p className="text-[11px] text-theme-muted">
              2–24 个字符，支持中文、字母、数字；不可与已有昵称重复 · 本次修改{" "}
              <span className="text-theme-accent">
                {formatProfileEditCost(editMeta.nextNameCost)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
