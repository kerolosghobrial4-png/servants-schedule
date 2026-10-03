import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import type { Achievement } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guards";
import { can } from "@/lib/permissions";
import { formatDateTime } from "@/lib/time";
import { ACHIEVEMENT_ICONS, CRITERIA_LABELS, listAchievementsWithCounts, recentAwards } from "@/server/achievements";
import { getSettings } from "@/server/settings";
import { listStudents } from "@/server/users-admin";
import { AchievementIcon } from "@/components/achievement-icon";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Checkbox, Field, Input, PageTitle, SectionHeading, Select, Tag } from "@/components/ui";
import { grantAchievementAction, revokeAchievementAction, saveAchievementAction } from "./actions";

export const metadata: Metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const viewer = await requirePermission("achievements.grant");
  const [list, students, awards, settings] = await Promise.all([
    listAchievementsWithCounts(db),
    listStudents(db, { status: "active" }),
    recentAwards(db),
    getSettings(db),
  ]);
  const manage = can(viewer.role, "achievements.manage");

  return (
    <div className="flex flex-col gap-12">
      <PageTitle eyebrow="Badges" title="Achievements">
        <p>Badges are earned automatically from their rules, or awarded by a leader. They can include a small point reward.</p>
      </PageTitle>

      <div className="grid xl:grid-cols-[1fr_24rem] gap-12">
        <section>
          <SectionHeading>All achievements</SectionHeading>
          <ul className="divide-y divide-line border-y border-line">
            {list.map((a) => (
              <li key={a.id} className="py-4">
                <div className="flex items-center gap-4">
                  <AchievementIcon icon={a.icon} earned={a.isActive} />
                  <div className="flex-1 min-w-0">
                    <p className="display text-xl">
                      {a.name} {!a.isActive && <Tag>Off</Tag>}
                    </p>
                    <p className="text-sm text-muted">{a.description}</p>
                    <p className="text-xs text-dim mt-0.5">
                      {CRITERIA_LABELS[a.criteria.type]}
                      {"threshold" in a.criteria ? `: ${a.criteria.threshold}` : ""}
                      {a.pointsReward ? ` · +${a.pointsReward} pts` : ""} · earned by {a.earnedCount}
                    </p>
                  </div>
                </div>
                {manage && (
                  <details className="mt-3 ml-16">
                    <summary className="label cursor-pointer hover:text-ink list-none">Edit</summary>
                    <div className="mt-3 max-w-lg">
                      <AchievementForm a={a} />
                    </div>
                  </details>
                )}
              </li>
            ))}
          </ul>
          {manage && (
            <details className="mt-6">
              <summary className="label cursor-pointer hover:text-ink list-none">+ New achievement</summary>
              <div className="mt-3 max-w-lg">
                <AchievementForm />
              </div>
            </details>
          )}
        </section>

        <div className="flex flex-col gap-12">
          <section>
            <SectionHeading>Award a badge</SectionHeading>
            <ActionForm action={grantAchievementAction} resetOnSuccess>
              <Field label="Student" htmlFor="g-user">
                <Select id="g-user" name="userId" required defaultValue="">
                  <option value="" disabled>
                    Choose…
                  </option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.displayName}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Badge" htmlFor="g-ach">
                <Select id="g-ach" name="achievementId" required defaultValue="">
                  <option value="" disabled>
                    Choose…
                  </option>
                  {list
                    .filter((a) => a.isActive)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                </Select>
              </Field>
              <Field label="Note (optional)" htmlFor="g-note">
                <Input id="g-note" name="note" maxLength={200} placeholder="Memorized Psalm 23" />
              </Field>
              <SubmitButton className="self-start">Award</SubmitButton>
            </ActionForm>
          </section>
          <section>
            <SectionHeading>Recently earned</SectionHeading>
            <ul className="divide-y divide-line">
              {awards.map((w) => (
                <li key={w.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className="flex-1 min-w-0">
                    <Link href={`/admin/students/${w.userId}`} className="font-semibold hover:underline">
                      {w.studentName}
                    </Link>{" "}
                    <span className="text-gold">{w.name}</span>
                    <span className="block text-xs text-dim">
                      {formatDateTime(w.awardedAt, settings.timezone)}
                      {w.note && ` · ${w.note}`}
                    </span>
                  </span>
                  <ActionForm action={revokeAchievementAction}>
                    <input type="hidden" name="id" value={w.id} />
                    <SubmitButton size="sm" variant="ghost" confirm={`Remove ${w.name} from ${w.studentName}?`}>
                      Remove
                    </SubmitButton>
                  </ActionForm>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function AchievementForm({ a }: { a?: Achievement }) {
  const threshold = a && "threshold" in a.criteria ? a.criteria.threshold : "";
  return (
    <ActionForm action={saveAchievementAction}>
      {a && <input type="hidden" name="id" value={a.id} />}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" htmlFor={`n-${a?.id ?? "new"}`}>
          <Input id={`n-${a?.id ?? "new"}`} name="name" defaultValue={a?.name} required maxLength={40} />
        </Field>
        <Field label="Key" htmlFor={`k-${a?.id ?? "new"}`} hint="Internal id, e.g. psalm-23">
          <Input id={`k-${a?.id ?? "new"}`} name="key" defaultValue={a?.key} required maxLength={40} />
        </Field>
      </div>
      <Field label="Description" htmlFor={`d-${a?.id ?? "new"}`}>
        <Input id={`d-${a?.id ?? "new"}`} name="description" defaultValue={a?.description} required maxLength={200} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Rule" htmlFor={`c-${a?.id ?? "new"}`}>
          <Select id={`c-${a?.id ?? "new"}`} name="criteriaType" defaultValue={a?.criteria.type ?? "quizzes_completed"}>
            {Object.entries(CRITERIA_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Target" htmlFor={`t-${a?.id ?? "new"}`} hint="Not used for leader-awarded">
          <Input id={`t-${a?.id ?? "new"}`} name="threshold" type="number" min={1} defaultValue={threshold} />
        </Field>
        <Field label="Icon" htmlFor={`i-${a?.id ?? "new"}`}>
          <Select id={`i-${a?.id ?? "new"}`} name="icon" defaultValue={a?.icon ?? "star"}>
            {ACHIEVEMENT_ICONS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </Select>
        </Field>
        <Field label="Point reward" htmlFor={`p-${a?.id ?? "new"}`}>
          <Input id={`p-${a?.id ?? "new"}`} name="pointsReward" type="number" min={0} max={1000} defaultValue={a?.pointsReward ?? 0} />
        </Field>
        <Field label="Order" htmlFor={`o-${a?.id ?? "new"}`}>
          <Input id={`o-${a?.id ?? "new"}`} name="position" type="number" min={0} defaultValue={a?.position ?? 50} />
        </Field>
      </div>
      <Checkbox name="isActive" defaultChecked={a?.isActive ?? true} label="Active" />
      <SubmitButton variant="secondary" className="self-start">
        {a ? "Save" : "Create"}
      </SubmitButton>
    </ActionForm>
  );
}
