"use client";

import { useState, useTransition } from "react";
import { QuestionFields } from "@/components/question-editor";
import { toPayload, type EditorQuestion } from "@/lib/question-model";
import { Button, Notice } from "@/components/ui";
import { saveBankQuestionAction } from "./actions";

export function BankQuestionForm({ id, initial }: { id: string | null; initial: EditorQuestion }) {
  const [q, setQ] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  function save() {
    setError(null);
    setErrors({});
    // Quiz-only fields (id, sourceQuestionId, saveToBank) are stripped by the server schema.
    const payload = toPayload(q);
    start(async () => {
      const res = await saveBankQuestionAction(id, payload);
      if (res?.error) {
        setError(res.error);
        setErrors(
          Object.fromEntries(Object.entries(res.fieldErrors ?? {}).map(([k, v]) => [k.replace(/^meta\./, ""), v])),
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {error && (
        <Notice tone="error">
          {error} {Object.values(errors).join(" ")}
        </Notice>
      )}
      <QuestionFields q={q} onChange={setQ} showBankToggle={false} errors={errors} />
      <Button type="button" onClick={save} disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save question"}
      </Button>
    </div>
  );
}
