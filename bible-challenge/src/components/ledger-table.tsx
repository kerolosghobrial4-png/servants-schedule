import Link from "next/link";
import type { PointCategory } from "@/db/schema";
import { formatDateTime } from "@/lib/time";
import { reversePointsAction } from "@/app/admin/students/actions";
import { ActionForm } from "./action-form";
import { CATEGORY_LABEL, PointAmount } from "./points";
import { SubmitButton } from "./submit-button";
import { EmptyState, Input, Tag } from "./ui";

export type LedgerRow = {
  id: string;
  amount: number;
  category: PointCategory;
  description: string;
  note: string | null;
  createdAt: Date;
  effectiveAt: Date;
  reversesId: string | null;
  isReversed: boolean;
  userId: string;
  studentName: string;
  actorName: string | null;
};

export function LedgerTable({
  rows,
  tz,
  canReverse,
  showStudent = false,
}: {
  rows: LedgerRow[];
  tz: string;
  canReverse: boolean;
  showStudent?: boolean;
}) {
  if (!rows.length) return <EmptyState title="No point entries" />;
  return (
    <ul className="divide-y divide-line border-y border-line">
      {rows.map((r) => (
        <li key={r.id} className="py-3 flex gap-4 items-start">
          <PointAmount amount={r.amount} className="text-2xl w-16 shrink-0 text-right" />
          <div className="flex-1 min-w-0">
            <p className="leading-snug">
              {showStudent && (
                <Link href={`/admin/students/${r.userId}`} className="font-semibold mr-2 hover:underline">
                  {r.studentName}
                </Link>
              )}
              <span className={r.isReversed ? "line-through text-dim" : undefined}>{r.description}</span>
            </p>
            <p className="text-xs text-dim mt-0.5 flex flex-wrap gap-x-2">
              <span>{CATEGORY_LABEL[r.category]}</span>
              <span>· {formatDateTime(r.createdAt, tz)}</span>
              {r.actorName && <span>· by {r.actorName}</span>}
              {r.note && <span className="text-muted">· “{r.note}”</span>}
            </p>
            {r.isReversed && (
              <span className="inline-block mt-1">
                <Tag>Reversed</Tag>
              </span>
            )}
          </div>
          {canReverse && !r.isReversed && r.category !== "reversal" && (
            <details className="shrink-0 text-right group">
              <summary className="label cursor-pointer list-none hover:text-ink py-1">Reverse</summary>
              <div className="mt-2 w-64 text-left">
                <ActionForm action={reversePointsAction}>
                  <input type="hidden" name="transactionId" value={r.id} />
                  <Input name="reason" required minLength={3} maxLength={200} placeholder="Why? (leaders only)" aria-label="Reason for reversal" />
                  <SubmitButton size="sm" variant="danger">
                    Reverse {r.amount > 0 ? "+" : ""}
                    {r.amount}
                  </SubmitButton>
                </ActionForm>
              </div>
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}
