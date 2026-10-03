# Bible Challenge

A daily Bible study competition for a high school youth group. Students sign in, take the day's quiz, earn points, build streaks and climb the leaderboard. Leaders run everything from a protected admin panel.

This app is separate from the servants schedule site in the rest of this repository.

---

## What's in it

**Students**
- Dashboard: points, monthly rank, streak, today's quiz status, points this week, standings preview, season and badge progress, recent activity
- Daily quiz: one question per screen, big tap targets, review before submitting. Answers are saved on the device in case the page reloads.
- Results with explanations, either right away or after the quiz closes (set per quiz)
- Standings: this week, this month, all time and per season. The signed-in student's row is highlighted.
- History: every point entry grouped by day, plus quiz history
- Study page with current and upcoming passages and notes
- Profile: stats, badges, change password

**Leaders and admins** (`/admin`)
- Dashboard: active students, today's completion rate, who has and hasn't finished, average score, leaderboard, recent submissions and point changes
- Students: create (temporary password shown once), edit, deactivate (soft), reset password, assign seasons, quiz and point history, adjust points
- Quizzes: draft or publish, schedule, passage, study notes, answer-reveal timing, bonus points, streak eligibility, duplicate. Fixing an answer key after students have submitted re-grades every submission and corrects the ledger.
- Question bank: search and filter by book, chapter, topic, type and difficulty. Reuse, duplicate, archive. Quizzes keep their own copy of each question, so editing the bank never changes past quizzes.
- Submissions: approve or reject short answers, and allow a student one revision
- Points ledger: give or remove points with a reason (the student sees it) and a private note. Reverse any entry.
- Seasons: date range, participants, season standings, and finalize (awards "Top N" badges)
- Achievements: rule-based badges (quizzes completed, perfect quizzes, streak, total points, season rank) or awarded by a leader, with an optional point reward
- Settings: point values, streak rules (whether weekends count, bonus interval), time zone, week start, leaderboard defaults, required two-step verification for staff, staff accounts and roles
- Audit log of every staff action

## Roles

| Role | Can |
|---|---|
| `student` | Take quizzes, see their own progress and the leaderboard |
| `leader` | Everything in the admin panel except managing student and staff accounts, seasons, achievement rules, settings and the audit log |
| `admin` | Everything |

The permission matrix is in `src/lib/permissions.ts`. Every page calls `requirePermission(...)` and every server action calls `authorize(...)`. Hiding a button is never what keeps someone out.

## How points work

- Every change is a row in `point_transactions`. A student's total is `SUM(amount)`.
- A database trigger rejects `UPDATE`, `DELETE` and `TRUNCATE` on the ledger and the audit log, so history can't be rewritten, even by a bug.
- To fix a mistake, **reverse** the entry. This adds an equal and opposite row that links back to the original, and an entry can only be reversed once.
- Quiz points are calculated on the server from the stored answer key. The browser only sends which options were chosen.
- When a submission is re-graded (after a short-answer review, a revision or an answer-key fix), only the difference is added to the ledger. A submission keeps the point rules in force when it was first graded, so changing Settings later doesn't rewrite old scores.
- Default values (all editable): 10 per correct answer, +5 for participation, +10 for answering every question, +20 for a perfect quiz, +25 every 7-day streak.

## How streaks work

