import { Flame } from "lucide-react";
import { cx, formatPoints } from "./ui";

export type BoardRow = { userId: string; displayName: string; points: number; rank: number; streak: number };

const RANK_TONE: Record<number, string> = { 1: "text-gold", 2: "text-silver", 3: "text-bronze" };

/**
 * Scoreboard-style list. Only display names, points, rank and streak are
 * rendered — nothing else about a student ever reaches this component.
 */
export function LeaderboardList({
  rows,
  viewerId,
  showStreaks = true,
  size = "md",
  detachLast = false,
}: {
  rows: BoardRow[];
  viewerId?: string;
  showStreaks?: boolean;
  size?: "md" | "lg";
  /** Visually separates the last row (the viewer, appended below the top N). */
  detachLast?: boolean;
}) {
  return (
    <ol className="divide-y divide-line">
      {rows.map((row, i) => {
        const me = row.userId === viewerId;
        const gap = detachLast && i > 0 && i === rows.length - 1;
        return (
          <li
            key={row.userId}
            aria-current={me ? "true" : undefined}
            className={cx(
              "relative flex items-center gap-3 sm:gap-5 pr-2",
              size === "lg" ? "py-3.5 sm:py-4" : "py-3",
              me && "bg-raised",
              gap && "mt-3 border-t-2 border-dashed border-line-strong",
            )}
          >
            {me && <span aria-hidden className="absolute left-0 inset-y-0 w-1 bg-red" />}
            <span
              className={cx(
                "numeral w-12 sm:w-14 shrink-0 text-right",
                size === "lg" ? "text-4xl sm:text-5xl" : "text-3xl",
                RANK_TONE[row.rank] ?? "text-dim",
              )}
            >
              {row.rank}
            </span>
            <span className="flex-1 min-w-0 flex items-baseline gap-2">
              <span className={cx("display truncate", size === "lg" ? "text-2xl sm:text-3xl" : "text-xl")}>
                {row.displayName}
              </span>
              {me && <span className="label text-red-bright shrink-0">You</span>}
            </span>
            {showStreaks && row.streak > 0 && (
              <span className="flex items-center gap-1 text-muted shrink-0" title={`${row.streak}-day streak`}>
                <Flame size={16} className="text-red-bright" aria-hidden />
                <span className="numeral text-lg">{row.streak}</span>
                <span className="sr-only">day streak</span>
              </span>
            )}
            <span
              className={cx(
                "numeral shrink-0 text-right min-w-[4.5rem]",
                size === "lg" ? "text-3xl sm:text-4xl" : "text-2xl",
              )}
            >
              {formatPoints(row.points)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
