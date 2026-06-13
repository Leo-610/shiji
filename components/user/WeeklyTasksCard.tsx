import { CalendarRange, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeeklyTasksBoard } from "@/lib/weekly-tasks";

interface WeeklyTasksCardProps {
  board: WeeklyTasksBoard;
}

export function WeeklyTasksCard({ board }: WeeklyTasksCardProps) {
  return (
    <div className="weekly-tasks-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-theme-heading">
          <CalendarRange className="size-4 text-theme-accent shrink-0" />
          <div>
            <p className="text-sm font-medium">每周任务</p>
            <p className="text-[10px] text-theme-muted mt-0.5">
              每周一 0:00 刷新 · {board.weekLabel}
            </p>
            <p className="text-[10px] text-theme-subtle mt-0.5">
              补差奖励（已扣行为分）· 最高 {board.totalPoints} 积分
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-orbitron text-theme-accent">
            {board.completed}/{board.total}
          </p>
          <p className="text-[10px] text-theme-muted mt-0.5">
            已得 {board.earnedPoints}/{board.totalPoints} 积分
          </p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {board.items.map((task) => {
          const percent = Math.min(
            100,
            Math.round((task.progress / task.target) * 100)
          );
          return (
            <li
              key={task.id}
              className={cn(
                "weekly-task-item rounded-lg border p-3",
                task.completed && "weekly-task-item-done"
              )}
            >
              <div className="flex items-start gap-2.5">
                {task.completed ? (
                  <CheckCircle2
                    className="size-4 text-theme-accent shrink-0 mt-0.5"
                    aria-hidden
                  />
                ) : (
                  <Circle
                    className="size-4 text-theme-muted shrink-0 mt-0.5"
                    aria-hidden
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-theme-heading">{task.name}</p>
                    <span className="text-[10px] font-orbitron text-theme-accent shrink-0">
                      +{task.points}
                    </span>
                  </div>
                  <p className="text-xs text-theme-muted mt-0.5">
                    {task.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="weekly-task-progress-track flex-1">
                      <div
                        className="weekly-task-progress-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-theme-muted shrink-0">
                      {task.progress}/{task.target}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-[10px] text-theme-subtle leading-relaxed">
        周任务积分为补差发放：发帖/评论/签到行为分已计入日常奖励，任务只补剩余差额。
      </p>
    </div>
  );
}
