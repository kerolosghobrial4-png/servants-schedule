"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { Button, Checkbox, Field, Notice, Textarea } from "@/components/ui";
import { importStudentsAction, type ImportState } from "../actions";

export function ImportForm({ seasons }: { seasons: { id: string; name: string }[] }) {
  const [state, action] = useActionState<ImportState, FormData>(importStudentsAction, {});

  if (state.ok && state.created) {
    return (
      <div className="flex flex-col gap-6">
        <Notice tone="success">{state.message} These passwords are shown only once — print or copy them now.</Notice>
        <table className="w-full text-left border-collapse print:text-black">
          <thead>
            <tr className="border-b border-line">
              <th className="label py-2">Name</th>
              <th className="label py-2">Username</th>
              <th className="label py-2">Temporary password</th>
            </tr>
          </thead>
          <tbody>
            {state.created.map((c) => (
              <tr key={c.username} className="border-b border-line">
                <td className="py-2 pr-4">{c.displayName}</td>
                <td className="py-2 pr-4 font-mono">{c.username}</td>
                <td className="py-2 font-mono text-gold select-all">{c.temporaryPassword}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-3 print:hidden">
          <Button type="button" onClick={() => window.print()}>
            Print
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigator.clipboard.writeText(
                state.created!.map((c) => `${c.displayName}\t${c.username}\t${c.temporaryPassword}`).join("\n"),
              )
            }
          >
            Copy all
          </Button>
        </div>
        <p className="text-xs text-dim">Each student chooses their own password the first time they sign in.</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && (
        <Notice tone="error">
          <span className="whitespace-pre-line">{state.error}</span>
        </Notice>
      )}
      <Field
        label="One student per line"
        htmlFor="names"
        hint="Just a display name, or “name, username”. Usernames are made up automatically when left out."
      >
        <Textarea id="names" name="names" rows={12} required placeholder={"Mark\nAndrew\nJohn S., johns"} className="font-mono" />
      </Field>
      {seasons.length > 0 && (
        <fieldset>
          <legend className="label mb-1">Add to seasons</legend>
          {seasons.map((s) => (
            <Checkbox key={s.id} name="seasonIds" value={s.id} defaultChecked label={s.name} />
          ))}
        </fieldset>
      )}
      <SubmitButton pendingText="Creating accounts…" className="self-start">
        Create accounts
      </SubmitButton>
    </form>
  );
}
