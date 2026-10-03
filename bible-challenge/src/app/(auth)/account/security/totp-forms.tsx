"use client";

import { useActionState } from "react";
import { initialFormState } from "@/components/form-state";
import { SubmitButton } from "@/components/submit-button";
import { Field, Input, Notice } from "@/components/ui";
import { confirmTotpSetupAction, disableTotpAction } from "../../actions";

export function ConfirmTotpForm() {
  const [state, action] = useActionState(confirmTotpSetupAction, initialFormState);
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Field label="6-digit code" htmlFor="code">
        <Input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={7} required />
      </Field>
      <SubmitButton size="lg" className="w-full" pendingText="Checking…">
        Turn on
      </SubmitButton>
    </form>
  );
}

export function DisableTotpForm() {
  const [state, action] = useActionState(disableTotpAction, initialFormState);
  return (
    <form action={action} className="flex flex-col gap-5">
      <p className="label">Turn off</p>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="Current code" htmlFor="code">
        <Input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={7} required />
      </Field>
      <SubmitButton variant="danger" pendingText="Working…">
        Turn off two-step verification
      </SubmitButton>
    </form>
  );
}
