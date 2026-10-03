import type { Metadata } from "next";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatDateTime } from "@/lib/time";
import { getSettings } from "@/server/settings";
import { listStaff } from "@/server/users-admin";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Checkbox, Field, Input, PageTitle, SectionHeading, Select, Tag } from "@/components/ui";
import { createStaffAction, saveSettingsAction, staffAction } from "./actions";

export const metadata: Metadata = { title: "Settings" };

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function SettingsPage() {
  const viewer = await requirePermission("settings.manage");
  const [s, staff] = await Promise.all([getSettings(db), listStaff(db)]);
  const zones = Intl.supportedValuesOf("timeZone");

  return (
    <div className="flex flex-col gap-14">
      <PageTitle eyebrow="Admin" title="Settings" />

      <ActionForm action={saveSettingsAction} className="gap-10 max-w-3xl">
        <section className="flex flex-col gap-4">
          <SectionHeading>Group</SectionHeading>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Group name" htmlFor="groupName">
              <Input id="groupName" name="groupName" defaultValue={s.groupName} maxLength={60} required />
            </Field>
            <Field label="Time zone" htmlFor="timezone" hint="Defines “today”, quiz times and weeks.">
              <Select id="timezone" name="timezone" defaultValue={s.timezone}>
                {zones.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </Select>
            </Field>
            <Field label="Week starts on" htmlFor="weekStartsOn">
              <Select id="weekStartsOn" name="weekStartsOn" defaultValue={String(s.weekStartsOn)}>
                {DAYS.map((d, i) => (
                  <option key={d} value={i}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading>Points</SectionHeading>
          <p className="text-sm text-muted -mt-2">
            Each submission keeps the values in force when it was taken, so changing these never rewrites past scores.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Default per question" htmlFor="defaultQuestion">
              <Input id="defaultQuestion" name="defaultQuestion" type="number" min={0} max={1000} defaultValue={s.points.defaultQuestion} />
            </Field>
            <Field label="Daily participation" htmlFor="participation">
              <Input id="participation" name="participation" type="number" min={0} max={1000} defaultValue={s.points.participation} />
            </Field>
            <Field label="Complete every question" htmlFor="completion">
              <Input id="completion" name="completion" type="number" min={0} max={1000} defaultValue={s.points.completion} />
            </Field>
            <Field label="Perfect quiz" htmlFor="perfect">
              <Input id="perfect" name="perfect" type="number" min={0} max={1000} defaultValue={s.points.perfect} />
            </Field>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading>Streaks</SectionHeading>
          <p className="text-sm text-muted -mt-2">
            A streak counts consecutive quiz days completed. Days without a quiz don&apos;t break a streak.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <Field label="Bonus every N days" htmlFor="bonusEvery" hint="0 turns the bonus off">
              <Input id="bonusEvery" name="bonusEvery" type="number" min={0} max={365} defaultValue={s.streak.bonusEvery} />
            </Field>
            <Field label="Bonus points" htmlFor="bonusPoints">
              <Input id="bonusPoints" name="bonusPoints" type="number" min={0} max={1000} defaultValue={s.streak.bonusPoints} />
            </Field>
          </div>
          <Checkbox
            name="weekendsCount"
            defaultChecked={s.streak.weekendsCount}
            label="Weekends count toward streaks"
            hint="When off, weekend quizzes are optional: doing them doesn't extend a streak, skipping them doesn't break one."
          />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading>Leaderboard</SectionHeading>
          <Field label="Default view for students" htmlFor="defaultPeriod" className="max-w-xs">
            <Select id="defaultPeriod" name="defaultPeriod" defaultValue={s.leaderboard.defaultPeriod}>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="all">All time</option>
              <option value="season">Current season</option>
            </Select>
          </Field>
          <Checkbox name="showStreaks" defaultChecked={s.leaderboard.showStreaks} label="Show streaks on the leaderboard" />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading>Security</SectionHeading>
          <Checkbox
            name="requireStaffTwoFactor"
            defaultChecked={s.security.requireStaffTwoFactor}
            label="Require two-step verification for leaders and admins"
            hint={viewer.totpEnabled ? "You already have it on." : "Set it up on your own account first (Account security), or you'll be asked to right away."}
          />
        </section>

        <SubmitButton className="self-start" pendingText="Saving…">
          Save settings
        </SubmitButton>
      </ActionForm>

      <section className="max-w-3xl">
        <SectionHeading>Staff accounts</SectionHeading>
        <p className="text-sm text-muted mb-4">
          <strong className="text-ink">Leaders</strong> create quizzes, review submissions and manage points.{" "}
          <strong className="text-ink">Admins</strong> also manage students, staff, seasons and settings.
        </p>
        <ul className="divide-y divide-line border-y border-line mb-8">
          {staff.map((u) => (
            <li key={u.id} className="py-3 flex flex-wrap items-center gap-3">
              <span className="flex-1 min-w-48">
                <span className="font-semibold">{u.displayName}</span> <span className="text-muted">@{u.username}</span>
                <span className="block text-xs text-dim">
                  Last sign-in {u.lastLoginAt ? formatDateTime(u.lastLoginAt, s.timezone) : "never"}
                </span>
              </span>
              <Tag tone={u.role === "admin" ? "gold" : "muted"}>{ROLE_LABELS[u.role]}</Tag>
              {u.totpEnabled ? <Tag tone="green">2-step on</Tag> : <Tag tone="red">2-step off</Tag>}
              {!u.isActive && <Tag>Deactivated</Tag>}
              {u.id !== viewer.id && (
                <details className="w-full sm:w-auto">
                  <summary className="label cursor-pointer list-none hover:text-ink">Manage</summary>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(u.role === "admin" ? ["make_leader"] : ["make_admin"]).concat(u.isActive ? ["deactivate"] : ["reactivate"], ["reset"]).map((op) => (
                      <ActionForm key={op} action={staffAction}>
                        <input type="hidden" name="id" value={u.id} />
                        <input type="hidden" name="op" value={op} />
                        <SubmitButton size="sm" variant={op === "deactivate" ? "danger" : "secondary"} confirm="Are you sure?">
                          {{ make_leader: "Make leader", make_admin: "Make admin", deactivate: "Deactivate", reactivate: "Reactivate", reset: "Reset password" }[op]}
                        </SubmitButton>
                      </ActionForm>
                    ))}
                  </div>
                </details>
              )}
            </li>
          ))}
        </ul>
        <p className="label mb-3">Add staff member</p>
        <ActionForm action={createStaffAction} resetOnSuccess className="max-w-md">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Display name" htmlFor="s-name">
              <Input id="s-name" name="displayName" required maxLength={24} />
            </Field>
            <Field label="Username" htmlFor="s-user">
              <Input id="s-user" name="username" required maxLength={32} autoCapitalize="none" />
            </Field>
          </div>
          <Field label="Role" htmlFor="s-role">
            <Select id="s-role" name="role" defaultValue="leader">
              <option value="leader">Leader</option>
              <option value="admin">Admin</option>
            </Select>
          </Field>
          <SubmitButton variant="secondary" className="self-start">
            Create staff account
          </SubmitButton>
        </ActionForm>
      </section>
    </div>
  );
}
