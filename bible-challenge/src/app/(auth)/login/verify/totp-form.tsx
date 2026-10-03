"use client";

import { useActionState } from "react";
import { initialFormState } from "@/components/form-state";
import { SubmitButton } from "@/components/submit-button";
import { Field, Input, Notice } from "@/components/ui";
import { verifyTotpAction } from "../../actions";

export function TotpForm() {
  const [state, action] = useActionState(verifyTotpAction, initialFormState);
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Field label="Code" htmlFor="code">
        <Input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,7}"
          maxLength={7}
          required
          autoFocus
          className="numeral text-3xl tracking-[0.3em]"
        />
      </Field>
      <SubmitButton size="lg" pendingText="Checking…" className="w-full">
        Verify
      </SubmitButton>
    </form>
  );
}
