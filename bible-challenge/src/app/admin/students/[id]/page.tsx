import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { can } from "@/lib/permissions";
import { dateInTz, formatDate, formatDateTime } from "@/lib/time";
import { uuidSchema } from "@/lib/validation";
import { getBalance } from "@/server/ledger";
import { listSeasons } from "@/server/seasons";
import { getStudentDetail, ledgerWithActors, studentSubmissions } from "@/server/users-admin";
import { ActionForm } from "@/components/action-form";
import { LedgerTable } from "@/components/ledger-table";
import { SubmitButton } from "@/components/submit-button";
import { Checkbox, Field, Input, SectionHeading, Stat, Tag, formatPoints } from "@/components/ui";
import {
  adjustPointsAction,
  resetPasswordAction,
  setActiveAction,
  setSeasonsAction,
  updateStudentAction,
} from "../actions";

export const metadata: Metadata = { title: "Student" };

export default async function StudentDetailPage(props: PageProps<"/admin/students/[id]">) {
  const viewer = await requirePermission("students.view");
  const { id } = await props.params;
  if (!uuidSchema.safeParse(id).success) notFound();
  const detail = await getStudentDetail(db, id);
  if (!detail) notFound();
  const { user, streak, settings } = detail;
  const tz = settings.timezone;
  const [total, subs, ledger, seasons] = await Promise.all([
    getBalance(db, id),
    studentSubmissions(db, id),
    ledgerWithActors(db, { userId: id, limit: 200 }),
    listSeasons(db),
  ]);
  const canManage = can(viewer.role, "students.manage");
  const canPoints = can(viewer.role, "points.manage");

  return (
    <div className="flex flex-col gap-12">
      <header>
        <p className="label mb-2">
          <Link href="/admin/students" className="hover:text-ink">
            ← Students
          </Link>
        </p>
        <h1 className="display text-4xl sm:text-5xl flex flex-wrap items-center gap-3">
          {user.displayName}
          {!user.isActive && <Tag>Deactivated</Tag>}
          {user.mustChangePassword && <Tag tone="gold">Temporary password</Tag>}
        </h1>
        <p className="text-muted mt-1">
          @{user.username} · joined {formatDate(dateInTz(user.createdAt, tz), { year: "numeric" })} · last sign-in{" "}
          {user.lastLoginAt ? formatDateTime(user.lastLoginAt, tz) : "never"}
        </p>
      </header>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-y border-line py-6">
        <Stat label="Points" value={formatPoints(total)} />
        <Stat label="Streak" value={streak.current} sub={`Best ${streak.longest}`} />
        <Stat label="Quizzes" value={subs.length} />
        <Stat
          label="Perfect"
          value={subs.filter((s) => s.questionCount > 0 && s.correctCount === s.questionCount).length}
        />
      </dl>

      <div className="grid lg:grid-cols-2 gap-12">
        {canPoints && (
          <section id="adjust">
            <SectionHeading>Adjust points</SectionHeading>
            <ActionForm action={adjustPointsAction} resetOnSuccess>
              <input type="hidden" name="userId" value={user.id} />
              <Field label="Amount" htmlFor="amount" hint="Use a minus sign to remove points, e.g. -10">
                <Input id="amount" name="amount" type="number" inputMode="numeric" step={1} required className="max-w-40" />
              </Field>
              <Field label="Reason (student sees this)" htmlFor="reason">
                <Input id="reason" name="reason" required maxLength={120} placeholder="Memorized weekly verse" />
              </Field>
              <Field label="Private note (leaders only)" htmlFor="note">
                <Input id="note" name="note" maxLength={300} />
              </Field>
              <SubmitButton className="self-start" pendingText="Saving…">
                Record adjustment
              </SubmitButton>
            </ActionForm>
          </section>
        )}

        {canManage && (
          <section>
            <SectionHeading>Profile</SectionHeading>
            <ActionForm action={updateStudentAction}>
              <input type="hidden" name="id" value={user.id} />
              <Field label="Display name" htmlFor="displayName">
                <Input id="displayName" name="displayName" defaultValue={user.displayName} required maxLength={24} />
              </Field>
              <Field label="Username" htmlFor="username">
                <Input id="username" name="username" defaultValue={user.username} required maxLength={32} autoCapitalize="none" />
              </Field>
              <SubmitButton variant="secondary" className="self-start">
                Save profile
              </SubmitButton>
            </ActionForm>
          </section>
        )}

        {canManage && (
          <section>
            <SectionHeading>Seasons</SectionHeading>
            {seasons.length ? (
              <ActionForm action={setSeasonsAction}>
                <input type="hidden" name="id" value={user.id} />
                <div>
                  {seasons.map((s) => (
                    <Checkbox
                      key={s.id}
                      name="seasonIds"
                      value={s.id}
                      defaultChecked={detail.seasonIds.includes(s.id)}
                      label={s.name}
                      hint={`${formatDate(s.startsOn)} – ${formatDate(s.endsOn, { year: "numeric" })}${s.isActive ? "" : " · inactive"}`}
                    />
                  ))}
                </div>
                <SubmitButton variant="secondary" className="self-start">
                  Save seasons
                </SubmitButton>
              </ActionForm>
            ) : (
              <p className="text-muted text-sm">
                No seasons yet. <Link href="/admin/seasons" className="underline">Create one</Link>.
              </p>
            )}
          </section>
        )}

        {canManage && (
          <section>
            <SectionHeading>Account access</SectionHeading>
            <div className="flex flex-col gap-8">
              <ActionForm action={resetPasswordAction}>
                <input type="hidden" name="id" value={user.id} />
                <p className="text-sm text-muted">
                  Creates a one-time temporary password and signs them out of every device. Use this when a student forgets
                  their password.
                </p>
                <SubmitButton variant="secondary" className="self-start" confirm={`Reset ${user.displayName}'s password?`}>
                  Reset password
                </SubmitButton>
              </ActionForm>
              <ActionForm action={setActiveAction}>
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="active" value={user.isActive ? "false" : "true"} />
                <p className="text-sm text-muted">
                  {user.isActive
                    ? "Deactivating blocks sign-in and hides them from leaderboards. Their quiz and point history is kept."
                    : "Reactivating restores sign-in and their place on the leaderboard."}
                </p>
                <SubmitButton
                  variant={user.isActive ? "danger" : "secondary"}
                  className="self-start"
                  confirm={user.isActive ? `Deactivate ${user.displayName}?` : undefined}
                >
                  {user.isActive ? "Deactivate account" : "Reactivate account"}
                </SubmitButton>
              </ActionForm>
            </div>
          </section>
        )}
      </div>

      <section>
        <SectionHeading>Quiz history</SectionHeading>
        {subs.length ? (
          <ul className="divide-y divide-line">
            {subs.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/submissions/${s.id}`} className="flex items-baseline gap-4 py-2.5 text-sm hover:bg-raised -mx-2 px-2">
                  <span className="label w-16 shrink-0">{formatDate(s.quiz.quizDate)}</span>
                  <span className="flex-1 min-w-0 truncate">{s.quiz.title}</span>
                  {s.status === "pending_review" && <Tag tone="gold">Review</Tag>}
                  {s.editAllowed && <Tag tone="gold">Revision allowed</Tag>}
                  <span className="numeral text-lg">
                    {s.correctCount}/{s.questionCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-sm">No quizzes yet.</p>
        )}
      </section>

      <section>
        <SectionHeading>Point history</SectionHeading>
        <LedgerTable rows={ledger} tz={tz} canReverse={canPoints} />
      </section>
    </div>
  );
}
