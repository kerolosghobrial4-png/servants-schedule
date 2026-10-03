/**
 * Calendar helpers. "Days" in this app are calendar days in the group's
 * configured time zone (Settings → time zone), never the browser's.
 * Plain dates are handled as "YYYY-MM-DD" strings to avoid off-by-one bugs.
 */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isDateString(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function isTimeString(value: string): boolean {
  return TIME_RE.test(value);
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

type Parts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

const partsFormatterCache = new Map<string, Intl.DateTimeFormat>();
function partsFormatter(tz: string) {
  let f = partsFormatterCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    partsFormatterCache.set(tz, f);
  }
  return f;
}

export function zonedParts(instant: Date, tz: string): Parts {
  const out: Record<string, number> = {};
  for (const p of partsFormatter(tz).formatToParts(instant)) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return {
    year: out.year,
    month: out.month,
    day: out.day,
    hour: out.hour === 24 ? 0 : out.hour,
    minute: out.minute,
    second: out.second,
  };
}

function pad(n: number, len = 2) {
  return String(n).padStart(len, "0");
}

/** Offset of `tz` from UTC at `instant`, in milliseconds. */
function tzOffsetMs(instant: Date, tz: string): number {
  const p = zonedParts(instant, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/** Interpret a wall-clock date + time in `tz` and return the UTC instant. */
export function zonedTimeToUtc(dateStr: string, timeStr: string, tz: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm, 0);
  let result = guess - tzOffsetMs(new Date(guess), tz);
  // Re-check once in case the guess straddled a DST transition.
  const second = guess - tzOffsetMs(new Date(result), tz);
  if (second !== result) result = second;
  return new Date(result);
}

/** Calendar date ("YYYY-MM-DD") of `instant` in `tz`. */
export function dateInTz(instant: Date, tz: string): string {
  const p = zonedParts(instant, tz);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** Wall-clock time ("HH:MM") of `instant` in `tz`. */
export function timeInTz(instant: Date, tz: string): string {
  const p = zonedParts(instant, tz);
  return `${pad(p.hour)}:${pad(p.minute)}`;
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/** 0 = Sunday … 6 = Saturday */
export function dayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isWeekend(dateStr: string): boolean {
  const dow = dayOfWeek(dateStr);
  return dow === 0 || dow === 6;
}

export function startOfWeek(dateStr: string, weekStartsOn: number): string {
  const diff = (dayOfWeek(dateStr) - weekStartsOn + 7) % 7;
  return addDays(dateStr, -diff);
}

export function startOfMonth(dateStr: string): string {
  return `${dateStr.slice(0, 7)}-01`;
}

/** Start of the calendar day `dateStr` in `tz`, as a UTC instant. */
export function startOfDayUtc(dateStr: string, tz: string): Date {
  return zonedTimeToUtc(dateStr, "00:00", tz);
}

export type Period = "week" | "month" | "all";

/** UTC instant window for a leaderboard period. `end` is exclusive. */
export function periodWindow(
  period: Period,
  tz: string,
  weekStartsOn: number,
  now: Date = new Date(),
): { start: Date | null; end: Date | null } {
  const today = dateInTz(now, tz);
  if (period === "week") {
    const start = startOfWeek(today, weekStartsOn);
    return { start: startOfDayUtc(start, tz), end: startOfDayUtc(addDays(start, 7), tz) };
  }
  if (period === "month") {
    const start = startOfMonth(today);
    const [y, m] = start.split("-").map(Number);
    const next = m === 12 ? `${y + 1}-01-01` : `${y}-${pad(m + 1)}-01`;
    return { start: startOfDayUtc(start, tz), end: startOfDayUtc(next, tz) };
  }
  return { start: null, end: null };
}

/** Inclusive date range → UTC window [start, end). */
export function dateRangeWindow(startsOn: string, endsOn: string, tz: string) {
  return { start: startOfDayUtc(startsOn, tz), end: startOfDayUtc(addDays(endsOn, 1), tz) };
}

/* ------------------------------ formatting ----------------------------- */

export function formatDate(dateStr: string, opts: Intl.DateTimeFormatOptions = {}): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    ...opts,
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function formatLongDate(dateStr: string): string {
  return formatDate(dateStr, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function formatDateTime(instant: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(instant);
}

export function formatTime(instant: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  }).format(instant);
}

/** "Today", "Yesterday", or "Sep 30" relative to `today`. */
export function relativeDayLabel(dateStr: string, today: string): string {
  if (dateStr === today) return "Today";
  if (dateStr === addDays(today, -1)) return "Yesterday";
  if (dateStr === addDays(today, 1)) return "Tomorrow";
  const sameYear = dateStr.slice(0, 4) === today.slice(0, 4);
  return formatDate(dateStr, {
    weekday: "short",
    month: "long",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}
