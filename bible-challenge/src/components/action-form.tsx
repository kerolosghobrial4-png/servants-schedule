"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { initialFormState, type FormState } from "./form-state";
import { Notice, cx } from "./ui";

/**
 * Generic form wrapper for Server Actions: shows errors, field errors,
 * success messages and one-time secrets. Fields are passed as children so
 * they can be rendered on the server.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  secretLabel = "Temporary password",
}: {
  action: (state: FormState, fd: FormData) => Promise<FormState>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  secretLabel?: string;
}) {
  const [state, formAction] = useActionState(action, initialFormState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  const fieldErrors = Object.entries(state.fieldErrors ?? {});
  return (
    <form ref={ref} action={formAction} className={cx("flex flex-col gap-4", className)}>
      {state.error && (
        <Notice tone="error">
          {state.error}
          {fieldErrors.length > 0 && (
            <ul className="mt-1 list-disc pl-4">
              {fieldErrors.map(([k, v]) => (
                <li key={k}>
                  <span className="capitalize">{k.replace(/([A-Z])/g, " $1").replace(/\./g, " › ")}</span>: {v}
                </li>
              ))}
            </ul>
          )}
        </Notice>
      )}
      {state.ok && state.message && <Notice tone="success">{state.message}</Notice>}
      {state.ok && state.secret && (
        <div className="border border-gold/60 bg-gold/10 p-4">
          <p className="label text-gold">{secretLabel} — shown once</p>
          <p className="font-mono text-2xl mt-1 select-all break-all">{state.secret}</p>
          <p className="text-xs text-muted mt-2">
            Give this to the student privately. They&apos;ll be asked to choose their own password when they sign in.
          </p>
        </div>
      )}
      {children}
    </form>
  );
}
