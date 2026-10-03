import { describe, expect, it } from "vitest";
import { computeStreak } from "@/server/streaks";

const days = ["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02"]; // Mon–Fri

describe("computeStreak", () => {
  it("counts consecutive completed quiz days", () => {
    const r = computeStreak({ quizDays: days, openDays: new Set(), completedDays: new Set(days), weekendsCount: true });
    expect(r).toMatchObject({ current: 5, longest: 5 });
  });

  it("breaks on a missed, closed quiz day", () => {
    const completed = new Set(["2026-09-28", "2026-09-29", "2026-10-01", "2026-10-02"]);
    const r = computeStreak({ quizDays: days, openDays: new Set(), completedDays: completed, weekendsCount: true });
    expect(r).toMatchObject({ current: 2, longest: 2 });
  });

  it("doesn't break for a quiz that is still open", () => {
    const completed = new Set(days.slice(0, 4));
    const r = computeStreak({ quizDays: days, openDays: new Set(["2026-10-02"]), completedDays: completed, weekendsCount: true });
    expect(r.current).toBe(4);
  });

  it("treats days without a quiz as neutral", () => {
    const r = computeStreak({
      quizDays: ["2026-09-01", "2026-09-15"],
      openDays: new Set(),
      completedDays: new Set(["2026-09-01", "2026-09-15"]),
      weekendsCount: true,
    });
    expect(r.current).toBe(2);
  });

  it("ignores weekend quiz days when weekends don't count", () => {
    const quizDays = ["2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05"]; // Fri, Sat, Sun, Mon
    const completed = new Set(["2026-10-02", "2026-10-05"]);
    expect(computeStreak({ quizDays, openDays: new Set(), completedDays: completed, weekendsCount: false }).current).toBe(2);
    expect(computeStreak({ quizDays, openDays: new Set(), completedDays: completed, weekendsCount: true }).current).toBe(1);
  });
});
