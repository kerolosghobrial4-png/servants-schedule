import { describe, expect, it } from "vitest";
import { addDays, dateInTz, isDateString, periodWindow, startOfWeek, zonedTimeToUtc } from "@/lib/time";

describe("time helpers", () => {
  it("converts wall-clock time in a zone to UTC, including across DST", () => {
    expect(zonedTimeToUtc("2026-10-03", "18:00", "America/New_York").toISOString()).toBe("2026-10-03T22:00:00.000Z");
    expect(zonedTimeToUtc("2026-12-03", "18:00", "America/New_York").toISOString()).toBe("2026-12-03T23:00:00.000Z");
    expect(zonedTimeToUtc("2026-11-01", "12:00", "America/Chicago").toISOString()).toBe("2026-11-01T18:00:00.000Z");
    expect(zonedTimeToUtc("2026-07-01", "00:00", "UTC").toISOString()).toBe("2026-07-01T00:00:00.000Z");
  });

  it("finds the local calendar date", () => {
    expect(dateInTz(new Date("2026-10-04T02:00:00Z"), "America/New_York")).toBe("2026-10-03");
    expect(dateInTz(new Date("2026-10-04T02:00:00Z"), "UTC")).toBe("2026-10-04");
  });

  it("does date arithmetic", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(startOfWeek("2026-10-03", 0)).toBe("2026-09-27");
    expect(startOfWeek("2026-10-03", 1)).toBe("2026-09-28");
    expect(isDateString("2026-02-30")).toBe(false);
    expect(isDateString("2026-02-28")).toBe(true);
  });

  it("builds period windows", () => {
    const w = periodWindow("month", "America/New_York", 0, new Date("2026-10-03T12:00:00Z"));
    expect(w.start?.toISOString()).toBe("2026-10-01T04:00:00.000Z");
    expect(w.end?.toISOString()).toBe("2026-11-01T04:00:00.000Z");
  });
});
