import type { Metadata } from "next";
import Link from "next/link";
import { requireUser, homeFor } from "@/lib/auth/guards";
import { STAFF_MIN_PASSWORD, STUDENT_MIN_PASSWORD } from "@/lib/auth/password";
import { isStaff } from "@/lib/permissions";
import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = { title: "Change password" };

export default async function ChangePasswordPage() {
  const user = await requireUser({ allowPasswordChange: true });
  const min = isStaff(user.role) ? STAFF_MIN_PASSWORD : STUDENT_MIN_PASSWORD;
  return (
    <>
      <p className="label text-red-bright mb-3">{user.mustChangePassword ? "One more step" : "Account"}</p>
      <h1 className="display text-5xl mb-3">Choose a new password</h1>
      <p className="text-muted mb-8">
        {user.mustChangePassword
          ? "You're using a temporary password. Pick your own to continue."
          : "Changing your password signs you out on other devices."}{" "}
        Use at least {min} characters — a short phrase is easy to remember.
      </p>
      <ChangePasswordForm minLength={min} />
      {!user.mustChangePassword && (
        <Link href={homeFor(user.role)} className="inline-block mt-8 text-sm text-muted hover:text-ink">
          ← Back
        </Link>
      )}
    </>
  );
}
