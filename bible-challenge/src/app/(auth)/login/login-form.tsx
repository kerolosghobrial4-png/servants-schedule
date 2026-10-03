"use client";

import { useActionState } from "react";
import { initialFormState } from "@/components/form-state";
import { SubmitButton } from "@/components/submit-button";
import { Field, Input, Notice } from "@/components/ui";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialFormState);
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Field label="Username" htmlFor="username">
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          maxLength={64}
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required maxLength={200} />
      </Field>
      <SubmitButton size="lg" pendingText="Signing in…" className="mt-2 w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}
