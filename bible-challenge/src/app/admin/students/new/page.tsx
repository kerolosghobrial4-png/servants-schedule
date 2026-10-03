import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { listSeasons } from "@/server/seasons";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Checkbox, Field, Input, PageTitle } from "@/components/ui";
import { createStudentAction } from "../actions";

export const metadata: Metadata = { title: "Add student" };

export default async function NewStudentPage() {
  await requirePermission("students.manage");
  const seasons = (await listSeasons(db)).filter((s) => s.isActive);
  return (
    <div className="max-w-lg">
      <p className="label mb-2">
        <Link href="/admin/students" className="hover:text-ink">
          ← Students
        </Link>
      </p>
      <PageTitle title="Add student">
        <p>
          Only a display name and username are needed. A temporary password is generated; the student picks their own on
          first sign-in. Don&apos;t use full names, emails or phone numbers.
        </p>
      </PageTitle>
      <ActionForm action={createStudentAction} resetOnSuccess>
        <Field label="Display name" htmlFor="displayName" hint="Shown on the leaderboard. A first name is plenty — e.g. “Mark” or “Mark W.”">
          <Input id="displayName" name="displayName" required maxLength={24} autoComplete="off" />
        </Field>
        <Field label="Username" htmlFor="username" hint="Used to sign in. Lowercase letters, numbers, dot, dash, underscore.">
          <Input id="username" name="username" required maxLength={32} autoCapitalize="none" autoComplete="off" spellCheck={false} />
        </Field>
        {seasons.length > 0 && (
          <fieldset>
            <legend className="label mb-1">Seasons</legend>
            {seasons.map((s) => (
              <Checkbox key={s.id} name="seasonIds" value={s.id} defaultChecked label={s.name} />
            ))}
          </fieldset>
        )}
        <SubmitButton pendingText="Creating…" className="self-start">
          Create account
        </SubmitButton>
      </ActionForm>
    </div>
  );
}