- A **quiz day** is a calendar day (in the group's time zone) with at least one published quiz that counts for streaks and has opened.
- A streak is the number of quiz days in a row a student completed.
- Days without a quiz neither extend nor break a streak, and a quiz that's still open doesn't break it yet.
- If weekends don't count, weekend quizzes are optional: they don't extend a streak, and missing one doesn't break it.
- Streaks are worked out from stored submissions and server time, never from the browser.

## Security and privacy

- **Minimal data.** Each account stores a username, a display name, a password hash and a role. There are no emails, phone numbers, birth dates, schools or surnames. Leaderboards only ever show display names, points, ranks and streaks.
- **Passwords** are hashed with scrypt, with a unique salt per password. Students need at least 8 characters, staff at least 12. Passwords set by a leader are temporary and must be changed at the next sign-in.
- **Sessions** are random 256-bit tokens in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` and `__Host-` prefixed in production). The database stores only a SHA-256 hash of each token. Sessions last 14 days for students and 12 hours for staff, and are revoked on password change, password reset, deactivation and role change.
- **Two-step verification** (TOTP, works with any authenticator app) is available for staff, and Settings can require it.
- **Rate limiting** is stored in the database, so it works across server instances. Five failed sign-ins per username in 15 minutes locks that username, and there are optional per-IP limits plus limits on 2FA codes and password changes.
- **CSRF:** all changes go through Next.js Server Actions, which reject cross-origin requests, and cookies are `SameSite=Lax`.
- **No IDOR:** student pages never take a user id from the URL. Everything is scoped to the signed-in user. Admin URLs return 404 to students.
- **No answer leaks:** the quiz-taking page only gets option ids and labels. Correct answers and explanations are only sent when the reveal rule allows. Unpublished and not-yet-open quizzes are never served to students.
- **No duplicate points:** there's a unique `(quiz, student)` index, and all of a student's point work runs in one transaction under a per-student advisory lock. Replayed or double-tapped submissions are rejected.
- **Headers:** a per-request nonce-based Content Security Policy, HSTS, `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy and a permissions policy.
- **Input** is validated with Zod on the server. All queries are parameterised through Drizzle ORM.

## Tech

Next.js 16 (App Router, Server Actions), React 19, TypeScript, PostgreSQL, Drizzle ORM, Zod, Tailwind CSS 4 and Vitest.

## Running locally

Requirements: Node 20.9+ and PostgreSQL 14+.

```bash
cd bible-challenge
npm install
cp .env.example .env          # set DATABASE_URL and ADMIN_PASSWORD
npm run db:migrate             # create tables
npm run db:seed                # default settings, badges, first admin account
npm run db:seed:demo           # optional: 12 demo students and two weeks of quizzes
npm run dev
```

Open http://localhost:3000 and sign in as the admin from `.env`. The demo students (`mark`, `david`, `matthew`, …) all use the password `bible-demo-2026`. The demo seed refuses to run when `NODE_ENV=production`.

### Tests

```bash
createdb bible_test           # once; the database name must contain "test"
TEST_DATABASE_URL=postgres://user:pass@localhost:5432/bible_test npm test
npm run typecheck
npm run lint
```

The tests run against a real Postgres database. They cover grading, short-answer matching, duplicate and concurrent submissions, ledger immutability, review and re-grade flows, reversals, streaks and streak bonuses, time zones, TOTP, password hashing, permissions and rate limiting.

## Deploying

Any host that runs a Node server plus a managed PostgreSQL database will work, for example Render, Railway, Fly.io, or Vercel with Neon or Supabase.

1. Create a PostgreSQL database and set `DATABASE_URL`. Set `DATABASE_SSL=true` if the provider requires TLS.
2. Set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (generate it with `openssl rand -base64 32`) so it stays the same across deploys and instances.
3. Set `TRUST_PROXY=true` if the platform puts a proxy in front of the app (most do). This enables per-IP rate limits.
4. Build and start with `npm ci && npm run build`, then `npm run db:migrate && npm start`.
5. Run `ADMIN_USERNAME=… ADMIN_PASSWORD=… npm run db:seed` once to create the first admin.
6. Sign in, open **Account security** and turn on two-step verification. Then go to **Settings** and set your time zone and point values.

Serve the app over HTTPS only. Production cookies are `Secure`.

**Locked out?** Anyone with shell access to the server can run `ADMIN_USERNAME=admin ADMIN_PASSWORD='new long password' npm run user:reset-admin`. This resets that admin's password, turns off their two-step verification and signs them out everywhere. The reset is recorded in the audit log.

## Project layout

```
src/
  app/(auth)/        sign in, two-step verification, change password, account security
  app/(student)/     dashboard, quiz, standings, history, study, profile
  app/admin/         admin panel (one folder per section, each with its own actions.ts)
  components/        UI kit, leaderboard, question editor, forms
  db/schema.ts       database schema
  lib/               auth (sessions, passwords, TOTP, guards), permissions, time zones, validation
  server/            domain logic: grading, submissions, ledger, streaks, leaderboard, achievements, seasons
drizzle/             SQL migrations, including the append-only ledger triggers
scripts/             migrate, seed, demo seed, admin recovery
tests/               Vitest suites (real Postgres)
```

After changing `src/db/schema.ts`, run `npm run db:generate` to create a migration, then `npm run db:migrate`.
