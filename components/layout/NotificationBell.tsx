"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import {
  getRecentNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "@/app/actions/notifications";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const refreshCount = useCallback(async () => {
    const count = await getUnreadNotificationCount();
    setUnread(count);
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getRecentNotifications()
      .then(setItems)
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  async function handleOpen() {
    setOpen((v) => !v);
  }

  async function handleClickItem(item: NotificationItem) {
    if (!item.read) {
      await markNotificationRead(item.id);
      setUnread((n) => Math.max(0, n - 1));
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, read: true } : i))
      );
    }
    setOpen(false);
  }

  async function handleMarkAll() {
    const result = await markAllNotificationsRead();
    if (result.success) {
      setUnread(0);
      setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 relative"
        aria-label="通知"
        onClick={handleOpen}
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span className="notification-badge">{unread > 9 ? "9+" : unread}</span>
        )}
      </Button>

      {open && (
        <div className="notification-panel max-sm:notification-panel-sheet">
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-theme-subtle">
            <span className="text-xs font-orbitron tracking-widest text-theme-accent uppercase">
              通知
            </span>
            {unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="text-[10px] text-theme-muted hover:text-theme-accent transition-colors"
              >
                全部已读
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <p className="px-3 py-6 text-center text-xs text-theme-muted">
                加载中…
              </p>
            ) : items.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-theme-muted">
                暂无通知
              </p>
            ) : (
              items.map((item) => (
                <Link
                  key={item.id}
                  href={`/discussions/${item.threadSlug}`}
                  onClick={() => handleClickItem(item)}
                  className={cn(
                    "notification-item block px-3 py-2.5 text-left transition-colors hover:bg-theme-surface/60",
                    !item.read && "notification-item-unread"
                  )}
                >
                  <p className="text-xs text-theme-heading leading-relaxed">
                    {item.body}
                  </p>
                  <p className="text-[10px] text-theme-muted mt-1">
                    {formatRelativeTime(item.createdAt)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return new Date(iso).toLocaleDateString("zh-CN");
}
