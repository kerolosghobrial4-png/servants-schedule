"use client";

import { useActionState } from "react";
import { initialFormState } from "@/components/form-state";
import { SubmitButton } from "@/components/submit-button";
import { Field, Input, Notice } from "@/components/ui";
import { changePasswordAction } from "../actions";

export function ChangePasswordForm({ minLength }: { minLength: number }) {
  const [state, action] = useActionState(changePasswordAction, initialFormState);
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && <Notice tone="success">{state.message}</Notice>}
      <Field label="Current password" htmlFor="current" error={fe.current}>
        <Input id="current" name="current" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="New password" htmlFor="next" error={fe.next}>
        <Input id="next" name="next" type="password" autoComplete="new-password" minLength={minLength} required />
      </Field>
      <Field label="Confirm new password" htmlFor="confirm" error={fe.confirm}>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={minLength} required />
      </Field>
      <SubmitButton size="lg" pendingText="Saving…" className="w-full">
        Save password
      </SubmitButton>
    </form>
  );
}
